import { union } from 'lodash'
const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CRIB':
      return union(action.payload, state)
    default:
      return state
  }
}
