const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'PLAY_CARD':
      return action.payload // all cards pegged so far, with new one on the end
    default:
      return state
  }
}
