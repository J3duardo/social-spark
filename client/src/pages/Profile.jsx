import React, { Component } from "react";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {connect} from "react-redux";

const styles = (theme) => ({
  formWrapper: {
    witdth: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  form: {
    ...theme.form,
    padding: "1rem",
    bacgroundColor: "#fff"
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

class Profile extends Component {
  state = {
    password: "",
    newPassword: "",
    newPasswordConfirm: "",
    loading: false,
    showModal: false,
    error: {
      status: false,
      type: null,
      message: null
    }
  }

  componentDidMount() {
    if(!this.props.auth) {
      this.props.history.push("/")
    }
  }

  componentDidUpdate(prevProps) {
    if(!this.props.auth) {
      this.props.history.push("/")
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
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  closeDialogHandler = () => {
    this.setState({
      showModal: false
    })
  }

  submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      password: this.state.password,
      newPassword: this.state.newPassword,
      newPasswordConfirm: this.state.newPasswordConfirm
    }
    
    // Validar data
    if(data.password === "") {
      return this.setState({
        error: {
          status: true,
          type: "password",
          message: "Password is required"
        }
      })
    }

    if(data.newPassword === "") {
      return this.setState({
        error: {
          status: true,
          type: "newPassword",
          message: "You must add your new password"
        }
      })
    }

    if(data.newPasswordConfirm === "") {
      return this.setState({
        error: {
          status: true,
          type: "newPasswordConfirm",
          message: "You must confirm your new password"
        }
      })
    }

    if(data.newPassword !== data.newPasswordConfirm) {
      return this.setState({
        error: {
          status: true,
          type: "passwordsMatch",
          message: "Passwords don't match"
        }
      })
    }
    
    try {
      this.setState({
        loading: true
      });

      // Chequear la contraseña actual
      await axios({
        method: "POST",
        url: "/login",
        data: {
          email: this.props.userEmail,
          password: data.password,
        }
      });
      
      // Si la contraseña actual es correcta, actalizarla
      await axios({
        method: "POST",
        url: "/change-password",
        data: {
          password: this.state.newPassword,
          uid: this.props.uid
        }
      })

      this.setState({
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
        loading: false,
        showModal: true
      });

    } catch (error) {
      if(error.response.data && typeof error.response.data.data === "string") {
        return this.setState({
          loading: false,
          showModal: false,
          error: {
            status: true,
            type: "password",
            message: error.response.data.data.includes("password") ? "Wrong password" : error.response.data.message
          }
        })
      } else if(error.response.data && typeof error.response.data.data === "object") {
        return this.setState({
          loading: false,
          showModal: false,
          error: {
            status: true,
            type: "submit",
            message: error.response.data.data.message
          }
        })
      }

      this.setState({
        loading: false,
        showModal: false,
        error: {
          error: {
            status: true,
            type: "submit",
            message: error.message
          }
        }
      })
    }
  }

  render() {
    const {error, loading, showModal} = this.state;
    const {classes} = this.props;

    return (
      <div className={classes.formWrapper}>
        <Paper variant="outlined">
          <Grid container className={classes.form}>
            <Grid item style={{padding: "0 1rem"}}>
              <Typography variant="h4" className={classes.pageTitle}>Change your password</Typography>
              <form noValidate onSubmit={this.submitHandler}>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  className={classes.textField}
                  value={this.state.password}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "password" ? error.message : ""}`}
                  error={error.type === "password" ? true : false}
                />
                <TextField
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="New password"
                  fullWidth
                  className={classes.textField}
                  value={this.state.newPassword}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "newPassword" || error.type === "passwordsMatch" ? error.message : ""}`}
                  error={error.type === "newPassword" || error.type === "passwordsMatch" ? true : false}
                />
                <TextField
                  id="newPasswordConfirm"
                  name="newPasswordConfirm"
                  type="password"
                  label="Confirm new password"
                  fullWidth
                  className={classes.textField}
                  value={this.state.newPasswordConfirm}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "newPasswordConfirm" || error.type === "passwordsMatch" ? error.message : ""}`}
                  error={error.type === "newPasswordConfirm" || error.type === "passwordsMatch" ? true : false}
                />
                {error.type === "submit" &&
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
          </Grid>
        </Paper>

        {/* Modal para informar operación exitosa */}
        <Dialog
          open={showModal}
          onClose={this.closeDialogHandler}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Success!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your password has been successfully updated
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialogHandler} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    uid: state.user.credentials.userId,
    userEmail: state.user.credentials && state.user.credentials.email
  }
}

export default withStyles(styles)(connect(mapStateToProps)(Profile));
