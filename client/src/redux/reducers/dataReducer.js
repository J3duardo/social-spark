import { GET_POSTS, LOADING_POSTS, LOADING_POSTS_ERROR, LIKE_POST, DISLIKE_POST, DELETE_POST, CREATE_POST, CREATING_POST, CLEAR_ERRORS } from "../types"

const initialState = {
  posts: [],
  post: {},
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
    case LIKE_POST:
      const likedPosts = [...state.posts];
      const likedPostIndex = likedPosts.findIndex(post => post.id === action.payload.id);
      likedPosts[likedPostIndex] = action.payload;
      
      return {
        ...state,
        posts: likedPosts,
        loading: false
      }
      case DISLIKE_POST:
        const unlikedPosts = [...state.posts];
        const unlikedPostIndex = unlikedPosts.findIndex(post => post.id === action.payload.id);
        unlikedPosts[unlikedPostIndex] = action.payload;

      return {
        ...state,
        posts: unlikedPosts,
        loading: false
      }
    case DELETE_POST:
      const currentPosts = state.posts;
      const deletedPostIndex = currentPosts.findIndex(post => post.id === action.payload);
      currentPosts.splice(deletedPostIndex, 1);

      return {
        ...state,
        posts: currentPosts
      }
    case CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false
      }
    case CREATING_POST:
      return {
        ...state,
        loading: action.payload
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}