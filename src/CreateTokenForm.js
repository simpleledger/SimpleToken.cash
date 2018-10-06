import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MediaQuery from 'react-responsive';
import UploadDialog from './UploadDialog';

const classStyles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    },
    button: {
        margin: theme.spacing.unit
    },
    buttonFileChooser: {// button style for Calculate File Hash, Upload Token Document
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 0,
        height: 36,
        backgroundColor: '#2196f3',
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc'
        },
        '&:active': {
            backgroundColor: '#0062cc',
            borderColor: '#005cbf'
        }
    },
    buttonFileChooserMobile: {// button style for Calculate File Hash, Upload Token Document (Mobile)
        marginTop: 0
    },
    buttonFileChooserDesktop: {// button style for Calculate File Hash, Upload Token Document (Desktop)
        marginTop: theme.spacing.unit + 20
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    }
});

class CreateTokenForm extends Component {
    constructor (props) {
        super(props);

        // Restore previous state or initialize default values
        this.state = props.stepState ? props.stepState : {
            name: '',
            ticker: '',
            tokenDocURL: '',
            tokenDocHash: '',
            decimalPlaces: 0,
            modalOpened: false,
            masterHDNode: this.props.masterHDNode
        };
    }

    componentWillUnmount () {
        this.props.saveStepState(this.state);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    }

    // open modal dialog for payment and uploading file
    handleOpenModal = () => {
        this.setState({ modalOpened: true });
    }

    // close modal dialog
    handleCloseModal = () => {
        this.setState({ modalOpened: false });
    };

    // upload finished
    handleUploadFinished = (bfTxId, bfHash) => {
        this.setState({
            tokenDocURL: bfTxId,
            tokenDocHash: bfHash
        });
    };

    render () {
        const { classes } = this.props;

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

                    <div className={classes.container}>
                        <TextField
                            id="tokenDocURL"
                            label="Token Document URL"
                            className={classes.textField}
                            margin="normal"
                            value={this.state.tokenDocURL}
                            onChange={this.handleChange('tokenDocURL')}
                        />

                        {/* Upload Token Document : file chooser on Mobile */}
                        <MediaQuery query='(max-device-width: 564px)'>
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserMobile].join(' ')}
                                onClick={ () => this.handleOpenModal() }
                            >
                                Upload Token Document...
                            </Button>
                        </MediaQuery>

                        {/* Upload Token Document : file chooser on Desktop */}
                        <MediaQuery query='(min-device-width: 565px)'>
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserDesktop].join(' ')}
                                onClick={ () => this.handleOpenModal() }
                            >
                                Upload Token Document...
                            </Button>
                        </MediaQuery>
                    </div>
                    <br />

                    <TextField
                        id="tokenDocHash"
                        label="Token Document Hash"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.tokenDocHash}
                        onChange={this.handleChange('tokenDocHash')}
                    />

                    <br />
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

                <UploadDialog
                    isOpen={this.state.modalOpened}
                    onClose={this.handleCloseModal}
                    onUploadFinished={this.handleUploadFinished}
                    masterHDNode={this.state.masterHDNode}
                />

            </div>
        );
    }
}

CreateTokenForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(CreateTokenForm);
