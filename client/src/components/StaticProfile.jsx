import React from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import MLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import CalendarToday from "@material-ui/icons/CalendarToday";
import LocationIcon from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";

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
    }
  },
  avatarInputWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0
  },
  avatarInput: {
    display: "none"
  }
}

const StaticProfile = (props) => {
  const {classes, profile} = props;
  return (
    <Paper className={classes.paper} >
      <div className={classes.profile}>
        <div className="profile-image">
          <img src={profile.imageURL} alt="User avatar"/>
        </div>
        <hr/>
        <div className="profile-details">
          <MLink
            component={Link}
            to={`/user/${profile.handle}`}
            color="primary" variant="h5"
          >
            @{profile.handle}
          </MLink>
          <hr/>
          {profile.bio &&
            <Typography variant="body2">
              {profile.bio}
            </Typography>
          }
          <hr/>
          {profile.location && (
            <React.Fragment>
              <Typography variant="body2">
                <LocationIcon color="primary" /> {profile.location}
              </Typography>
              <hr/>
            </React.Fragment>
          )}
          {profile.website &&
            <React.Fragment>
              <Typography variant="body2">
                <LinkIcon color="primary" /> {" "}
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </a>
              </Typography>
              <hr/>
            </React.Fragment>
          }
          <Typography variant="body2">
            <CalendarToday color="primary" /> Joined: {moment(profile.createdAt).calendar()}
          </Typography>
        </div>
      </div>
    </Paper>
  )
}

export default withStyles(styles)(StaticProfile);
