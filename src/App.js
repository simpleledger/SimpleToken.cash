import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Header from './Header'
import Intro from './Intro'
import CreateToken from './CreateToken'
import CreateTokenForm from './CreateTokenForm'
import Footer from './Footer'

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
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <Intro />
        <CreateToken />
        <CreateTokenForm />
        <Footer />
      </MuiThemeProvider>
    );
  }
}

export default App;
