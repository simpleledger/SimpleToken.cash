import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography'
import QRCode from 'qrcode.react';
import Button from '@material-ui/core/Button';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    fieldsetLegend: {
        fontSize: '1.3rem'
    },
    initialDistributionAddresses: {
        marginLeft: '10px'
    }
});

class Invoice extends Component {
    render () {
        const { classes } = this.props;

        let batonAddress = '';
        if (!this.props.isFixedSupply) {
            batonAddress = <div>
                <b>Baton Address</b> {this.props.batonAddress} <br/>
            </div>;
        }

        let initialDistribution = this.props.addressQuantities.map((aq, index) => {
            return <div key={[index, ...aq]}>
                <b>{aq.address}</b> {aq.quantity}
            </div>;
        });

        return (
            <div className={classes.root}>
                <fieldset>
                    <legend className={classes.fieldsetLegend}>Review</legend>
                    <b>Name</b> {this.props.name} <br/>
                    <b>Ticker</b> {this.props.ticker} <br/>
                    <b>Token Document URL</b> {this.props.tokenDocURL} <br/>
                    <b>Decimal Places</b> {this.props.decimalPlaces} <br/>
                    <b>Initial Quantity</b> {this.props.initialQuantity} <br/>
                    <b>Fixed Supply</b> { this.props.isFixedSupply ? 'Yes' : 'No' } <br/>
                    {batonAddress}
                    <b>Initial Distribution</b>
                    <div className={classes.initialDistributionAddresses}>
                        {initialDistribution}
                    </div>
                </fieldset> <br/>

                <fieldset>
                    <legend className={classes.fieldsetLegend}>Pay Mining Fee</legend>
                    <div>
                Send {this.props.fee} satoshis to {this.props.paymentAddress}
                    </div>

                    <QRCode value={this.props.paymentAddress} />

                    <br/>
            Waiting for payment... <br/>
                </fieldset>

                <br/>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={ () => this.props.toPreviousStep() }
                >
            Back
                </Button>
            </div>
        );
    }
}

Invoice.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(Invoice);
