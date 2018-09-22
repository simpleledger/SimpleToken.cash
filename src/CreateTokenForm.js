import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

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
    constructor(props) {
        super(props)

        // Restore previous state or initialize default values
        this.state = props.stepState ? props.stepState : {
            name: '',
            ticker: '',
            tokenDocURL: '',
            tokenDocHash: '',
            decimalPlaces: 0,
        }
    }

    componentWillUnmount() {
        this.props.saveStepState(this.state)
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
            <Typography variant="headline" component="h3">
                Token Properties
            </Typography>
            <form noValidate autoComplete="off">
                <TextField
                    id="name"
                    label="Name"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                /> <br />
                <TextField
                    id="ticker"
                    label="Ticker"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.ticker}
                    onChange={this.handleChange('ticker')}
                /> <br />
                <TextField
                    id="tokenDocURL"
                    label="Token Document URL"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.tokenDocURL}
                    onChange={this.handleChange('tokenDocURL')}
                /> <br />

                <TextField
                    id="tokenDocHash"
                    label="Token Document Hash"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.tokenDocHash}
                    onChange={this.handleChange('tokenDocHash')}
                /> <br />

                <TextField
                    id="decimalPlaces"
                    label="Decimal Places"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.decimalPlaces}
                    onChange={this.handleChange('decimalPlaces')}
                /> <br />
                <Button 
                    variant="contained" 
                    color="secondary" 
                    className={classes.button}
                    onClick={ () => this.props.toPreviousStep() }
                >
                    Back
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    onClick={ () => this.props.defineDistribution(this.state) }
                >
                    Next
                </Button>
            </form>
            </div>
        );
  }
}

CreateTokenForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(CreateTokenForm);
