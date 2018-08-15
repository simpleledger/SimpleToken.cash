import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
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
        }
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
            <Paper className={classes.root} elevation={1}>
                <Typography variant="headline" component="h3">
                    Initial Distribution
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        id="batonAddress"
                        label="Baton Address"
                        className={classes.textField}
                        margin="normal"
                        //value={}
                        //onChange={}
                    /> <br />
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
                        value={this.state.slpAddress}
                        //onChange={this.handleChange('slpAddress')}
                    /> <br />
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        className={classes.button}
                        //onClick={ }
                    >
                        Add Address
                    </Button> <br/> <br/>
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
