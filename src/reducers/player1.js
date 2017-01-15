const initialState = {}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'BEGIN_GAME_CUT_1':
      return {
        ...state,
        beginGameCut: action.payload
      }
    default:
      return state
  }
}
