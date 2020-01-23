import { GET_POSTS, LOADING_POSTS, LOADING_POSTS_ERROR, LIKE_POST, DISLIKE_POST, DELETE_POST, CREATE_POST, CREATING_POST, CLEAR_ERRORS, GET_POST, LOADING_POST, ADDING_COMMENT, ADD_COMMENT, CLEAR_SELECTED_POST, GET_USER_BY_HANDLE, LOADING_USER_BY_HANDLE, CLEAR_SELECTED_USER } from "../types"

const initialState = {
  posts: [],
  post: {},
  selectedUser: null,
  loadingSelectedUser: false,
  loading: false,
  loadingComment: false,
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
    case GET_POST:
      return {
        ...state,
        post: action.payload
      }
    case GET_USER_BY_HANDLE:
      return {
        ...state,
        selectedUser: action.payload,
        loadingSelectedUser: false
      }
    case LOADING_USER_BY_HANDLE:
      return {
        ...state,
        loadingSelectedUser: action.payload
      }
    case CLEAR_SELECTED_USER:
      return {
        ...state,
        selectedUser: null
      }
    case CLEAR_SELECTED_POST:
      return {
        ...state,
        post: {}
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
    case ADD_COMMENT:
      // Actualizar el post seleccionado
      const updatedPost = {...state.post};
      updatedPost.comments = [action.payload, ...updatedPost.comments];
      updatedPost.commentCount = updatedPost.commentCount + 1;

      // Actualizar el post en el array de posts
      const posts = [...state.posts];
      const updatedPostIndex = state.posts.findIndex(post => post.id === action.payload.postId);
      const postToUpdate = posts[updatedPostIndex];

      postToUpdate.commentCount = postToUpdate.commentCount + 1
      posts.splice(updatedPostIndex, 1, postToUpdate);

      return {
        ...state,
        post: updatedPost,
        posts: posts
      }
    case ADDING_COMMENT:
      return {
        ...state,
        loadingComment: action.payload
      }
    case CREATING_POST:
    case LOADING_POST:
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