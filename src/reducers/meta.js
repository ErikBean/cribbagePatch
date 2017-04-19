const initialState = {
  isPlayer1: false,
  isPlayer2: false,
  pastPlayedCardsIndex: 0
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ASSIGN_PLAYER':
      switch (action.payload) {
        case 'player1':
          return {
            ...state,
            isPlayer1: true
          }
        case 'player2':
          return {
            ...state,
            isPlayer2: true
          }
        default:
          return state
      }
    case 'MARK_CARDS_PEGGED':
      return {
        ...state,
        pastPlayedCardsIndex: action.payload
      }
    default:
      return state
  }
}
