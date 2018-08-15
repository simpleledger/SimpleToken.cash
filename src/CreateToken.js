import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
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

class CreateToken extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
                Create Your Token Now
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                className={classes.button}
                onClick={this.props.defineToken}
            >
                Create Token
            </Button>
        </Paper>
      </div>
    );
  }
}

CreateToken.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(CreateToken);
