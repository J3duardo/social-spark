import React, { Component } from "react";
import GenericIconButton from "./GenericIconButton";
import {withStyles} from "@material-ui/core/Styles";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import {connect} from "react-redux";
import {likePost, dislikePost} from "../redux/actions/dataActions";

const styles = (theme) => ({
  iconsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down(410)]: {
      flexDirection: "column"
    }
  },
  disabledBtn: {
    cursor: "default",

    "&:hover": {
      backgroundColor: "transparent"
    }
  }
})

class PostButtons extends Component {
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

  render() {
    const {classes, post, selectedPost} = this.props;

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
      <div className={classes.iconsWrapper}>
        {/* Botón de likes */}
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
          <span>{Object.keys(selectedPost).length ? selectedPost.commentCount : post.commentCount} comments</span>
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    user: state.user,
    selectedPost: state.data.post
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

export default withStyles(styles)((connect(mapStateToProps, mapDispatchToProps)(PostButtons)));
