import React, { Component } from "react";
import moment from "moment";
import {Link} from "react-router-dom";

import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import GenericIconButton from "./GenericIconButton";

import {connect} from "react-redux";
import {likePost, dislikePost} from "../redux/actions/dataActions";

const styles = {
  card: {
    display: "flex",
    marginBottom: "15px"
  },
  image: {
    minWidth: "200px"
  },
  content: {
    padding: "15px"
  },
  disabledBtn: {
    cursor: "default",

    "&:hover": {
      backgroundColor: "transparent"
    }
  }
}

class Post extends Component {
  checkIfLiked = () => {
    if(this.props.user.likes.find(like => like.postId === this.props.post.id)) {
      return true
    } else {
      return false
    }
  }

  likePost = () => {
    this.props.likePost(this.props.post.id)
  }

  dislikePost = () => {
    this.props.dislikePost(this.props.post.id)
  }

  render() {
    const {classes, post} = this.props;

    const likeBtn = () => {
      return (
        <React.Fragment>
          {this.props.auth && this.checkIfLiked() &&
            <GenericIconButton tipTitle="I don't like it anymore" onClick={this.dislikePost}>
              <FavoriteBorder color="primary" />
            </GenericIconButton>          
          }

          {this.props.auth && !this.checkIfLiked() &&
            <GenericIconButton tipTitle="Like post" onClick={this.likePost}>
              <FavoriteIcon color="primary" />
            </GenericIconButton>          
          }

          {!this.props.auth &&
            <GenericIconButton tipClassName={classes.disabledBtn} tipTitle="Login to add likes!">
              <FavoriteIcon color="primary" disabled />
            </GenericIconButton> 
          }
        </React.Fragment>
      )
    }

    return (
      <Card className={classes.card}>
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

          <div style={{display: "flex", alignItems: "center"}}>
            <Typography variant="body2">
              {likeBtn()}
              <span>{post.likeCount} likes</span>
            </Typography>

            <Typography variant="body2">
              <GenericIconButton tipClassName={!this.props.auth && classes.disabledBtn} tipTitle={this.props.auth ? "Comments" : "Login to add comments!"}>
                <ChatIcon color="primary" />
              </GenericIconButton>
              <span>{post.commentCount} comments</span>
            </Typography>
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
