import React, { Component } from "react";
import {Link} from "react-router-dom";
import GenericIconButton from "./GenericIconButton";
import CreatePost from "./CreatePost";

import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";

import HomeIcon from "@material-ui/icons/Home";
import Notifications from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";

import {firestore} from "../firebase-client";
import {connect} from "react-redux";
import {logoutUser, updateNotifications} from "../redux/actions/userActions";

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
  },
  orangeBtn: {
    backgroundColor: "#ff3d00",

    "&:hover": {
      backgroundColor: "#962502"
    }
  },
  "navIcon": {
    color: "#fff"
  }
}

class NavBar extends Component {
  unsubscribeFromNotifications = null;

  async componentDidMount() {
    // Suscribirse a los cambios en la colección de notificaciones
    this.unsubscribeFromNotifications = firestore.collection("notifications").onSnapshot(async (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if(this.props.auth && change.type === "added") {
          this.props.updateNotifications(change.doc.data())
          console.log(change.doc.data())
        }
      })
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromNotifications()
  }

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
          {!this.props.auth &&
            <React.Fragment>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button className={this.props.classes.orangeBtn} color="inherit" component={Link} to="/signup">Signup</Button>
            </React.Fragment>
          }
          {this.props.auth &&
            <React.Fragment>
              <Tooltip title="Your profile">
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
                  <span>{this.props.user.handle.split(" ")[0]}</span>
                </Button>
              </Tooltip>
              <CreatePost />
              <Link to="/">
                <GenericIconButton tipTitle="Home">
                  <HomeIcon className={this.props.classes.navIcon} />
                </GenericIconButton>
              </Link>
              <GenericIconButton tipTitle="Notifications">
                <Badge
                  badgeContent={this.props.notifications.length}
                  overlap="circle"
                  color="secondary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Notifications className={this.props.classes.navIcon} />
                </Badge>
              </GenericIconButton>
              <Button
                style={{marginLeft: "5px"}}
                className={this.props.classes.orangeBtn}
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
    notifications: state.user.notifications,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => {
      dispatch(logoutUser())
    },
    updateNotifications: (notification) => {
      dispatch(updateNotifications(notification))
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NavBar));
