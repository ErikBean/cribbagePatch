const initialState = {}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'BEGIN_GAME_CUT_2':
      return {
        ...state,
        beginGameCut: action.payload
      }
    default:
      return state
  }
}
