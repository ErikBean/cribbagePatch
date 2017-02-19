const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYER1_PLAY_CARD':
      return action.payload
    default:
      return state
  }
}
