import axios from "axios";
import { LOADING_POSTS, GET_POSTS, LOADING_POSTS_ERROR, LIKE_POST, DISLIKE_POST, DELETE_POST } from "../types";

export const getPosts = () => {
  return async (dispatch) => {
    dispatch({type: LOADING_POSTS});

    try {
      const response = await axios({
        method: "GET",
        url: "/posts"  
      });

      dispatch({
        type: GET_POSTS,
        payload: response.data.data
      });

    } catch (error) {
      dispatch({
        type: LOADING_POSTS_ERROR,
        payload: (error.response && error.response.data) || error
      })
    }
  }
}

// Action para dar like a los posts
export const likePost = (postId) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "GET",
        url: `/post/${postId}/like`
      });
  
      dispatch({
        type: LIKE_POST,
        payload: response.data.data
      })
      
    } catch (error) {
      console.log(error)
    }
  }
}

// Action para dar unlike a los posts
export const dislikePost = (postId) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "GET",
        url: `/post/${postId}/unlike`
      });
  
      dispatch({
        type: DISLIKE_POST,
        payload: response.data.data
      })
      
    } catch (error) {
      console.log(error)
    }
  }
}

// Action para borrar posts
export const deletePost = (postId) => {
  return async (dispatch) => {
    try {
      await axios({
        method: "DELETE",
        url: `/post/${postId}` 
      });

      dispatch({type: DELETE_POST, payload: postId});

    } catch (error) {
      console.log(error)
    }
  }
}
