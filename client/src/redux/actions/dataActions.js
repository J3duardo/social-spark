import axios from "axios";
import { LOADING_POSTS, GET_POSTS, LOADING_POSTS_ERROR, LIKE_POST, DISLIKE_POST, DELETE_POST, CREATE_POST, CREATING_POST, SET_ERRORS, GET_POST, LOADING_POST, ADDING_COMMENT, ADD_COMMENT, LOADING_USER_BY_HANDLE, GET_USER_BY_HANDLE} from "../types";

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

// Action para crear posts
export const createPost = (postData) => {
  return async (dispatch) => {
    dispatch({type: CREATING_POST, payload: true});
    try {
      const response = await axios({
        method: "POST",
        url: "/posts",
        data: postData
      });

      dispatch({
        type: CREATE_POST,
        payload: response.data.data
      });

      dispatch({type: CREATING_POST, payload: false});

    } catch (error) {
      if(error.response && error.response.data.message && error.response.data.message.toLowerCase().includes("validation")) {
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {...error.response.data.data.errors}
          }
        });

        dispatch({type: CREATING_POST, payload: false});
      } else {
        console.log(error);
      }
    }
  }
}

// Action para tomar los detalles de un post
export const getPost = (postId) => {
  return async (dispatch) => {
    dispatch({type: LOADING_POST, payload: true});

    try {
      const response = await axios({
        method: "GET",
        url: `/post/${postId}`
      });

      dispatch({
        type: GET_POST,
        payload: response.data.data
      });

      dispatch({type: LOADING_POST, payload: false});

    } catch (error) {
      console.log({...error})
      if(error.response && error.response.data.message && error.response.data.message.toLowerCase().includes("not found")) {
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {notFound: "Post nor found"}
          }
        })
      } else {
        console.log(error.message)
      }
    }
  }
}

// Action para crear comentarios
export const createComment = (postId, body) => {
  return async (dispatch) => {
    dispatch({type: ADDING_COMMENT, payload: true});
    try {
      const response = await axios({
        method: "POST",
        url: `/post/${postId}/comment`,
        data: {
          body: body
        }
      });

      dispatch({type: ADDING_COMMENT, payload: false});
      dispatch({type: ADD_COMMENT, payload: response.data.data});

    } catch (error) {
      if(error.response && error.response.data.message.includes("not found")) {
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {notFound: "Post not found"}
          }
        });
        dispatch({type: ADDING_COMMENT, payload: false});
      } else if(error.response && error.response.data.message.includes("empty")) {
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {comment: "Comment can't be empty"}
          }
        });
        dispatch({type: ADDING_COMMENT, payload: false});
      } else {
        console.log(error, {...error});
        dispatch({type: ADDING_COMMENT, payload: false});
      }
    }
  }
}

// Actio para buscar el perfil de un usuario específico
export const getSpecificUser = (handle) => {
  return async (dispatch) => {
    dispatch({type: LOADING_USER_BY_HANDLE, payload: true});

    try {
      const response = await axios({
        method: "GET",
        url: `/user/${handle}`
      });

      dispatch({
        type: GET_USER_BY_HANDLE,
        payload: response.data.data
      });

      dispatch({type: LOADING_USER_BY_HANDLE, payload: false});

    } catch (error) {
      if(error.response && error.response.data.message.includes("not found")) {
        dispatch({type: LOADING_USER_BY_HANDLE, payload: false});
        return dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {notFound: "User not found"}
          }
        });
      } else {
        console.log(error, {...error});
        dispatch({type: LOADING_USER_BY_HANDLE, payload: false});
      }
    }
  }
}
