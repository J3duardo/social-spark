import React, { Component } from "react";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { LinearProgress } from "@material-ui/core";

import {connect} from "react-redux";
import {logoutUser} from "../redux/actions/userActions";

const styles = {
  toolBar: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  navBarTitle: {
    flexGrow: "1",
    color: "inherit"
  },
  navbarProfileBtn: {
    display: "flex",
    alignItems: "center"
  }
}

class NavBar extends Component {
  render() {
    return (
      <AppBar position="fixed">
        {this.props.loading &&
          <LinearProgress color="primary" />
        }
        <Toolbar className={this.props.classes.toolBar}>
          <Typography
            className={this.props.classes.navBarTitle}
            variant="h6"
            component={Link}
            to="/"
          >
            Social Spark
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!this.props.auth &&
            <React.Fragment>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </React.Fragment>
          }
          {this.props.auth &&
            <React.Fragment>
              <Button
                className={this.props.classes.navbarProfileBtn}
                color="inherit"
                component={Link}
                to="/profile"
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "5px",
                    borderRadius: "50%",

                    backgroundImage: `url(${this.props.user.imageURL})`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover"
                  }}
                />
                <span>{this.props.user.handle}</span>
              </Button>
              <Button
                color="inherit"
                component="div"
                onClick={() => this.props.signout()}
              >
                Signout
              </Button>
            </React.Fragment>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    user: state.user.credentials,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => {
      dispatch(logoutUser())
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NavBar));
