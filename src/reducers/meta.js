const initialState = {
  isPlayer1: false,
  isPlayer2: false,
  firstCut: null,
  secondCut: null
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'FIRST_CUT':
      return {
        ...state,
        firstCut: action.payload
      }
    case 'SECOND_CUT':
      return {
        ...state,
        secondCut: action.payload
      }
    case 'ASSIGN_PLAYER':
      switch(action.payload){
        case 'player1':
          return {
            ...state,
            isPlayer1: true,
            isMyCrib: true
          }
        case 'player2': 
          return {
            ...state,
            isPlayer2: true,
            isMyCrib: false
          }
        default: 
          return state
      }

    default:
      return state
  }
}
