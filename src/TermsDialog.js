import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class TermsDialog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isOpen: true
        };
    }

  handleClose = () => {
      this.setState({ isOpen: false });
  }

  render () {
      const { fullScreen } = this.props;

      return (
          <div>
              <Dialog
                  disableBackdropClick
                  disableEscapeKeyDown
                  fullScreen={fullScreen}
                  open={this.state.isOpen}
                  onClose={this.handleClose}
                  aria-labelledby="Terms of Service"
              >
                  <DialogTitle id="terms-of-service">{'SimpleToken.cash Terms of Service'}</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
              SimpleToken.cash is a sample project provided for demonstration purposes and provided AS-IS.
                          <br/> <br/>
              USE AT YOUR OWN RISK.
                          <br/><br/>
                          <b>No Warranty:</b> SimpleToken.cash does not warrant for Software and supplies it on an "as-is" and "as-available" basis. Your Use of the Software is at your own risk and under your liability. SimpleToken.cash makes no warranty that (i) the Software will meet your requirements, including providing you with any relevant information or reaching a relevant audience and (ii) the Software will be uninterrupted, timely, secure, or error-free and (iii) the results that may be obtained from the Use of the Software will be accurate or reliable and (iv) the quality of any products, services, information, or other material purchased or obtained by You through Software will meet your expectations, or (v) any errors in the Software will be corrected.
                          <br/><br/>
                          <b>Liability:</b> For no case and for no reason shall SimpleToken.cash be held liable for any damage, direct or indirect, consequential, exemplary, physical or special, to You, any User or any 3rd party due to its misperformance of duties herein. SimpleToken.cash provides the Software on an AS-IS basis and shall not be held liable, to the extent permitted by law, by any case of misconduct, negligence, gross negligence, malice or any other mean, to any damages or loss of property, including damages to: virtual property, reputation and business reputation, user account information including login information, loss of profit, loss of good name, all resulting from the use or inability to use Software rendered by SimpleToken.cash.
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleClose} color="primary" autoFocus>
              Agree
                      </Button>
                  </DialogActions>
              </Dialog>
          </div>
      );
  }
}

TermsDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(TermsDialog);
