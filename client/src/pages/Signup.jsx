import React, { Component } from "react";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import {connect} from "react-redux";
import {signupUser} from "../redux/actions/userActions";
import { CLEAR_ERRORS } from "../redux/types";

const styles = theme => ({
  formContainer: {
    ...theme.formContainer
  },
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

class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    bio: "",
    website: "",
    location: ""
  }

  componentDidMount() {
    document.title = "Social Spark | Signup"
  }

  componentWillUnmount() {
    if(this.props.errors) {
      this.props.clearErrors()
    }
  }

  submitHandler = async (e) => {
    e.preventDefault();
    const {email, password, confirmPassword, handle, bio, website, location} = this.state;
    const userData = {
      email,
      password,
      confirmPassword,
      handle,
      bio,
      website,
      location
    }

    this.props.signup(userData, this.props.history)    
  }

  onChangeHandler = (e) => {
    if(this.props.errors) {
      this.props.clearErrors()
    };

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const {classes} = this.props;
    const {errors, loading} = this.props;

    return (
      <div className={classes.formContainer}>
        <Grid container className={classes.form}>
          <Grid item>
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
                helperText={`${errors && errors.email ? errors.email : ""}`}
                error={errors && errors.email ? true : false}
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
                helperText={`${errors && errors.password ? errors.password : ""}`}
                error={errors && errors.password ? true : false}
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
                helperText={`${errors && errors.confirmPassword ? errors.confirmPassword : ""}`}
                error={errors && errors.confirmPassword ? true : false}
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
                helperText={`${errors && errors.handle ? errors.handle : ""}`}
                error={errors && errors.handle ? true : false}
              />
              {errors && errors.general &&
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
                Signup
                {loading &&
                  <CircularProgress
                    size="1.5rem"
                    thickness={6}
                    className={classes.progress} />
                }
              </Button>
              <Typography color="textSecondary" variant="body2">
                Already have an account?{" "}
                <Link to="/login">Login</Link>
              </Typography>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.ui.loading,
    errors: state.ui.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (data, history) => {
      dispatch(signupUser(data, history))
    },
    clearErrors: () => {
      dispatch({type: CLEAR_ERRORS})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Signup));

