const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CUT':
      return action.payload
    default:
      return state
  }
}
