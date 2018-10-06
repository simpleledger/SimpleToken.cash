import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FilePicker } from 'react-file-picker';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import LinearProgress from '@material-ui/core/LinearProgress';

let bfp = require('bitcoinfilesjs').bfp;

const classStyles = theme => ({
    modalText: {
        fontSize: 18,
        marginTop: 14,
        color: '#303030'
    },
    uploadTitle: {
        marginTop: 10,
        marginBottom: 5
    },
    button: {
        margin: theme.spacing.unit
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    tagCenter: {
        textAlign: 'center',
        width: '100%'
    },
    fixedDialog: {
        width: 770
    }
});

class UploadDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            estimatedCost: 0,
            cashAddress: null,
            wif: null,
            hash: null,
            bfTxId: null,
            fileContents: null,
            fileName: null,
            fileExt: null,

            completed: 0,
            paymentReceived: false,
            signed: false,
            uploaded: false
        };
    }

    // close dialog
    handleClose = () => {
        this.props.onClose();
    }

    // show dialog
    handleShow = () => {
        this.uploadAddrInfo = bfp.getFileUploadPaymentAddress(this.props.masterHDNode);

        this.setState({
            estimatedCost: 0,
            cashAddress: this.uploadAddrInfo.address,
            wif: this.uploadAddrInfo.wif,
            hash: null,
            bfTxId: null,
            fileContents: null,
            fileName: null,
            fileExt: null,

            completed: 0,
            paymentReceived: false,
            signed: false,
            uploaded: false
        });
    }

    readUploadedFile = (objFile) => {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            temporaryFileReader.onload = () => {
                let fileContents = temporaryFileReader.result;
                let fileWordArr = CryptoJS.lib.WordArray.create(fileContents);
                let hashSha256 = CryptoJS.SHA256(fileWordArr);
                let strHashSha256 = hashSha256.toString();

                let aryFileName = objFile.name.split('.');
                let fileExt = aryFileName[aryFileName.length - 1];
                let fileName = '';
                for (let nId = 0; nId < aryFileName.length - 1; nId++) {
                    fileName += aryFileName[nId];
                }
                let fileSize = objFile.size;

                let retFile = {
                    contents: fileContents,
                    hashSha256: strHashSha256,
                    fileName: fileName,
                    fileExt: fileExt,
                    fileSize: fileSize
                };

                resolve(retFile);
            };
            temporaryFileReader.readAsArrayBuffer(objFile);
        });
    };

    // upload file
    handleUploadedFileChange = async (objFile) => {
        try {
            const retFile = await this.readUploadedFile(objFile);
            // show in TokenDocumentHash
            this.setState({
                hash: retFile.hashSha256,
                fileContents: retFile.contents,
                fileName: retFile.fileName,
                fileExt: retFile.fileExt,
                fileSize: retFile.fileSize,
                chunkCount: null,
                chunks: null,
                configEmptyMetaOpReturn: null
            });

            // chunks
            let chunks = [];
            let chunkCount = this.state.fileSize / 220;
            chunkCount = Math.floor(chunkCount);

            for (let nId = 0; nId < chunkCount; nId++) {
                chunks.push(this.state.fileContents.slice(nId * 220, (nId + 1) * 220));
            }

            // meta
            if (this.state.fileSize % 220) {
                chunks[chunkCount] = this.state.fileContents.slice(chunkCount * 220, this.state.fileSize);
                chunkCount++;
            }

            // estimate cost
            // build empty meta data OpReturn
            let configEmptyMetaOpReturn = {
                msgType: 1,
                chunkCount: chunkCount,
                fileName: this.state.fileName,
                fileExt: this.state.fileExt,
                fileSize: this.state.fileSize,
                fileSha256: this.state.hash,
                prevFileSha256: null,
                fileUri: '',
                chunkData: null
            };

            this.setState({
                chunkCount: chunkCount,
                chunks: chunks,
                configEmptyMetaOpReturn: configEmptyMetaOpReturn
            });

            let estimatedCost = bfp.calculateFileUploadCost(objFile.size, configEmptyMetaOpReturn);
            this.setState({ estimatedCost: estimatedCost });

            // wait for payment
            console.log('waiting for payment... (', this.state.cashAddress, ')');
            await bfp.monitorForPayment(this.state.cashAddress, estimatedCost, this.onPayment);
        } catch (e) {
            console.warn(e.message);
        }
    }

    onPayment = async (utxo) => {
        this.setState({ paymentReceived: true });
        console.log('payment received. address : ', utxo.satoshis);

        //* ** building transaction
        let transactions = [];
        let bChunkCountAdded = false;
        // show progress
        let nDiff = 100 / this.state.chunkCount;
        let nCurPos = 0;

        for (let nId = 0; nId < this.state.chunkCount; nId++) {
            // build chunk data OpReturn
            let chunkOpReturn = bfp.buildDataChunkOpReturn(this.state.chunks[nId]);

            let txid = '';
            let satoshis = 0;
            let vout = 1;
            if (nId === 0) {
                txid = utxo.txid;
                satoshis = utxo.satoshis;
                vout = utxo.vout;
            } else {
                txid = transactions[nId - 1].getId();
                satoshis = transactions[nId - 1].outs[1].value;
            }

            // build chunk data transaction
            let configChunkTx = {
                bfpChunkOpReturn: chunkOpReturn,
                input_utxo: {
                    address: this.state.cashAddress,
                    txid: txid,
                    vout: vout,
                    satoshis: satoshis,
                    wif: this.state.wif
                }
            };

            let chunksTx = bfp.buildChunkTx(configChunkTx);

            if (nId === this.state.chunkCount - 1) {
                let emptyOpReturn = bfp.buildMetadataOpReturn(this.state.configEmptyMetaOpReturn);
                let capacity = 223 - emptyOpReturn.length;
                if (capacity >= this.state.chunks[nId].byteLength) {
                    // finish with just a single metadata txn
                    // build meta data OpReturn
                    let configMetaOpReturn = {
                        msgType: 1,
                        chunkCount: this.state.chunkCount,
                        fileName: this.state.fileName,
                        fileExt: this.state.fileExt,
                        fileSize: this.state.fileSize,
                        fileSha256: this.state.hash,
                        prevFileSha256: null,
                        fileUri: '',
                        chunkData: this.state.chunks[nId]
                    };
                    let metaOpReturn = bfp.buildMetadataOpReturn(configMetaOpReturn);

                    // build meta data transaction
                    let configMetaTx = {
                        bfpMetadataOpReturn: metaOpReturn,
                        input_utxo: {
                            txid: txid,
                            vout: vout,
                            satoshis: satoshis,
                            wif: this.state.wif
                        },
                        fileReceiverAddress: this.state.cashAddress
                    };
                    let metaTx = bfp.buildMetadataTx(configMetaTx);
                    transactions.push(metaTx);
                } else {
                    // finish with both chunk txn and then final empty metadata txn
                    transactions.push(chunksTx);

                    let metaOpReturn = bfp.buildMetadataOpReturn(this.state.configEmptyMetaOpReturn);

                    // build meta data transaction
                    let configMetaTx = {
                        bfpMetadataOpReturn: metaOpReturn,
                        input_utxo: {
                            txid: chunksTx.getId(),
                            vout: vout,
                            satoshis: chunksTx.outs[1].value,
                            wif: this.state.wif
                        },
                        fileReceiverAddress: this.state.cashAddress
                    };
                    let metaTx = bfp.buildMetadataTx(configMetaTx);
                    transactions.push(metaTx);

                    bChunkCountAdded = true;
                }
            } else { // not last transaction
                transactions.push(chunksTx);
            }

            // progress
            this.setState({ completed: nCurPos });
            nCurPos += nDiff;
        }

        // progress : signing finished
        this.setState({ signed: true });

        //* ** sending transaction
        if (bChunkCountAdded) {
            let chunkCount = this.state.chunkCount + 1;
            this.setState({
                chunkCount: chunkCount
            });
        }

        nDiff = 100 / this.state.chunkCount;
        nCurPos = 0;
        this.setState({ completed: 0 });
        for (let nId = 0; nId < this.state.chunkCount; nId++) {
            console.log(transactions[nId].toHex());
            var bfTxId = await bfp.sendTx(transactions[nId].toHex());
            // progress
            this.setState({ completed: nCurPos });
            nCurPos += nDiff;
        }

        bfTxId = 'bitcoinfile:' + bfTxId;
        this.setState({
            bfTxId: bfTxId,
            uploaded: true
        });

        // set tokenDocURL, tokenDocHash
        this.props.onUploadFinished(bfTxId, this.state.hash);

        console.log('uploading finished.');
    }

    // show error message when select file for uploading
    handleFileUploadError = (errMsg) => {
        toast.error(errMsg);
    }

    render () {
        const { isOpen, classes } = this.props;
        const qrCodeUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=' + this.state.cashAddress;

        // payment section
        const objPaymentWaiting =
            (<div className={classes.container}>
                <span className={classes.modalText}>
                    3. Waiting for user payment to :
                    <br />
                    {this.state.cashAddress}
                </span>

                <span className={classes.tagCenter}>
                    <img alt='' src={ qrCodeUrl }/>
                </span>
            </div>);

        const objPaymentReceived =
            (<div className={classes.modalText}>
                3. Payment received.
            </div>);

        let objPayment = null;
        if (this.state.paymentReceived === false) {
            objPayment = objPaymentWaiting;
        } else {
            objPayment = objPaymentReceived;
        }

        // progress section
        const objProgressSigning =
            (<div>
                <div className={[classes.modalText, classes.uploadTitle].join(' ')}>
                    Signing...
                </div>
                <LinearProgress variant="determinate" value={this.state.completed} />
            </div>);

        const objProgressUploading =
            (<div>
                <div className={[classes.modalText, classes.uploadTitle].join(' ')}>
                    Uploading...
                </div>
                <LinearProgress variant="determinate" value={this.state.completed} />
            </div>);

        const objProgressUploaded =
            (<div>
                <div className={[classes.modalText, classes.uploadTitle].join(' ')}>
                    Uploaded
                </div>
                <LinearProgress variant="determinate" value={100} />
            </div>);

        let objProgress = null;
        if (this.state.paymentReceived === true) {
            if (this.state.signed === false) {
                objProgress = objProgressSigning;
            } else {
                if (this.state.uploaded === false) {
                    objProgress = objProgressUploading;
                } else {
                    objProgress = objProgressUploaded;
                }
            }
        }

        return (
            <div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={ isOpen }
                    onClose={this.handleClose}
                    onEnter={this.handleShow}
                    fullWidth={true}
                    maxWidth={'md'}
                    classes={{ paperWidthMd: classes.fixedDialog }}
                    aria-labelledby="Upload File"
                >
                    <DialogTitle id="upload-file">{'SimpleToken.cash  Upload File'}</DialogTitle>
                    <DialogContent>

                        {/* 1 */}
                        <div className={classes.container}>
                            <span className={classes.modalText}>
                                1. Select File :
                            </span>

                            <FilePicker
                                onChange={FileObject => { this.handleUploadedFileChange(FileObject); }}
                                onError={errMsg => { this.handleFileUploadError(errMsg); }}
                            >
                                <Button
                                    variant="contained"
                                    className={classes.button}
                                    color="primary"
                                >
                                    Browse...
                                </Button>
                            </FilePicker>
                        </div>

                        {/* 2 */}
                        <div className={classes.container}>
                            <span className={classes.modalText}>
                                2. Estimated Upload Cost : { this.state.estimatedCost !== 0 ? this.state.estimatedCost + ' sat' : '' }
                            </span>
                        </div>

                        {/* 3 */}
                        { objPayment }

                        {/* progress bar */}
                        { objProgress }

                        {/* 4 */}
                        <div className={classes.container}>
                            <span className={classes.modalText}>
                                4. Copy file upload location :
                                <br />
                                { this.state.bfTxId !== 0 ? this.state.bfTxId : '' }
                            </span>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <span className={classes.tagCenter}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={ this.handleClose }
                            >
                            Use URL and Hash for Token Document
                            </Button>
                        </span>
                    </DialogActions>
                </Dialog>

                <ToastContainer
                    autoClose={20 * 1000}
                />

            </div>
        );
    }
}

UploadDialog.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(classStyles)(UploadDialog);
