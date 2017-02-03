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
  const player1Hand = player1.hand
  const player2Hand = player2.hand
  push({ player1Hand })
  push({ player2Hand })
  push({ deck })
  push({ firstCut })
  push({ secondCut })
  push({ cut })
  push({ cutIndex })
  push({ crib })
})

function push (container, path = Object.keys(container)[0], data = container[path]) {
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return
  if (isEqual(cache[path], data)) return
  if (isObject(data) || isArray(data)) {
    const jsonData = JSON.stringify(data)
    cache[path] = jsonData
    game.path(path).put(jsonData)
  } else {
    cache[path] = data
    game.path(path).put(data)
  }
}

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh'
])

// Reads key 'game'.
let game = gun.get('game')

// TODO: Generalize this with an array of path strings
// Or just gun.map() over all paths in game :) 
game.path('deck').on((deck) => updateStore({ deck }))

game.path('player1Hand').on((player1Hand) => updateStore({ player1Hand }))
game.path('player2Hand').on((player2Hand) => updateStore({ player2Hand }))

game.path('firstCut').on((firstCut) => updateStore({ firstCut }))
game.path('secondCut').on((secondCut) => updateStore({ secondCut }))

game.path('cutIndex').on((cutIndex) => updateStore({ cutIndex }))
game.path('cut').on((cut) => updateStore({ cut }))
game.path('crib').on((crib) => updateStore({ crib }))


function updateStore (container, path = Object.keys(container)[0], data = container[path]) {
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return
  if (isEqual(cache[path], data)) return
  cache[path] = data
  const action = createAction(path, data)
  store.dispatch(action)
}

function createAction (path, data) {
  const actionFor = (type, payload) => ({ type, payload}) // This could also parse JSON
  const factories = { // keys are paths in gun
    deck: (deck) => actionFor('UPDATE_DECK', JSON.parse(deck)),
    player1Hand: (hand) => actionFor('GET_HAND', {
      player: 'player1',
      hand: JSON.parse(hand)
    }),
    player2Hand: (hand) => actionFor('GET_HAND', {
      player: 'player2',
      hand:  JSON.parse(hand)
    }),
    firstCut: (cut) => actionFor('BEGIN_GAME_CUT', { isFirst: true, cut }),
    secondCut: (cut) => actionFor('BEGIN_GAME_CUT', { isFirst: false, cut }),
    cut: (cut) => actionFor('GET_CUT', cut),
    cutIndex: (cutIndex) => actionFor('GET_CUT_INDEX', cutIndex),
    crib: (crib) => actionFor('GET_OPPONENT_DISCARDS', { discards: JSON.parse(crib) })
  }
  return factories[path](data)
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
