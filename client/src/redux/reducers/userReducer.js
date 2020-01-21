import { SET_UNAUTH, SET_USER, LIKE_POST, DISLIKE_POST } from "../types"

const initialState = {
  auth: false,
  credentials: {},
  likes: [],
  notifications: []
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_UNAUTH:
      return initialState
    case SET_USER:
      return {
        ...state,
        auth: true,
        ...action.payload
      }
    case LIKE_POST:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            postId: action.payload.id
          }
        ]
      }
    case DISLIKE_POST:
      const filteredLikes = state.likes.filter(like => like.postId !== action.payload.id && like.userHandle !== action.payload.userHandle)
      return {
        ...state,
        likes: [...filteredLikes]
      }
    default:
      return state
  }
}