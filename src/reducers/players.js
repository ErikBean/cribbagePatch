const initialState = {
  player1: {
    beginGameCut: ''
  },
  player2: {
    beginGameCut: ''
  }
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'BEGIN_GAME_CUT':
      return {
        ...state,
        [action.payload.player]: {
          ...state[action.payload.player],
          beginGameCut: action.payload.cut
        }
      }
    case 'GET_HAND':
      return {
        ...state,
        [action.payload.player]: {
          ...state[action.payload.player],
          hand: action.payload
        }
      }
    case 'UPDATE_PLAYER':
      return {
        ...state,
        [action.payload.player]: action.payload.update
      }
    default:
      return state
  }
}
