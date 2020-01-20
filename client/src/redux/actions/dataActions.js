import axios from "axios";
import { LOADING_POSTS, GET_POSTS, LOADING_POSTS_ERROR } from "../types";

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
        payload: error.response.data || error
      })
    }
  }
}