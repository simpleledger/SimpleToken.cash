import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

class Done extends Component {
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
                <Typography variant="headline" component="h3">
            Token Creation Successful
                </Typography>
                <div>
                    <b>Token ID</b> {this.props.tokenId} <br/>
                    <b>Name</b> {this.props.name} <br/>
                    <b>Ticker</b> {this.props.ticker} <br/>
                    <b>Token Document URL</b> {this.props.tokenDocURL} <br/>
                    <b>Decimal Places</b> {this.props.decimalPlaces} <br/>
                    <b>Initial Quantity</b> {this.props.initialQuantity} <br/>
                    <b>Fixed Supply</b> { this.props.isFixedSupply ? 'Yes' : 'No' } <br/>
                    {batonAddress}
                    <b>Initial Distribution</b> {initialDistribution} <br/>
                </div> <br/>
            </div>
        );
    }
}

Done.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(Done);
