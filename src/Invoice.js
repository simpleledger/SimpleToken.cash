import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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

    let batonAddress = ""
    if (!this.props.isFixedSupply) {
        batonAddress = <div>
            <b>Baton Address</b> {this.props.batonAddress} <br/>
        </div>;
    }

    let initialDistribution = this.props.addressQuantities.map((aq, index) => {
        return <div key={[index, ...aq]}>
            <b>{aq.address}</b> {aq.quantity}
        </div>;
    })

    return (
      <div className={classes.root}>
        <Typography variant="headline" component="h3">
            Review
        </Typography>
        <div>
            <b>Name</b> {this.props.name} <br/>
            <b>Ticker</b> {this.props.ticker} <br/>
            <b>URL</b> {this.props.urlOrEmail} <br/>
            <b>Decimal Places</b> {this.props.decimalPlaces} <br/>
            <b>Initial Quantity</b> {this.props.initialQuantity} <br/>
            <b>Fixed Supply</b> { this.props.isFixedSupply ? "Yes" : "No" } <br/>
            {batonAddress}
            <b>Initial Distribution</b> {initialDistribution} <br/>
        </div> <br/>
        <Typography variant="title">
            Pay Mining Fee
        </Typography>
        <div>
            Send {this.props.fee} satoshis to {this.props.paymentAddress}
        </div>
        
        <QRCode value={this.props.paymentAddress} />

        <br/>
        Waiting for payment... <br/>
      </div>
    );
  }
}

Invoice.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Invoice);
