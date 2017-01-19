const initialState = {
  player1: {},
  player2: {}
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'BEGIN_GAME_CUT':
      return {
        ...state,
        [action.payload.player]: {
          beginGameCut: action.payload.cut
        }
      }
    case 'GET_HAND':{
      return {
        ...state,
        hand: action.payload
      }
    }
    default:
      return state
  }
}
