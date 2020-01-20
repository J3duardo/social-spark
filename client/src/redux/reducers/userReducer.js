import { SET_AUTH, SET_UNAUTH, SET_USER } from "../types"

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
    default:
      return state
  }
}