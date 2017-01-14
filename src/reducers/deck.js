const initialState = { deck: 'uninitialized' }
export default (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_DECK':
      return {
        ...state,
        deck: action.payload
      }
    default:
      return state
  }
}
