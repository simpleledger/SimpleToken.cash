import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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

        this.state = {
            name: '',
            ticker: '',
            urlOrEmail: '',
            decimalPlaces: 0,
            initialQuantity: 1000,
            slpAddress: '',
            isFixedSupply: true,
        }
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
            <Paper className={classes.root} elevation={1}>
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
                        id="urlOrEmail"
                        label="URL or Email"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.urlOrEmail}
                        onChange={this.handleChange('urlOrEmail')}
                    /> <br />
                    <TextField
                        id="decimalPlaces"
                        label="Decimal Places"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.decimalPlaces}
                        onChange={this.handleChange('decimalPlaces')}
                    /> <br />
                    <TextField
                        id="initialQuantity"
                        label="Initial Quantity"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.initialQuantity}
                        onChange={this.handleChange('initialQuantity')}
                    /> <br />
                    <TextField
                        id="slpAddress"
                        label="SLP Address"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.slpAddress}
                        onChange={this.handleChange('slpAddress')}
                    /> <br />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isFixedSupply}
                                onChange={this.handleChange('isFixedSupply')}
                                value="isFixedSupply"
                                color="primary"
                            />
                        }
                        label="Fixed Supply"
                    /> <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.button}
                        onClick={ () => this.props.createToken(this.state) }
                    >
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
