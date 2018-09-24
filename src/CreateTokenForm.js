import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { FilePicker } from 'react-file-picker'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.min.css'
import CryptoJS from 'crypto-js'
import MediaQuery from 'react-responsive'

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
        width:240,
        backgroundColor: '#2196f3',
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
        },
        '&:active': {
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
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
        flexWrap: 'wrap',
    }
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
            decimalPlaces: 0
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

    // read selected file and calculate SHA256 hash,  show in TokenDocumentHash text field
    handleFileHashChange = (objFile) => {
        var objThis = this;
        // read file
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            var fileContents = e.target.result;
            var fileWordArr = CryptoJS.lib.WordArray.create(fileContents);
            var hashSha256 = CryptoJS.SHA256(fileWordArr);
            var strHashSha256 = hashSha256.toString();

            // show in TokenDocumentHash
            objThis.setState({
                tokenDocHash: strHashSha256
            });
        }
        fileReader.readAsArrayBuffer(objFile);
    }

    // show error message when select file for TockenDocumentHash
    handleFileHashError = (errMsg) => {
        toast.error(errMsg)
    }

    // upload file
    handleFileUploadChange = (objFile) => {
        console.log('upload file : ', objFile);
    }

    // show error message when select file for uploading
    handleFileUploadError = (errMsg) => {
        toast.error(errMsg)
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
                    <MediaQuery query='(max-device-width: 567px)'>
                        <FilePicker
                            onChange={FileObject => { this.handleFileUploadChange(FileObject) }}
                            onError={errMsg => { this.handleFileUploadError(errMsg) }}
                        >
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserMobile].join(' ')}
                            >
                                Upload Token Document...
                            </Button>
                        </FilePicker>
                    </MediaQuery>

                    {/* Upload Token Document : file chooser on Desktop */}
                    <MediaQuery query='(min-device-width: 568px)'>
                        <FilePicker
                            onChange={FileObject => { this.handleFileUploadChange(FileObject) }}
                            onError={errMsg => { this.handleFileUploadError(errMsg) }}
                        >
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserDesktop].join(' ')}
                            >
                                Upload Token Document...
                            </Button>
                        </FilePicker>
                    </MediaQuery>
                </div>
                <br />

                <div className={classes.container}>
                    <TextField
                        id="tokenDocHash"
                        label="Token Document Hash"
                        className={classes.textField}
                        margin="normal"
                        value={this.state.tokenDocHash}
                        onChange={this.handleChange('tokenDocHash')}
                    />

                    {/* Calculate File Hash : file chooser on Mobile */}
                    <MediaQuery query='(max-device-width: 567px)'>
                        <FilePicker
                            onChange={FileObject => { this.handleFileHashChange(FileObject) }}
                            onError={errMsg => { this.handleFileHashError(errMsg) }}
                        >
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserMobile].join(' ')}
                            >
                                Calculate File Hash
                            </Button>
                        </FilePicker>
                    </MediaQuery>

                    {/* Calculate File Hash : file chooser on Desktop */}
                    <MediaQuery query='(min-device-width: 568px)'>
                        <FilePicker
                            onChange={FileObject => { this.handleFileHashChange(FileObject) }}
                            onError={errMsg => { this.handleFileHashError(errMsg) }}
                        >
                            <Button
                                variant="contained"
                                className={[classes.buttonFileChooser, classes.buttonFileChooserDesktop].join(' ')}
                            >
                                Calculate File Hash
                            </Button>
                        </FilePicker>
                    </MediaQuery>

                </div>
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

            <ToastContainer
                autoClose={20 * 1000}
            />

            </div>
        );
  }
}

CreateTokenForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(classStyles)(CreateTokenForm);
