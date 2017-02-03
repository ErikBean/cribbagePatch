const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CUT_INDEX':
      return action.payload
    default:
      return state
  }
}
