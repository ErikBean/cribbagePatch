const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLAYER1_HAND':
      return action.payload
    default:
      return state
  }
}
