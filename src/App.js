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
let network = require('slpjs').bitbox
let bchaddr = require('bchaddrjs-slp')
let BigNumber = require('bignumber.js')

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

//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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
    this.wif = BITBOX.ECPair.toWIF(this.keyPair)
    let ecPair = BITBOX.ECPair.fromWIF(this.wif)
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
      slp.buildGenesisOpReturn({
        ticker: tokenProps.ticker,
        name: tokenProps.name,
        urlOrEmail: tokenProps.urlOrEmail,
        hash: null,
        decimals: parseInt(tokenProps.decimalPlaces),
        batonVout: null, // normally this is null (for fixed supply) or 2 for flexible
        initialQuantity: new BigNumber(0)
      })

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
  //MAX_NUMBER = new BigNumber('18446744073709551615')
  reviewToken = (isFixedSupply, batonAddress, addressQuantities) => {
    try {
      // Build Genesis OpReturn
      let batonVout = isFixedSupply ? null : 2
      let initialQuantity = addressQuantities.reduce((acc, cur) => (new BigNumber(cur.quantity)).plus(acc), new BigNumber(0));
      let MAX_QTY = new BigNumber('18446744073709551615').dividedBy(10 ** parseInt(this.state.tokenProps.decimalPlaces));
      if (initialQuantity.isGreaterThan(MAX_QTY)) {
        throw new Error("Maximum total send token quantity exceeded.  Reduce input quantity below " + MAX_QTY.toString());
      }
      let genesisOpReturn = slp.buildGenesisOpReturn(
        {
          ticker: this.state.tokenProps.ticker,
          name: this.state.tokenProps.name,
          urlOrEmail: this.state.tokenProps.urlOrEmail,
          hash: null,
          decimals: parseInt(this.state.tokenProps.decimalPlaces),
          batonVout: batonVout,
          initialQuantity: initialQuantity.times(10 ** parseInt(this.state.tokenProps.decimalPlaces))
        })

      // Build send OpReturn (check for protocol errors)
      let outputQtyArray = addressQuantities.map((aq) => (new BigNumber(aq.quantity)).times(10 ** parseInt(this.state.tokenProps.decimalPlaces)));
      let sendOpReturn = slp.buildSendOpReturn({
        tokenIdHex: '0000000000000000000000000000000000000000000000000000000000000000',
        outputQtyArray: outputQtyArray,
      })

      // Validate batonAddress SLP format if nonfixed supply
      if (!isFixedSupply && !bchaddr.isSlpAddress(batonAddress)) {
        throw new Error("Not an SLP address.");
      }
      batonAddress = isFixedSupply ? null : batonAddress

      // Validate each output address SLP format and build array
      let outputAddressArray = addressQuantities.map((aq) => {
        if (!bchaddr.isSlpAddress(aq.address)) {
          throw new Error("Not an SLP address.");
        }
        return aq.address
      })

      // Monitor for payment / create token on payment
      const onPayment = async () => {

        let utxo = (await network.getUtxoWithRetry(this.cashAddress))[0];

        // calculate the amount the mint holder needs to cover the SEND txn
        let mintReceiverSatoshis = sendTxCost

        let genesisTxHex = slp.buildRawGenesisTx({
          slpGenesisOpReturn: genesisOpReturn,
          mintReceiverAddress: this.slpAddress,
          mintReceiverSatoshis: mintReceiverSatoshis,
          batonReceiverAddress: batonAddress,
          batonReceiverSatoshis: 546,
          bchChangeReceiverAddress: null,
          input_utxos: [{
            txid: utxo.txid,
            vout: utxo.vout,
            satoshis: utxo.satoshis,
            wif: this.wif
          }]
        })

        console.log("GENESIS Tx Size (bytes): " + (genesisTxHex.length / 2).toString())
        let genesisTxid = await network.sendTx(genesisTxHex);

        // Build send opReturn with genesis txid
        let sendOpReturn = slp.buildSendOpReturn({
          tokenIdHex: genesisTxid,
          outputQtyArray: outputQtyArray,
        })

        let sendTxHex = slp.buildRawSendTx({
          slpSendOpReturn: sendOpReturn,
          input_token_utxos: [
            {
              txid: genesisTxid,
              vout: 1,
              satoshis: mintReceiverSatoshis,
              wif: this.wif
            }
          ],
          tokenReceiverAddressArray: outputAddressArray,
          bchChangeReceiverAddress: null
        })

        console.log("SEND Tx Size (bytes): " + (sendTxHex.length / 2).toString())
        let sendTxId = await network.sendTx(sendTxHex);

        this.setState({
          activeStep: this.nextStep(),
          tokenId: genesisTxid,
        })
      }

      // calculate user's cost (outputs + minerFee)
      let genesisTxCost = slp.calculateGenesisCost(genesisOpReturn.length, 1, batonAddress)
      let sendTxCost = slp.calculateSendCost(sendOpReturn.length, 1, outputAddressArray.length)
      let userCost = genesisTxCost + sendTxCost - 546 // subtract double counted dust output from Genesis Mint

      network.monitorForPayment(this.state.paymentAddress, userCost, onPayment.bind(this))

      // Update tokenProps
      let tokenProps = this.state.tokenProps
      tokenProps.isFixedSupply = isFixedSupply
      tokenProps.batonAddress = batonAddress
      tokenProps.initialQuantity = initialQuantity.toString()
      tokenProps.addressQuantities = addressQuantities

      this.setState({
        activeStep: this.nextStep(),
        tokenProps: tokenProps,
        fee: userCost,
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
    switch (this.state.activeStep) {
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
            {stepComponent}
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
