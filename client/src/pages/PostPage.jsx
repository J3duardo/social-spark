import React, { Component } from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import {connect} from "react-redux";
import {getPost} from "../redux/actions/dataActions";
import {CLEAR_ERRORS, CLEAR_SELECTED_POST} from "../redux/types";

import Post from "../components/Post";
import Comments from "../components/Comments";
import CommentForm from "../components/CommentForm";

const styles = {
  postWrapper: {
    width: "100%"
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    boxShadow: "none"
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

class PostPage extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.postId)
  }

  componentWillUnmount() {
    this.props.clearSelectedPost();
    this.props.clearErrors();
  }

  render() {
    const {classes, loading, post, comments} = this.props;
    console.log(comments)

    return (
      <React.Fragment>
        {loading ?
          <Container maxWidth="sm">
            <Paper className={classes.paper}>
              <CircularProgress size={50} />
            </Paper>
          </Container>
          :
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <div className={classes.postWrapper}>
                <Post post={post}/>
              </div>
              <hr className={classes.dividerVisible}/>
              {comments && <Comments comments={comments} />}
              <CommentForm postId={post.id}/>
            </Grid>
          </Container>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.data.post,
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
    },
    clearSelectedPost: () => {
      dispatch({type: CLEAR_SELECTED_POST})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PostPage));

