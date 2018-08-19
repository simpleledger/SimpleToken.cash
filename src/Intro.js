import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class Intro extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography variant="headline" component="h3">
            Create Your Token Now
        </Typography>
        <Typography component="p">
            Mint millions of tokens on the BCH blockchain in under 2 minutes.
        </Typography>
        <Button 
            variant="contained" 
            color="primary" 
            className={classes.button}
            onClick={this.props.defineToken}
        >
            Define Token
        </Button>
      </div>
    );
  }
}

Intro.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Intro);
