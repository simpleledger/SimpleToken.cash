import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const classStyles = theme => ({
    root: {
        padding: theme.spacing.unit * 2,
        backgroundColor: '#f5f5f5',
        textAlign: 'center'
    }
});

class CreateTokenForm extends Component {
    render () {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <a href="https://docs.google.com/document/d/1GcDGiVUEa87SIEjrvM9QcCINfoBw-R7EPWzNVR4M8EI/edit">Protocol</a>
            </div>
        );
    }
}

CreateTokenForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(CreateTokenForm);
