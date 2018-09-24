import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

const classStyles = theme => ({
    root: {
        width: '90%',
    },
})

let getSteps = () => {
    return ['Learn About SimpleToken', 'Define Your Token', 'Distribute Supply', 'Review']
}

class CreateTokenStepper extends Component {
    // constructor(props) {
    //     super(props)
    // }

    render() {
        const { classes } = this.props
        const steps = getSteps()
        const activeStep = this.props.activeStep;

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => {
                        return (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        );
                    })}
                </Stepper>
            </div>
        );
    }
}

CreateTokenStepper.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(CreateTokenStepper);