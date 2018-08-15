import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import QRCode from 'qrcode.react'

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Invoice extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
                Review
            </Typography>
            <Typography component="p">
                <b>Name</b> {this.props.name} <br/>
                <b>Ticker</b> {this.props.ticker} <br/>
                <b>URL</b> {this.props.urlOrEmail} <br/>
                <b>Decimal Places</b> {this.props.decimalPlaces} <br/>
                <b>Initial Quantity</b> {this.props.initialQuantity} <br/>
                <b>Initial Distribution</b> {this.props.slpAddress} <br/>
            </Typography> <br/>
            <Typography variant="title">
                Pay Mining Fee
            </Typography>
            <Typography component="p">
                Send 0.00005000 BCH to bitcoincash:address
            </Typography>
            
            <QRCode value="bitcoincash:address" />

            <br/>
            Waiting for payment... <br/>
            Payment found. Minting tokens... <br/>
        </Paper>
      </div>
    );
  }
}

Invoice.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Invoice);
