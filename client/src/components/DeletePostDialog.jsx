import React, { Component } from "react";
import {withStyles} from "@material-ui/core/styles";
import GenericIconButton from "./GenericIconButton";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import {connect} from "react-redux";
import {deletePost} from "../redux/actions/dataActions";

const styles = {
  deleteBtn: {
    position: "absolute",
    top: "5px",
    right: "5px"
  }
}

class DeletePost extends Component {
  state = {
    open: false
  }

  openDialogHandler = () => {
    this.setState({
      open: true
    })
  }

  closeDialogHandler = () => {
    this.setState({
      open: false
    })
  }

  deletePostHandler = () => {
    this.props.deletePost(this.props.postId);
    this.setState({open: false})
  }

  render() {  
    const {classes} = this.props;

    return (
      <React.Fragment>
        <GenericIconButton tipTitle="Delete post" onClick={this.openDialogHandler} btnClassName={classes.deleteBtn} >
          <DeleteOutline color="secondary" />
        </GenericIconButton>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialogHandler}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Are you sure you want to delete the post?</DialogTitle>
          <DialogActions>
            <Button onClick={this.closeDialogHandler} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deletePostHandler} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletePost: (postId) => {
      dispatch(deletePost(postId))
    }
  }
}

export default withStyles(styles)(connect(null, mapDispatchToProps)(DeletePost));
