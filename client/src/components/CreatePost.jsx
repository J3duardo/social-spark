import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import GenericIconButton from "./GenericIconButton";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";

import {connect} from "react-redux";
import {createPost} from "../redux/actions/dataActions";
import {CLEAR_ERRORS} from "../redux/types";

const styles = {
  postDialog: {
    position: "relative"
  },
  whiteIcon: {
    color: "#fff"
  },
  closeIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#ff3d00"
  },
  textField: {
    margin: "10px 0"
  }
}

class CreatePost extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  }

  openDialogHandler = () => {
    this.setState({
      open: true
    })
  }

  closeDialogHandler = () => {
    this.setState({
      open: false
    });

    this.props.clearErrors()
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    this.props.createPost({body: this.state.body});
  }

  render() {
    const {classes, errors} = this.props;

    return (
      <React.Fragment>
        <GenericIconButton tipTitle="Create post" onClick={this.openDialogHandler}>
          <AddIcon className={classes.whiteIcon} />
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
          <DialogTitle>Create new post</DialogTitle>
          <DialogContent>
            <form onSubmit={this.onSubmitHandler}>
              <TextField
                className={classes.textField}
                type="text"
                name="body"
                label="Post content"
                rows="5"
                fullWidth
                placeholder="Say something interesting"
                onChange={this.onChangeHandler}
                value={this.state.body}
                error={errors && errors.body ? true : false}
                helperText={errors && errors.body ? errors.body : ""}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.onSubmitHandler}>
              Submit
            </Button>
            <Button onClick={this.closeDialogHandler} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    posts: state.data.posts,
    errors: state.ui.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (postData) => {
      dispatch(createPost(postData))
    },
    clearErrors: () => {
      dispatch({type: CLEAR_ERRORS})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CreatePost));

