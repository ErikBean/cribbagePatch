const initialState = {
  isPlayer1: false,
  isPlayer2: false,
  hasGameStarted: false,
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ASSIGN_PLAYER':
      switch(action.payload){
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
    case 'START_GAME':
      return {
        ...state,
        hasGameStarted: true
      }
    default:
      return state
  }
}
