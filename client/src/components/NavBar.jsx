import React, { Component } from "react";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import { LinearProgress } from "@material-ui/core";

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
  }
}

class NavBar extends Component {
  render() {
    return (
      <AppBar position="fixed">
        {this.props.loading &&
          <LinearProgress color="secondary" />
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
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/signup">Signup</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.data.loading
  }
}

export default withStyles(styles)(connect(mapStateToProps)(NavBar));
