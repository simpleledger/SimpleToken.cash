import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

class StepContainer extends Component {
    render () {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.root} elevation={1}>
                    {this.props.children}
                </Paper>
            </div>
        );
    }
}

StepContainer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(StepContainer);
