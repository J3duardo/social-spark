import { SET_UNAUTH, SET_USER, LIKE_POST, DISLIKE_POST, UPDATE_NOTIFICATIONS, MARK_NOTIFICATIONS_READ } from "../types"

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
      const filteredLikes = state.likes.filter(like => like.postId !== action.payload.id)
      return {
        ...state,
        likes: [...filteredLikes]
      }
    case UPDATE_NOTIFICATIONS:
      if(state.credentials.handle === action.payload.recipient) {
        return {
          ...state,
          notifications: [action.payload, ...state.notifications]
        }
      } else {
        return state
      }
    case MARK_NOTIFICATIONS_READ:
      const readNotifications = [...state.notifications];
      readNotifications.forEach((notification) => {
        notification.read = true
      })
      return {
        ...state,
        notifications: readNotifications
      }
    default:
      return state
  }
}