import React, { Component } from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import GenericIconButton from "./GenericIconButton";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

import {connect} from "react-redux";
import {getPost} from "../redux/actions/dataActions";
import {CLEAR_ERRORS} from "../redux/types";

import PostButtons from "./PostButtons";
import Comments from "./Comments";

const styles = {
  postDialog: {
    position: "relative"
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    boxShadow: "none"
  },
  closeIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#ff3d00"
  },
  userImage: {
    display: "block",
    maxWidth: "200px",
    height: "200px",
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

class PostDialog extends Component {
  state = {
    open: false
  }

  openDialogHandler = () => {
    this.setState({
      open: true
    });

    this.props.getPost(this.props.postId)
  }

  closeDialogHandler = () => {
    this.setState({
      open: false
    });
  }

  dialogContent = (post, classes) => {
    if(this.props.loading) {
      return (
        <Paper className={classes.paper}>
          <CircularProgress size={50} />
        </Paper>
      )
    } else {
      return (
        <Grid container spacing={2}>
          <Grid item sm={5}>
            <img src={post.userImage} className={classes.userImage} alt="User avatar"/>
          </Grid>
          <Grid item sm={7}>
            <Typography component={Link} color="primary" variant="h5" to={`/users/${post.userHandle}`}>
              @{post.userHandle}
            </Typography>
            <hr className={classes.dividerInvisible}/>
            <Typography variant="body2" color="textSecondary">
              {moment(post.createdAt).calendar()}
            </Typography>
            <hr className={classes.dividerInvisible}/>
            <Typography variant="body1">
              {post.body}
            </Typography>
            <PostButtons post={post} />
          </Grid>
          <hr className={classes.dividerVisible}/>
          <Comments comments={this.props.comments} />
        </Grid>
      )
    }
  }

  render() {
    const {classes, post} = this.props;

    return (
      <React.Fragment>
        <GenericIconButton tipTitle="More details..." onClick={this.openDialogHandler} tipClassName={classes.expandBtn}>
          <UnfoldMore color="primary" />
        </GenericIconButton>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialogHandler}
          className={classes.postDialog}
          fullWidth
          maxWidth="sm"
        >
          <GenericIconButton
            tipTitle="Close"
            onClick={this.closeDialogHandler}
            tipClassName={classes.closeIcon}
          >
            <CloseIcon />
          </GenericIconButton>
          <DialogContent className={classes.dialogContent}>
            {this.dialogContent(post, classes)}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    comments: state.data.post.comments,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPost: (postId) => {
      dispatch(getPost(postId))
    },
    clearErrors: () => {
      dispatch({type: CLEAR_ERRORS})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PostDialog));
