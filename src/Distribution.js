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
});

class Distribution extends Component {
    constructor(props) {
        super(props)

        this.state = {
            slpAddress: '',
            addressQuantities: [{
                address: '',
                quantity: 0,
            }],
            isFixedSupply: true,
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleCheckbox = name => event => {
        this.setState({
            [name]: event.target.checked,
        })
    }

    addAddressQuantity = () => {
        let addressQuantities = this.state.addressQuantities.slice()
        addressQuantities.push({
            address: '',
            quantity: 0,
        })

        this.setState({
            addressQuantities: addressQuantities
        })
    }

    render() {
        const { classes } = this.props

        let addressQunatities = []
        for (let aq in this.state.addressQuantities) {
            addressQunatities.push(<div>
                <TextField
                    id="quantity1"
                    label="Quantity"
                    //value={}
                    //onChange={}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    id="slpAddress"
                    label="SLP Address"
                    className={classes.textField}
                    margin="normal"
                    //value={this.state.slpAddress}
                    //onChange={this.handleChange('slpAddress')}
                /> <br />
            </div>);
        }

        return (
            <div className={classes.root}>
            <Paper className={classes.root} elevation={1}>
                <Typography variant="headline" component="h3">
                    Initial Distribution
                </Typography>
                <form noValidate autoComplete="off">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isFixedSupply}
                                onChange={this.handleCheckbox('isFixedSupply')}
                                value="isFixedSupply"
                                color="primary"
                            />
                        }
                        label="Fixed Supply"
                    />
                    { !this.state.isFixedSupply && 
                    <span>
                        <TextField
                            id="batonAddress"
                            label="Baton Address"
                            className={classes.textField}
                            margin="normal"
                            //value={}
                            //onChange={}
                        />
                    </span>
                    } <br />
                    {addressQunatities}

                    { this.state.addressQuantities.length < 20 &&
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            className={classes.button}
                            onClick={ this.addAddressQuantity }
                        >
                            +
                        </Button>
                    }  <br/> <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.button}
                        //onClick={ () =>  }
                    >
                        Create
                    </Button>
                </form>
            </Paper>
            </div>
        );
    }
}

Distribution.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Distribution);
