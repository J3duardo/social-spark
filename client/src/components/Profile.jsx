import React, { Component } from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationIcon from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import moment from "moment";

const styles = {
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      margin: "0 auto",
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
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
}

class Profile extends Component {  
  render() {
    const {classes, user, loading} = this.props;

    let profile = !loading ? (user.auth ? (
      <Paper className={classes.paper} >
        <div className={classes.profile}>
          <div className="profile-image">
            <img src={user.credentials.imageURL} alt="User avatar"/>
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
                <LocationIcon color="primary" />
                <span>{user.credentials.location}</span>
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
            <CalendarToday color="primary" /> {" "}
            <Typography variant="body2">Joined: {moment(user.credentials.createdAt).calendar()}</Typography>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
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
    )) :
    (<p>Loading...</p>)

    return profile;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loading: state.ui.loading
  }
}

export default withStyles(styles)(connect(mapStateToProps)(Profile));
