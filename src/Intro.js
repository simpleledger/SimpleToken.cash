import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class Intro extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
                Simple Ledger Protocol
            </Typography>
            <Typography component="p">
                Mint millions of tokens on the BCH blockchain in under 2 minutes.
            </Typography>
        </Paper>
      </div>
    );
  }
}

Intro.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Intro);
