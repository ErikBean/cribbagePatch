const initialState = {
  isPlayer1: false,
  isPlayer2: false,
  firstCut: null,
  secondCut: null
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'FIRST_CUT':
    {
      const { cut, isLocal } = action.payload
      return {
        ...state,
        firstCut: { cut, isLocal }
      }
    }
    case 'SECOND_CUT':
    {
      const { cut, isLocal } = action.payload
      return {
        ...state,
        secondCut: { cut, isLocal }
      }
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
