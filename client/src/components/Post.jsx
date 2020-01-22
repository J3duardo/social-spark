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
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import GenericIconButton from "./GenericIconButton";

import {connect} from "react-redux";
import {likePost, dislikePost} from "../redux/actions/dataActions";

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
  disabledBtn: {
    cursor: "default",

    "&:hover": {
      backgroundColor: "transparent"
    }
  }
}

class Post extends Component {
  checkIfLiked = () => {
    // Chequear si el usuario ya le dio like al post
    const check = this.props.user.likes.find(like => like.postId === this.props.post.id);

    if(check) {
      return true
    } else {
      return false
    }
  }

  // Agregar el like al post
  likePost = () => {
    this.props.likePost(this.props.post.id)
  }

  // Remover el like al post
  dislikePost = () => {
    this.props.dislikePost(this.props.post.id)
  }

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

    const likeBtn = () => {
      return (
        <React.Fragment>
          {/* Botón para remover el like */}
          {this.props.auth && this.checkIfLiked() &&
            <GenericIconButton tipTitle="I don't like it anymore" onClick={this.dislikePost}>
              <FavoriteBorder color="primary" />
            </GenericIconButton>          
          }

          {/* Botón para agregar el like */}
          {this.props.auth && !this.checkIfLiked() &&
            <GenericIconButton tipTitle="Like post" onClick={this.likePost}>
              <FavoriteIcon color="primary" />
            </GenericIconButton>          
          }

          {/* Botón de like desactivado para usuarios no autenticados */}
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

          <div style={{display: "flex", alignItems: "center"}}>
            <Typography variant="body2">
              {likeBtn()}
              <span>{post.likeCount} likes</span>
            </Typography>

            {/* Botón de comentarios */}
            <Typography variant="body2">
              <GenericIconButton
                tipClassName={!this.props.auth && classes.disabledBtn}
                tipTitle={this.props.auth ? "Comments" : "Login to add comments!"}
              >
                <ChatIcon color="primary" />
              </GenericIconButton>
              <span>{post.commentCount} comments</span>
            </Typography>
            {/* Botón para expandir detalles del post */}
            <PostDialog postId={this.props.post.id} userHandle={this.props.user.credentials.handle}/>
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
