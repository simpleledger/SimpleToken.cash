import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Done extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
                Token Creation Successful
            </Typography>
            <Typography component="p">
                <b>Token ID</b> tokenId <br/>
                <b>Name</b> {this.props.name} <br/>
                <b>Ticker</b> {this.props.ticker} <br/>
                <b>URL</b> {this.props.urlOrEmail} <br/>
                <b>Decimal Places</b> {this.props.decimalPlaces} <br/>
                <b>Initial Quantity</b> {this.props.initialQuantity} <br/>
                <b>Initial Distribution</b> {this.props.slpAddress} <br/>
            </Typography> <br/>
        </Paper>
      </div>
    );
  }
}

Done.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Done);
