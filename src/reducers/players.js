import { difference, uniq } from 'lodash'

const initialState = {
  player1: {},
  player2: {},
  crib: [],
  playedCards: []
}
export default (state = initialState, action) => {
  if(!action.payload) return state
  const { player, cut, hand, pegCard, discards, update } = action.payload
  switch (action.type) {
    case 'GET_HAND':
      return {
        ...state,
        [player]: {
          ...state[player],
          hand
        }
      }
    case 'GET_OPPONENT_DISCARDS':
      return {
        ...state,
        crib: uniq(state.crib.concat(discards))
      }
    case 'DISCARD':
      return {
        ...state,
        crib: state.crib.concat(discards),
        [player]: {
          ...state[player],
          hand: difference(state[player].hand, discards)
        }
      }
    case 'PLAY_PEG_CARD':
      return {
        ...state,
        playedCards: state.playedCards.concat(pegCard)
      }
    default:
      return state
  }
}
