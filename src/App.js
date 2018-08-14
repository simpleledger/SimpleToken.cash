import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Header from './Header'
import Intro from './Intro'
import CreateToken from './CreateToken'
import CreateTokenForm from './CreateTokenForm'
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
    }
  }

  defineToken = () => {
    this.setState({
      activeStep: 1
    })
  }

  createToken = (name, ticker, urlOrEmail, decimalPlaces, initialQuantity, addressQuantities) => {
    let slp = new Slp();
    slp.buildInitTx(
      'tick',
      'tname',
      'bitcoincash.org',
      0,
      10
    )

    this.setState({
      activeStep: 2
    })
  }

  fundToken = () => {
    this.setState({
      activeStep: 3
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <Intro />
        <CreateToken />
        <CreateTokenForm createToken={this.createToken} />
        <CreateTokenStepper activeStep={this.state.activeStep} />
        <Footer />
      </MuiThemeProvider>
    );
  }
}

export default App;
