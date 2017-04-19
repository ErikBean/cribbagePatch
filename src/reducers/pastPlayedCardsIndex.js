const initialState = 0
export default (state = initialState, action) => {
  switch (action.type) {
    case 'MARK_CARDS_PEGGED':
      return action.payload
    default:
      return state
  }
}
