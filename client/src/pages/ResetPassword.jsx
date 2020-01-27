import React, { Component } from "react";
import {auth} from "../firebase-client";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  form: {
    ...theme.form
  },
  socialIconContainer: {
    ...theme.socialIconContainer
  },
  socialIcon: {
    ...theme.socialIcon
  },
  textField: {
    margin: "10px 0"
  },
  button: {
    position: "relative",
    margin: "10px 0"
  },
  progress: {
    position: "absolute"
  },
  generalError: {
    color: "red",
    fontSize: "1rem"
  }
})

class ResetPassword extends Component {
  state = {
    email: "",
    loading: false,
    success: false,
    error: {
      status: false,
      type: null,
      message: null
    }
  }

  componentDidMount() {
    document.title = "Social Spark | Reset Password"
  }

  componentWillUnmount() {
    this.setState({
      email: "",
      loading: false,
      success: false,
      error: {
        status: false,
        type: null,
        message: null
      }
    })
  }

  isEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(String(email).toLowerCase())
  }

  submitHandler = async (e) => {
    e.preventDefault();
    
    if(this.state.email === "" || !this.isEmail(this.state.email)) {
      return this.setState({
        error: {
          status: true,
          type: "email",
          message: "You must provide a valid email"
        }
      })
    }

    if(this.state.email !== "") {
      try {
        this.setState({
          loading: true
        })

        // Enviar el email si la información ingresada es correcta
        await auth.sendPasswordResetEmail(this.state.email, {url: "https://social-spark.firebaseapp.com"})

        // Notificar al usuario si la operación fue exitosa
        this.setState({
          loading: false,
          success: true
        })

      } catch (error) {
        console.log(error)
        this.setState({
          loading: false,
          success: false,
          error: {
            status: true,
            type: "submit",
            message: error.message
          }
        })
      }
    }    
  }

  onChangeHandler = (e) => {
    if(this.state.error.status) {
      this.setState({
        error: {
          status: false,
          type: null,
          message: null
        }
      })
    };

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  closeDialogHandler = () => {
    this.setState({
      success: false
    })
  }

  render() {
    const {classes} = this.props;
    const {error, loading} = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item style={{padding: "0 1rem"}}>
          <div className={classes.socialIconContainer}>
            <img className={classes.socialIcon} src="/img/social-icon.png" alt="social logo"/>
          </div>
          <Typography variant="h4" className={classes.pageTitle}>Reset your password</Typography>
          <Typography color="textSecondary" variant="body1" style={{marginBottom: "1rem"}}>
            We will send you an email with instructions to reset your password
          </Typography>
          <form noValidate onSubmit={this.submitHandler}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              fullWidth
              className={classes.textField}
              value={this.state.email}
              onChange={this.onChangeHandler}
              helperText={`${error.status && error.type === "email" ? error.message : ""}`}
              error={error.status && error.type === "email" ? true : false}
            />
            {error.status && error.type === "submit" &&
              <Typography variant="body2" className={classes.generalError}>
                {error.message}
              </Typography>
            }
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Submit
              {loading &&
                <CircularProgress
                  size="1.5rem"
                  thickness={6}
                  className={classes.progress}
                />
              }
            </Button>
          </form>
        </Grid>

        {/* Dialog */}
        <Dialog
          open={this.state.success}
          onClose={this.closeDialogHandler}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Email sent. Check your inbox.</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              We just sent you an email with instructions to reset your password, please check your inbox. In case you don't find it, check your spam folder or try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialogHandler} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default withStyles(styles)(ResetPassword);

