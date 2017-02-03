const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLAYER2_HAND':
      return action.payload
    default:
      return state
  }
}
