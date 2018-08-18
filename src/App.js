import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Header from './Header'
import StepContainer from './StepContainer'
import Intro from './Intro'
import CreateToken from './CreateToken'
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

  defineToken = () => {
    this.setState({
      activeStep: 1,
    })
  }

  createToken = (tokenProps) => {
    let slp = new Slp();
    
    // slp.buildGenesisTx(
    //   tokenProps.ticker,
    //   tokenProps.name,
    //   tokenProps.urlOrEmail,
    //   tokenProps.decimalPlaces,
    //   tokenProps.initialQuantity,
    //   tokenProps.slpAddress,
    // )

    this.setState({
      activeStep: 2,
      tokenProps: tokenProps,
    })
  }

  fundToken = () => {
    // slp.monitorForPayment()

    this.setState({
      activeStep: 3
    })
  }

  render() {
    let stepComponent = null
    switch(this.state.activeStep) {
      case 0:
        stepComponent = <CreateToken defineToken={this.defineToken} />
        break
      case 1:
        stepComponent = <CreateTokenForm createToken={this.createToken} />
        break
      case 2:
        stepComponent = <Distribution />
        break
      case 3:
        stepComponent = <Invoice {...this.state.tokenProps} />
        break
      case 4:
        stepComponent = <Done {...this.state.tokenProps} />
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <StepContainer>
          { stepComponent }
        </StepContainer>
        <CreateTokenStepper activeStep={this.state.activeStep} />
        <Footer />
      </MuiThemeProvider>
    );
  }
}

export default App;
