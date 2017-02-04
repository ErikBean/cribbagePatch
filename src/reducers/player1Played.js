const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYER1_PLAY_CARD':
      return state.concat(action.payload)
    default:
      return state
  }
}
