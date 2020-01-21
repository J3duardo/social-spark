import React, { Component } from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import LocationIcon from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";

import {uploadImage} from "../redux/actions/userActions";

const styles = {
  paper: {
    padding: 20
  },
  progressWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem"
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center"
    },
    "& .profile-image": {
      position: "relative",
      width: "100%",
      maxWidth: 200,
      height: 200,
      margin: "0 auto",
      padding: "0 1.1rem 1.1rem 0",
      borderRadius: "50%",
      
      "& img": {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        borderRadius: "50%",
      }
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  avatarInputWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0
  },
  avatarInput: {
    display: "none"
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
}

class Profile extends Component {  
  avatarUploadHandler = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file, file.name);

    this.props.uploadImage(formData)
  }

  editAvatarHandler = () => {
    const avatarInput = document.getElementById("avatarInput");
    avatarInput.click();
  }

  render() {
    const {classes, user, loading} = this.props;

    return (
      <React.Fragment>
        {loading && (
          // eslint-disable-next-line
          <Paper className={classes.paper, classes.progressWrapper}>
            <CircularProgress className={classes.progress} />
          </Paper>
        )}

        {!loading && user.auth &&
          <Paper className={classes.paper} >
            <div className={classes.profile}>
              <div className="profile-image">
                <img src={user.credentials.imageURL} alt="User avatar"/>
                <Tooltip title="Change avatar" placement="top">
                  <div className={classes.avatarInputWrapper}>
                    <input
                      className={classes.avatarInput}
                      type="file"
                      id="avatarInput"
                      onChange={this.avatarUploadHandler}
                    />
                    <IconButton
                      onClick={this.editAvatarHandler}
                      className="button"
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </div>
                </Tooltip>
              </div>
              <hr/>
              <div className="profile-details">
                <MLink
                  component={Link}
                  to={`/users/${user.credentials.handle}`}
                  color="primary" variant="h5"
                >
                  @{user.credentials.handle}
                </MLink>
                <hr/>
                {user.credentials.bio &&
                  <Typography variant="body2">
                    {user.credentials.bio}
                  </Typography>
                }
                <hr/>
                {user.credentials.location && (
                  <React.Fragment>
                    <Typography variant="body2">
                      <LocationIcon color="primary" /> {user.credentials.location}
                    </Typography>
                    <hr/>
                  </React.Fragment>
                )}
                {user.credentials.website &&
                  <React.Fragment>
                    <LinkIcon color="primary" />
                    <a href={user.credentials.website} target="_blank" rel="noopener noreferrer">
                      {user.credentials.website}
                    </a>
                    <hr/>
                  </React.Fragment>
                }
                <Typography variant="body2">
                  <CalendarToday color="primary" /> Joined: {moment(user.credentials.createdAt).calendar()}
                </Typography>
              </div>
            </div>
          </Paper>
        }
        {!loading && !user.auth &&
          <Paper className={classes.paper}>
            <Typography color="textSecondary" variant="h6" align="center">
              No profile to display. Login or signup.
            </Typography>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </div>
          </Paper>
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loading: state.ui.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImage: (data) => {
      dispatch(uploadImage(data))
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Profile));
