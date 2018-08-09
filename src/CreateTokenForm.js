import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class CreateTokenForm extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
                Token Properties
            </Typography>
            <form noValidate autoComplete="off">
                <TextField
                    id="type"
                    label="Type"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <TextField
                    id="name"
                    label="Name"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <TextField
                    id="ticker"
                    label="Ticker"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <TextField
                    id="urlOrEmail"
                    label="URL or Email"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <TextField
                    id="decimalPlaces"
                    label="Decimal Places"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <TextField
                    id="initialQuantity"
                    label="Initial Quantity"
                    className={classes.textField}
                    margin="normal"
                /> <br />
                <Button variant="contained" color="primary" className={classes.button}>
                    Create
                </Button>
            </form>
        </Paper>
      </div>
    );
  }
}

CreateTokenForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(CreateTokenForm);
