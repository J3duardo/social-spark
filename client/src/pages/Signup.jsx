import React, { Component } from "react";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const styles = {
  form: {
    textAlign: "center"
  },
  socialIconContainer: {
    width: "70px",
    margin: "0 auto 10px auto"
  },
  socialIcon: {
    display: "block",
    width: "100%"
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
}

class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    bio: "",
    website: "",
    location: "",
    loading: false,
    errors: {}
  }

  submitHandler = async (e) => {
    e.preventDefault();
    try {
      this.setState({
        loading: true
      });

      const response = await axios({
        method: "POST",
        url: "/signup",
        data: {
          email: this.state.email,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
          handle: this.state.handle,
          bio: this.state.bio,
          website: this.state.website,
          location: this.state.location
        }
      });
      
      localStorage.setItem("token", `Bearer ${response.data.data.token}`);
      
      this.setState({
        loading: false
      });

      this.props.history.push("/");
      
    } catch (error) {
      console.log(error.response);
      let apiError = null;

      // Errores de campos requeridos
      // En axios el objeto error.response.data es el error arrojado por la API
      if(error.response) {
        apiError = error.response.data
      }

      // Errores de validación de email, contraseña y handle
      if(apiError && apiError.message.toLowerCase().includes("validation")) {
        return this.setState({
          loading: false,
          errors: {
            ...apiError.data.errors
          }
        })

      } else if (apiError && apiError.message.toLowerCase().includes("handle")) {
        return this.setState({
          loading: false,
          errors: {
            handle: "Handle already in use"
          }
        })

        // Errores de credenciales
      } else if (apiError && apiError.message.includes("credentials")) {            
        // Error de email inválido
        if(apiError.data.includes("email-already-in-use")) {
          return this.setState({
            loading: false,
            errors: {
              email: "Email already in use"
            }
          })
        }

        // Error de contraseña débil
        if(apiError.data.includes("weak-password")) {
          return this.setState({
            loading: false,
            errors: {
              password: "Password must be at least 6 characters long"
            }
          })
        }
      }

      // Errores generados en el servidor
      return this.setState({
        loading: false,
        errors: {
          general: "Internal server error"
        }
      })
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const {classes} = this.props;
    const {errors, loading} = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm/>
        <Grid item sm>
          <div className={classes.socialIconContainer}>
            <img className={classes.socialIcon} src="/img/social-icon.png" alt="social logo"/>
          </div>
          <Typography variant="h4" className={classes.pageTitle}>Signup</Typography>
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
              helperText={`${errors.email ? errors.email : ""}`}
              error={errors.email ? true : false}
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              fullWidth
              className={classes.textField}
              value={this.state.password}
              onChange={this.onChangeHandler}
              helperText={`${errors.password ? errors.password : ""}`}
              error={errors.password ? true : false}
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              fullWidth
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.onChangeHandler}
              helperText={`${errors.confirmPassword ? errors.confirmPassword : ""}`}
              error={errors.confirmPassword ? true : false}
            />
            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              fullWidth
              className={classes.textField}
              value={this.state.handle}
              onChange={this.onChangeHandler}
              helperText={`${errors.handle ? errors.handle : ""}`}
              error={errors.handle ? true : false}
            />
            {errors.general &&
              <Typography variant="body2" className={classes.generalError}>
                {errors.general}
              </Typography>
            }
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading &&
                <CircularProgress
                  size="1.5rem"
                  thickness={6}
                  className={classes.progress} />
              }
            </Button>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </Typography>
          </form>
        </Grid>
        <Grid item sm/>
      </Grid>
    );
  }
}

export default withStyles(styles)(Signup);

