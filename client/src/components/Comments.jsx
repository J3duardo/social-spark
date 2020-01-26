import React, { Component } from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = {
  commentData: {
    width: "100%"
  },
  commentContainer: {
    marginBottom: "5px",
    alignItems: "center"
  },
  commentContent: {
    alignItems: "center",
  },
  commentImgContainer: {
    marginRight: "1rem"
  },
  commentImg: {
    display: "block",
    width: "100%",
    maxWidth: "75px",
    height: "75px",
    margin: "0px",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "50%"
  },
  dividerInvisible: {
    margin: "5px",
    border: "none"
  },
  dividerVisible: {
    width: "100%",
    marginBottom: "20px",
    borderBottom: "1px solid #ccc"
  }
}

class Comments extends Component {
  render() {
    const {comments, classes}= this.props;

    const renderComments = () => {
      return comments.map(comment => {
        const {body, createdAt, userAvatar, userHandle} = comment;
        return (
          <React.Fragment key={createdAt}>
            <Grid item sm={12} className={classes.commentContainer}>
              <Grid container className={classes.commentContent}>
                <Grid item sm={2}className={classes.commentImgContainer}>                  
                  <img
                    src={userAvatar}
                    style={{marginRight: 0}}
                    className={classes.commentImg}
                    alt="user avatar"
                  />
                </Grid>
                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/user/${userHandle}`}
                      color="primary"
                    >
                      {userHandle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {moment(createdAt).calendar()}
                    </Typography>
                    <hr className={classes.dividerInvisible}/>
                    <Typography variant="body1">
                      {body}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <hr className={classes.dividerVisible}/>
          </React.Fragment>
        )
      })
    }

    return (
      <Grid container>
        {renderComments()}
      </Grid>
    );
  }
}

export default withStyles(styles)(Comments);
