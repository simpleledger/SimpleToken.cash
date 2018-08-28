import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Header from './Header'
import StepContainer from './StepContainer'
import Intro from './Intro'
import CreateTokenForm from './CreateTokenForm'
import Distribution from './Distribution'
import Invoice from './Invoice'
import Done from './Done'
import CreateTokenStepper from './CreateTokenStepper'
import Footer from './Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.min.css'

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
let BITBOX = new BITBOXCli()

let slp = require('slpjs').slp
let slputils = require('slpjs').slputils
let network = require('slpjs').network
let bchaddr = require('bchaddrjs-slp')

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#F59332",
    },
    secondary: {
      main: "#4D4D4D",
    },
  },
})

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeStep: 0,
      tokenProps: {},
    }

    let mnemonic = BITBOX.Mnemonic.generate(256)
    let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)
    let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash')
    let hdNode = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
    let node0 = BITBOX.HDNode.derivePath(hdNode, "0/0")
    this.keyPair = BITBOX.HDNode.toKeyPair(node0)
    let wif = BITBOX.ECPair.toWIF(this.keyPair)
    let ecPair = BITBOX.ECPair.fromWIF(wif)
    this.address = BITBOX.ECPair.toLegacyAddress(ecPair)
    this.cashAddress = BITBOX.Address.toCashAddress(this.address)
    this.slpAddress = bchaddr.toSlpAddress(this.cashAddress)

    // TODO: Save mnemonic to local storage for emergency recovery
  }

  componentDidMount() {
    this.setState({
      paymentAddress: this.cashAddress
    })
  }

  nextStep = () => {
    return this.state.activeStep + 1
  }

  defineToken = () => {
    this.setState({
      activeStep: this.nextStep(),
    })
  }

  defineDistribution = (tokenProps) => {
    // Attempt to build genesis with initial properties
    try {
      slp.buildGenesisOpReturn(
        tokenProps.ticker,
        tokenProps.name,
        tokenProps.urlOrEmail,
        tokenProps.decimalPlaces,
        null,
        1,
      )

      this.setState({
        activeStep: this.nextStep(),
        tokenProps: tokenProps,
      })
    } catch (ex) {
      console.log(ex) 

      // Notify user
      if (ex != null && ex.message != null) {
        toast(ex.message)
      }
    }
  }

  reviewToken = (isFixedSupply, batonAddress, addressQuantities) => {
    try {
      // Build Genesis OpReturn
      let batonVout = isFixedSupply ? null : 2
      let initialQuantity = addressQuantities.reduce((acc, cur) => acc + parseInt(cur.quantity), 0)
      let genesisOpReturn = slp.buildGenesisOpReturn(
        this.state.tokenProps.ticker,
        this.state.tokenProps.name,
        this.state.tokenProps.urlOrEmail,
        this.state.tokenProps.decimalPlaces,
        batonVout,
        initialQuantity,
      )

      // Build send OpReturn (check for protocol errors)
      let outputQtyArray = addressQuantities.map((aq) => aq.quantity)
      slp.buildSendOpReturn(
        '0000000000000000000000000000000000000000000000000000000000000000',
        this.state.tokenProps.decimalPlaces,
        outputQtyArray,
      )
      
      // Validate batonAddress SLP format if nonfixed supply
      if (!isFixedSupply && !bchaddr.isSlpAddress(batonAddress)){
        throw new Error("Not an SLP address.");
      } 
      batonAddress = isFixedSupply ? null : batonAddress

      // Validate each output address SLP format and build array
      let outputAddressArray = addressQuantities.map((aq) => {
        if(!bchaddr.isSlpAddress(aq.address)){
          throw new Error("Not an SLP address.");
        }
        return aq.address
      })

      // Monitor for payment / create token on payment
      const onPayment = async () => {
        // Create genesis tx
        let genesisTxData = await network.buildRawGenesisTx(this.slpAddress, this.keyPair, genesisOpReturn, batonAddress)
        let genesisTxid = await network.sendTx(genesisTxData.hex);

        // Build send opReturn with genesis txid
        let sendOpReturn = slp.buildSendOpReturn(
          genesisTxid,
          this.state.tokenProps.decimalPlaces,
          outputQtyArray,
        )

        let sendTxHex = await network.buildRawSendTx(this.keyPair, genesisTxid, 1, genesisTxData.satoshis, sendOpReturn, outputAddressArray, this.state.paymentAddress)
        let sendTxId = await network.sendTx(sendTxHex);

        this.setState({
          activeStep: this.nextStep(),
          tokenId: genesisTxid,
        })
      }

      // calculate fee
      let fee = slputils.calculateFee(batonAddress, outputAddressArray)

      network.monitorForPayment(this.state.paymentAddress, fee, onPayment.bind(this))

      // Update tokenProps
      let tokenProps = this.state.tokenProps
      tokenProps.isFixedSupply = isFixedSupply
      tokenProps.batonAddress = batonAddress
      tokenProps.initialQuantity = initialQuantity
      tokenProps.addressQuantities = addressQuantities

      this.setState({
        activeStep: this.nextStep(),
        tokenProps: tokenProps,
        fee: fee,
      })
    } catch (ex) {
      console.log(ex)

      // Notify user
      if (ex != null && ex.message != null) {
        toast(ex.message)
      }
    }
  }

  render() {
    let stepComponent = null
    switch(this.state.activeStep) {
      case 0:
        stepComponent = <Intro defineToken={this.defineToken} />
        break
      case 1:
        stepComponent = <CreateTokenForm defineDistribution={this.defineDistribution} />
        break
      case 2:
        stepComponent = <Distribution reviewToken={this.reviewToken} />
        break
      case 3:
        stepComponent = <Invoice 
            {...this.state.tokenProps}
            paymentAddress={this.state.paymentAddress}
            fee={this.state.fee}
          />
        break
      case 4:
        stepComponent = <Done {...this.state.tokenProps} tokenId={this.state.tokenId} />
    }

    return (
      <div>
      <MuiThemeProvider theme={theme}>
        <Header />
        <StepContainer>
          { stepComponent }
        </StepContainer>
        <CreateTokenStepper activeStep={this.state.activeStep} />
        {/* <Footer /> */}
      </MuiThemeProvider>
      <ToastContainer />
      </div>
    );
  }
}

export default App;
