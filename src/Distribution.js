import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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
            isFixedSupply: true,
            batonAddress: '',
            addressQuantities: [{
                address: '',
                quantity: '',
            }],
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleDistributionChange = (index, name, newValue) => {
        const aq = [...this.state.addressQuantities]
        aq[index][name] = newValue
        this.setState({
            addressQuantities: aq
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

        let addressQuantities = this.state.addressQuantities.map((aq, index) => {
            return <div key={[index, ...aq]}>
                <TextField
                    label="Quantity"
                    value={aq.quantity}
                    onChange={ e => this.handleDistributionChange(index, 'quantity', e.target.value) }
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    label="SLP Address"
                    className={classes.textField}
                    margin="normal"
                    value={aq.address}
                    onChange={ e => this.handleDistributionChange(index, 'address', e.target.value) }
                /> <br />
            </div>;
        })

        return (
            <div className={classes.root}>
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
                        value={this.state.batonAddress}
                        onChange={this.handleChange('batonAddress')}
                    />
                </span>
                } <br />
                {addressQuantities}

                { this.state.addressQuantities.length <= 19 &&
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
                    onClick={ () => this.props.reviewToken(
                        this.state.isFixedSupply,
                        this.state.batonAddress,
                        this.state.addressQuantities
                    ) }
                >
                    Review
                </Button>
            </form>
            </div>
        );
    }
}

Distribution.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(Distribution);
