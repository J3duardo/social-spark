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
import {logoutUser} from "../redux/actions/userActions";

const styles = (theme) => ({
  formWrapper: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 1rem 1rem 1rem",
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
    passwordUpdated: false,
    email: "",
    emailConfirm: "",
    emailUpdated: false,
    loadingPassword: false,
    loadingEmail: false,
    deleteAccountPassword: "",
    loadingAccountDeletion: false,
    accountDeleted: false,
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
      showModal: false,
      emailUpdated: false,
      passwordUpdated: false
    })
  }

  submitPasswordHandler = async (e) => {
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
        loadingPassword: true
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
      
      // Si la contraseña actual es correcta, actualizarla
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
        passwordUpdated: true,
        loadingPassword: false,
        showModal: true
      });

    } catch (error) {
      if(error.response.data && typeof error.response.data.data === "string") {
        return this.setState({
          loadingPassword: false,
          showModal: false,
          error: {
            status: true,
            type: "password",
            message: error.response.data.data.includes("password") ? "Wrong password" : error.response.data.message
          }
        })
      } else if(error.response.data && typeof error.response.data.data === "object") {
        return this.setState({
          loadingPassword: false,
          showModal: false,
          error: {
            status: true,
            type: "submit",
            message: error.response.data.data.message
          }
        })
      }

      this.setState({
        loadingPassword: false,
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

  submitEmailHandler = async (e) => {
    e.preventDefault();
    
    // Chequear si se introdujo un email válido
    const isEmail = (email) => {
      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
      if(email.match(regExp)) {
        return true
      }
    
      return false
    }

    if(!isEmail(this.state.email) || this.state.email === "") {
      return this.setState({
        loadingEmail: false,
        showModal: false,
        error: {
          status: true,
          type: "email",
          message: "Invalid email"
        }
      })
    }

    // Chequear si se confirmó el email
    if(!isEmail(this.state.email) || this.state.emailConfirm === "") {
      return this.setState({
        loadingEmail: false,
        showModal: false,
        error: {
          status: true,
          type: "emailConfirm",
          message: "Invalid email"
        }
      })
    }

    // Chequear si los emails coinciden
    if(this.state.email !== this.state.emailConfirm) {
      return this.setState({
        loadingEmail: false,
        showModal: false,
        error: {
          status: true,
          type: "emailMatch",
          message: "Emails don't match"
        }
      })
    }

    try {
      this.setState({
        loadingEmail: true
      })

      // Actualizar el email
      await axios({
        method: "POST",
        url: "/change-email",
        data: {
          email: this.state.email,
          uid: this.props.uid
        }
      })
  
      this.setState({
        email: "",
        emailConfirm: "",
        emailUpdated: true,
        loadingEmail: false,
        showModal: true
      });

    } catch (error) {
      if(error.response.data) {
        return this.setState({
          loadingEmail: false,
          showModal: false,
          error: {
            status: true,
            type: "submitEmail",
            message: error.response.data.message
          }
        })
      }

      this.setState({
        loadingEmail: false,
        showModal: false,
        error: {
          error: {
            status: true,
            type: "submitEmail",
            message: error.message
          }
        }
      })
    }
  }

  submitDeleteAccountHandler = async (e) => {
    e.preventDefault();
    try {
      this.setState({
        loadingAccountDeletion: true
      });

      // Chequear si se introdujo la contraseña
      if(this.state.deleteAccountPassword === "") {
        return this.setState({
          loadingAccountDeletion: false,
          showModal: false,
          error: {
            status: true,
            type: "deleteAccountPassword",
            message: "Password is required"
          }
        })
      }

      // Chequear si la contraseña es válida
      await axios({
        method: "POST",
        url: "/login",
        data: {
          email: this.props.userEmail,
          password: this.state.deleteAccountPassword
        }
      })

      // Eliminar la cuenta y toda la información del usuario
      await axios({
        method: "POST",
        url: "/delete-account",
        data: {
          userId: this.props.uid
        }
      });

      return this.setState({
        deleteAccountPassword: "",
        loadingAccountDeletion: false,
        showModal: true,
        accountDeleted: true
      }, () => this.props.signOut())

    } catch (error) {
      if(error.response.data && typeof error.response.data.data === "string") {
        return this.setState({
          loadingAccountDeletion: false,
          showModal: false,
          error: {
            status: true,
            type: "deleteAccountPassword",
            message: error.response.data.data.includes("password") ? "Wrong password" : error.response.data.message
          }
        })
      }

      this.setState({
        loadingAccountDeletion: false,
        showModal: false,
        error: {
          error: {
            status: true,
            type: "submitDeleteAccountPassword",
            message: error.message
          }
        }
      })
    }
  }

  render() {
    const {error, loadingPassword, loadingEmail, showModal, loadingAccountDeletion, accountDeleted} = this.state;
    const {classes} = this.props;

    return (
      <div className={classes.formWrapper}>
        <Typography variant="h4" style={{textAlign: "center", marginBottom: "1rem"}}>Account settings</Typography>
        {/* Formulario para modificar la contraseña */}
        <Paper variant="outlined" style={{marginBottom: "1rem"}}>
          <Grid container className={classes.form}>
            <Grid item style={{padding: "0 1rem"}}>
              <Typography variant="h5" className={classes.pageTitle}>Change your Password</Typography>
              <form noValidate onSubmit={this.submitPasswordHandler}>
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
                  disabled={loadingPassword}
                >
                  Submit
                  {loadingPassword &&
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

        {/* Formulario para actulizar el email */}
        <Paper variant="outlined" style={{marginBottom: "1rem"}}>
          <Grid container className={classes.form}>
            <Grid item style={{width: "100%", padding: "0 1rem"}}>
              <Typography variant="h5" className={classes.pageTitle}>Change your Email</Typography>
              <form noValidate onSubmit={this.submitEmailHandler}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Change your email"
                  fullWidth
                  className={classes.textField}
                  value={this.state.email}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "email" || error.type === "emailMatch" ? error.message : ""}`}
                  error={error.type === "email" || error.type === "emailMatch" ? true : false}
                />
                <TextField
                  id="emailConfirm"
                  name="emailConfirm"
                  type="email"
                  label="Confirm your email"
                  fullWidth
                  className={classes.textField}
                  value={this.state.emailConfirm}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "email" || error.type === "emailConfirm" || error.type === "emailMatch" ? error.message : ""}`}
                  error={error.type === "email" || error.type === "emailConfirm" || error.type === "emailMatch" ? true : false}
                />
                {error.type === "submitEmail" &&
                  <Typography variant="body2" className={classes.generalError}>
                    {error.message}
                  </Typography>
                }
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={loadingEmail}
                >
                  Submit
                  {loadingEmail &&
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

        {/* Eliminar cuenta de usuario */}
        <Paper variant="outlined">
        <Grid container className={classes.form}>
            <Grid item style={{width: "100%", padding: "0 1rem"}}>
              <Typography variant="h5" className={classes.pageTitle}>Delete your account</Typography>
              <Typography variant="body2" color="secondary" style={{marginBottom: "1rem"}}>
                This process is irreversible and all your data, including posts and comments, will be permanently removed.
              </Typography>
              <form noValidate onSubmit={this.submitDeleteAccountHandler}>
                <TextField
                  id="deleteAccountPassword"
                  name="deleteAccountPassword"
                  type="password"
                  label="Your password"
                  fullWidth
                  className={classes.textField}
                  value={this.state.deleteAccountPassword}
                  onChange={this.onChangeHandler}
                  helperText={`${error.type === "deleteAccountPassword" ? error.message : ""}`}
                  error={error.type === "deleteAccountPassword" ? true : false}
                />
                {error.type === "submitDeleteAccountPassword" &&
                  <Typography variant="body2" className={classes.generalError}>
                    {error.message}
                  </Typography>
                }
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={loadingAccountDeletion}
                >
                  Submit
                  {loadingAccountDeletion &&
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
              {this.state.passwordUpdated && "Your Password has been successfully updated"}
              {this.state.emailUpdated && "Your Email has been successfully updated"}
              {this.state.accountDeleted && "Your Account has been successfully removed. We will miss you!"}
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

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => {
      dispatch(logoutUser())
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile));
