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

import Slp from './slp-lib/slp'

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

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeStep: 0,
      tokenProps: {},
    }
  }

  componentDidMount() {
    let slp = new Slp()
    this.setState({
      slp: slp,
      paymentAddress: slp.cashAddress
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
      this.state.slp.buildGenesisOpReturn(
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
      // TODO: Notify user
      console.log(ex) 
    }
  }

  reviewToken = (isFixedSupply, batonAddress, addressQuantities) => {
    try {
      // Build Genesis OpReturn
      let batonVout = isFixedSupply ? null : 2
      let initialQuantity = addressQuantities.reduce((acc, cur) => acc + parseInt(cur.quantity), 0)
      let genesisOpReturn = this.state.slp.buildGenesisOpReturn(
        this.state.tokenProps.ticker,
        this.state.tokenProps.name,
        this.state.tokenProps.urlOrEmail,
        this.state.tokenProps.decimalPlaces,
        batonVout,
        initialQuantity,
      )

      // Build send OpReturn (check for protocol errors)
      let outputQtyArray = addressQuantities.map((aq) => aq.quantity)
      this.state.slp.buildSendOpReturn(
        '0000000000000000000000000000000000000000000000000000000000000000',
        this.state.tokenProps.decimalPlaces,
        outputQtyArray,
      )
      
      // Monitor for payment / create token on payment
      batonAddress = isFixedSupply ? null : batonAddress
      let outputAddressArray = addressQuantities.map((aq) => aq.address)
      const onPayment = async () => {
        // Create genesis tx
        let genesisChangeUtxo = await this.state.slp.sendGenesisTx(genesisOpReturn, batonAddress)
        let genesisTxid = genesisChangeUtxo.txid

        // Build send opReturn with genesis txid
        let sendOpReturn = this.state.slp.buildSendOpReturn(
          genesisTxid,
          this.state.tokenProps.decimalPlaces,
          outputQtyArray,
        )

        let sendTxid = await this.state.slp.sendSendTx(genesisChangeUtxo, sendOpReturn, outputAddressArray, this.state.paymentAddress)

        this.setState({
          activeStep: this.nextStep(),
          tokenId: genesisTxid,
        })
      }

      // calculate fee
      let fee = this.state.slp.calcFee(batonAddress, outputAddressArray)

      this.state.slp.monitorForPayment(fee, onPayment.bind(this))

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
      // TODO: Notify user
      console.log(ex)
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
      <MuiThemeProvider theme={theme}>
        <Header />
        <StepContainer>
          { stepComponent }
        </StepContainer>
        <CreateTokenStepper activeStep={this.state.activeStep} />
        {/* <Footer /> */}
      </MuiThemeProvider>
    );
  }
}

export default App;
