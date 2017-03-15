import { union } from 'lodash'
const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CRIB':
      return action.payload.length ? union(action.payload, state).sort() : []
    default:
      return state
  }
}
