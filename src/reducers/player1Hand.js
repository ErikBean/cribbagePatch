import { difference } from 'lodash'
const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLAYER1_HAND':
      return action.payload ? action.payload.sort() : action.payload
    case 'PLAYER1_DISCARD':
      return difference(state, action.payload)
    default:
      return state
  }
}
