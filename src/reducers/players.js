const initialState = {
  player1: {},
  player2: {}
}
export default (state = initialState, action) => {
  if(!action.payload) return state
  const { player, cut, hand, discards, update } = action.payload
  switch (action.type) {
    case 'GET_HAND':
      return {
        ...state,
        [player]: {
          ...state[player],
          hand
        }
      }
    case 'GET_CRIB_CARDS':
      return {
        ...state,
        [player]: {
          ...state[player],
          discards
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
