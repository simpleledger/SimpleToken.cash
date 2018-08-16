import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Header from './Header'
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
    
    slp.buildGenesisTx(
      tokenProps.ticker,
      tokenProps.name,
      tokenProps.urlOrEmail,
      tokenProps.decimalPlaces,
      tokenProps.initialQuantity,
      tokenProps.slpAddress,
    )

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
    return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <Intro />
        <CreateToken defineToken={this.defineToken} />
        <CreateTokenForm createToken={this.createToken} />
        <Distribution />
        <Invoice {...this.state.tokenProps} />
        <Done {...this.state.tokenProps} />
        <CreateTokenStepper activeStep={this.state.activeStep} />
        <Footer />
      </MuiThemeProvider>
    );
  }
}

export default App;
