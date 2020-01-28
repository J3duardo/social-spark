import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import {connect} from "react-redux";
import {createComment} from "../redux/actions/dataActions";
import { CLEAR_ERRORS } from "../redux/types";

const styles = {
  textField: {
    margin: "10px 0"
  },
  button: {
    position: "relative",
    margin: "10px 0"
  },
  dividerInvisible: {
    margin: "5px",
    border: "none"
  },
  progress: {
    position: "absolute"
  },
}

export class CommentForm extends Component {
  state = {
    body: ""
  }

  componentWillUnmount() {
    if(this.props.errors) {
      this.props.clearErrors()
    }
    this.setState({
      body: ""
    })
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
    await this.props.createComment(this.props.postId, this.state.body);
    this.setState({
      body: ""
    })
  }

  render() {
    const {classes, auth, errors, loading} = this.props;

    const form = () => {
      return (
        <Grid item sm={12} style={{width: "100%", textAlign: "center"}}>
          <form onSubmit={this.onSubmitHandler}>
            <TextField
              name="body"
              type="text"
              label="Add comment"
              multiline
              error={errors && errors.comment ? true : false}
              helperText={errors && errors.comment}
              onChange={this.onChangeHandler}
              value={this.state.body}
              fullWidth
              className={classes.textField}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.buttom}
            >
              {loading &&
                <CircularProgress
                  size="1.5rem"
                  thickness={6}
                  className={classes.progress}
                />
              }
              Add comment
            </Button>
          </form>
          <br className={classes.dividerInvisible}/>
        </Grid>
      )
    }

    return (
      <React.Fragment>
        {auth ? form() : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    errors: state.ui.errors,
    loading: state.data.loadingComment
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createComment: async (postId, body) => {
      await dispatch(createComment(postId, body))
    },
    clearErrors: () => {
      dispatch({type: CLEAR_ERRORS})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CommentForm));
