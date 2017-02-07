const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'FIRST_CUT':
      return action.payload
    default:
      return state
  }
}
