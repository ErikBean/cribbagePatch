import { createStore, combineReducers } from 'redux'
import _, { isEmpty, isNull, isUndefined, isEqual, isObject, isArray} from 'lodash'
import reducers from './reducers'

const paths = Object.keys(reducers) // loop through this for push/updateStore

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(combineReducers(reducers), enhancer)

export default store

const cache = {}

const topics = [ // does this NEED to be flat? No, but it makes things easier for now
  'cut',
  'cutIndex',
  'crib',
  'deck',
  'firstCut',
  'player1Hand',
  'player2Hand',
  'player1Played',
  'player2Played',
  'secondCut',
]

store.subscribe(() => { // TODO: can use paths instead of getState()
  const { players, meta, deck, cut, cutIndex, player1Hand, player2Hand, crib } = store.getState()
  const { firstCut, secondCut } = meta 
  
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
  const actionFor = (type, payload) => ({ type, payload}) // This could also parse JSON, for more abstraction
  const factories = { // keys are paths in gun
    deck: (deck) => actionFor('UPDATE_DECK', JSON.parse(deck)),
    player1Hand: (hand) => actionFor('GET_PLAYER1_HAND', JSON.parse(hand)),
    player2Hand: (hand) => actionFor('GET_PLAYER2_HAND', JSON.parse(hand)),
    firstCut: (cut) => actionFor('FIRST_CUT', cut),
    secondCut: (cut) => actionFor('SECOND_CUT', cut),
    cut: (cut) => actionFor('GET_CUT', cut),
    cutIndex: (cutIndex) => actionFor('GET_CUT_INDEX', cutIndex),
    crib: (crib) => actionFor('ADD_TO_CRIB', JSON.parse(crib))
  }
  return factories[path](data)
}

// Debug helpers
window.store = store
window.game = game
window.cache = cache
window._ = _

window.restart = () =>{
  window.localStorage.clear()
  game.put({
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
}

window.getHand = (hand, player) => {
  store.dispatch({
    type: `GET_${player.toUpperCase()}_HAND`,
    payload: hand || ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
  })
}
