const initialState = {
  isPlayer1: false,
  isPlayer2: false,
  hasGameStarted: false,
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ASSIGN_PLAYER1':
      return {
        ...state,
        isPlayer1: true
      }
    case 'ASSIGN_PLAYER2':
      return {
        ...state,
        isPlayer2: true
      }
    case 'START_GAME':
      return {
        ...state,
        hasGameStarted: true
      }
    default:
      return state
  }
}
