const initialState = {
  player1: {
    beginGameCut: ''
  },
  player2: {
    beginGameCut: ''
  }
}
export default (state = initialState, action) => {
  if(!action.payload) return state
  const { player, cut, hand, update } = action.payload
  switch (action.type) {
    case 'BEGIN_GAME_CUT':
      return {
        ...state,
        [player]: {
          ...state[player],
          beginGameCut: cut
        }
      }
    case 'GET_HAND':
      return {
        ...state,
        [player]: {
          ...state[player],
          hand
        }
      }
    case 'UPDATE_PLAYER':
      return {
        ...state,
        [player]: update
      }
    default:
      return state
  }
}
