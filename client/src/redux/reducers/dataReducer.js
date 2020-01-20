import { GET_POSTS, LOADING_POSTS, LOADING_POSTS_ERROR } from "../types"

const initialState = {
  posts: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case LOADING_POSTS:
      return {
        ...state,
        loading: true
      }
    case GET_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload
      }
    case LOADING_POSTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}