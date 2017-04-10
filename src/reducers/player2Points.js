const initialState = 0
export default (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYER2_POINTS':
      return action.payload
    default:
      return state
  }
}
