const initialState = null
export default (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT_ROUND':
      return action.payload
    default:
      return state
  }
}
