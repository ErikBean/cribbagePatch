import { difference } from 'lodash'
const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLAYER2_HAND':
      return action.payload ? Array.from(action.payload).sort((a, b) => a > b) : action.payload
    case 'PLAYER2_DISCARD':
      return difference(state, action.payload)
    default:
      return state
  }
}
