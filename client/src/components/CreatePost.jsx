import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
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

const styles = (theme) => ({
  postDialog: {
    position: "relative"
  },
  whiteIcon: {
    color: "#fff",
    [theme.breakpoints.down(550)]: {
      color: "rgb(125, 125, 125)"
    }
  },
  closeIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#ff3d00"
  },
  textField: {
    margin: "10px 0"
  },
  progress: {
    position: "absolute"
  },
})

class CreatePost extends Component {
  state = {
    open: false,
    body: "",
    errors: {}
  }

  componentDidUpdate(prevProps) {
    if(window.innerWidth < 550 && prevProps.showOnMobile !== this.props.showOnMobile) {
      this.setState({
        open: this.props.showOnMobile
      })
    }
  }

  openDialogHandler = () => {
    if(window.innerWidth >= 550) {
      this.setState({
        open: true
      })
    }
  }

  closeDialogHandler = () => {
    if(window.innerWidth < 550) {
      this.props.closeModal();
    }

    this.setState({
      open: false,
      body: ""
    });

    this.props.clearErrors();
  }

  onChangeHandler = (e) => {
    if(this.props.errors) {
      this.props.clearErrors()
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmitHandler = async (e) => {
    e.preventDefault();
    await this.props.createPost({body: this.state.body});

    if(!this.props.loading && !this.props.errors) {
      this.closeDialogHandler()
    }
  }

  render() {
    const {classes, errors} = this.props;

    return (
      <React.Fragment>
        <GenericIconButton tipTitle="Create post" onClick={this.openDialogHandler}>
          <AddIcon className={classes.whiteIcon}/>
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
                fullWidth
                multiline
                placeholder="Say something interesting"
                onChange={this.onChangeHandler}
                value={this.state.body}
                error={errors && errors.body ? true : false}
                helperText={errors && errors.body ? errors.body : ""}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button disabled={this.props.loading} color="primary" onClick={this.onSubmitHandler}>
              Submit
              {this.props.loading &&
                <CircularProgress
                  size="1.5rem"
                  thickness={6}
                  className={classes.progress} />
              }
            </Button>
            <Button disabled={this.props.loading} onClick={this.closeDialogHandler} color="secondary">
              Cancel
              {this.props.loading &&
                <CircularProgress
                  size="1.5rem"
                  thickness={6}
                  className={classes.progress} />
              }
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
    errors: state.ui.errors,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: async (postData) => {
      await dispatch(createPost(postData))
    },
    clearErrors: () => {
      dispatch({type: CLEAR_ERRORS})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CreatePost));

