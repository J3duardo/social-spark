import React, { Component } from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import DeletePostDialog from "./DeletePostDialog";
import PostDialog from "./PostDialog";

import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import {connect} from "react-redux";
import {likePost, dislikePost} from "../redux/actions/dataActions";
import PostButtons from "./PostButtons";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: "15px"
  },
  image: {
    minWidth: "200px"
  },
  content: {
    padding: "15px"
  },
  postDialogBtn: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
  },
  disabledBtn: {
    cursor: "default",

    "&:hover": {
      backgroundColor: "transparent"
    }
  }
}

class Post extends Component {

  // Borrar post
  deleteButton = () => {
    const check = this.props.auth && this.props.post.userHandle === this.props.user.credentials.handle;

    if(check){
      return (
        <DeletePostDialog postId={this.props.post.id} />
      )
    }

    return null;
  }

  render() {
    const {classes, post} = this.props;
    return (
      <Card className={classes.card}>
        {this.deleteButton()}
        <CardMedia
          title="Profile image"
          className={classes.image}
          image={post.userImage}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
            component={Link}
            to={`/user/${post.userHandle}`}
          >
            {post.userHandle}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            <span>{moment(post.createdAt).calendar()}</span>
          </Typography>
          <Typography variant="body1">{post.body}</Typography>

          {/* Botones de like y comentarios */}
          <PostButtons post={post} />

          {/* Botón para expandir detalles del post */}
          <div className={classes.postDialogBtn}>
            <PostDialog
              post={post}
              postId={this.props.post.id}
              userHandle={this.props.user.credentials.handle}
            />
          </div>
          
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (postId) => {
      dispatch(likePost(postId))
    },
    dislikePost: (postId) => {
      dispatch(dislikePost(postId))
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Post));
