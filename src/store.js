import { createStore, combineReducers } from 'redux'
import _, { isEmpty, isNull, isUndefined, isEqual, isObject, isArray} from 'lodash'
import { valueOf } from './deck'
import deck from './reducers/deck'
import players from './reducers/players'
import meta from './reducers/meta'
import cut from './reducers/cut'
import cutIndex from './reducers/cutIndex'

const reducer = combineReducers({
  cut,
  cutIndex,
  deck,
  meta,
  players
})
const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(reducer, enhancer)
export default store

let cache = {}

store.subscribe(() => {
  const { players, meta, deck, cut, cutIndex } = store.getState()
  const { player1, player2, crib } = players
  const { firstCut, secondCut } = meta

  push(player1.hand, 'player1Hand')
  push(player2.hand, 'player2Hand')
  push(deck, 'deck')
  push(firstCut, 'firstCut')
  push(secondCut, 'secondCut')
  push(cut, 'cut')
  push(cutIndex, 'cutIndex')
  push(crib, 'crib')
})

function push (data, path) {
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return
  if (isEqual(cache[path], data)) return
  if(isObject(data) || isArray(data)){
    cache[path] = JSON.stringify(data)
    game.path(path).put(JSON.stringify(data))
  } else{
    cache[path] = data
    game.path(path).put(data)
  }
}

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh'
])

// Reads key 'game'.
let game = gun.get('game')

game.path('deck').on((deck) => {
  console.info('>>> update deck: ', deck, cache['deck'], isEqual(deck, cache['deck']))
  const action = { type: 'UPDATE_DECK', payload: JSON.parse(deck)}
  updateStore({ deck })(action)
})

game.path('player1Hand').on((hand) => updateHand('player1', hand))
game.path('player2Hand').on((hand) => updateHand('player2', hand))

function updateHand (playerNum, hand) {
  const action = {
    type: 'GET_HAND',
    payload: {
      player: playerNum,
      hand: JSON.parse(hand)
    }
  }
  updateStore({ [playerNum]: hand })(action)
}

game.path('firstCut').on((firstCut) => {
  const action = {
    type: `BEGIN_GAME_CUT`,
    payload: { isFirst: true, cut: firstCut }
  }
  updateStore({ firstCut })(action)
})

game.path('secondCut').on((secondCut) => {
  const action = {
    type: `BEGIN_GAME_CUT`,
    payload: { isFirst: false, cut: secondCut }
  }
  updateStore({ secondCut })(action)
})
game.path('cutIndex').on((cutIndex) => {
  const action = {
    type: 'GET_CUT_INDEX',
    payload: cutIndex
  }
  updateStore({ cutIndex })(action)
})
game.path('cut').on((cut) => {
  const action = {
    type: 'GET_CUT',
    payload: cut
  }
  updateStore({ cut })(action)
})

game.path('crib').on((crib) => {
  const action = {
    type: 'GET_OPPONENT_DISCARDS',
    payload: { discards: JSON.parse(crib) }
  }
  updateStore({ crib })(action)
})

function updateStore (container) {
  const path = Object.keys(container)[0]
  let data = container[path]
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return () => {}
  if (isEqual(cache[path], data)) return () => {}
  cache[path] = data
  return store.dispatch
}

// Debug helpers
window.store = store
window.game = game
window.cache = cache
window._ = _

window.restart = () => game.put({
  player1Hand: null,
  player2Hand: null,
  deck: null,
  meta: null,
  firstCut: null,
  secondCut: null,
  cut: null,
  crib: null,
  cutIndex: null
})

window.getHand = (hand, player) => {
  store.dispatch({
    type: 'GET_HAND',
    payload: {
      player: player || 'player1',
      hand: hand || ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
    }
  })
}
