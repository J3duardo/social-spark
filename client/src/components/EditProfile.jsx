import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";

import {connect} from "react-redux";
import {updateProfile} from "../redux/actions/userActions";

const styles = {
  form: {
    textAlign: "center"
  },
  button: {
    position: "relative",
    margin: "10px 0"
  },
  editButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textField: {
    margin: "10px 0"
  },
}

class EditProfile extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false
  }

  setInitialValues = (data) => {
    const {bio, website, location} = data
      this.setState({
        bio,
        website,
        location
      })
  }

  componentDidMount() {
    if(this.props.userData) {
      this.setInitialValues(this.props.userData)
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submitHandler = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    }

    this.props.updateProfile(userDetails)
  }

  openModalHandler = () => {
    this.setState({
      open: true
    });
    this.setInitialValues(this.props.userData)
  }

  closeModalHandler = () => {
    this.setState({
      open: false
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <React.Fragment>
        <div className={classes.editButtonWrapper}>
          <Tooltip title="Edit profile" placement="top">
            <IconButton onClick={this.openModalHandler} className={classes.button}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Typography variant="body2">Edit your profile</Typography>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.closeModalHandler}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                fullWidth
                placeholder="Tell us about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.onChangeHandler}
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                fullWidth
                placeholder="Your personal or professional website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.onChangeHandler}
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                fullWidth
                placeholder="Your location"
                className={classes.textField}
                value={this.state.location}
                onChange={this.onChangeHandler}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.submitHandler} color="primary">
              Submit
            </Button>
            <Button onClick={this.closeModalHandler} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.user.credentials
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (data) => {
      dispatch(updateProfile(data))
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditProfile));
