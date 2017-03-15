const initialState = []
export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DECK':
      return action.payload
    default:
      return state
  }
}
