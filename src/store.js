import { createStore, combineReducers } from 'redux'
import _, { isEmpty, isNull, isUndefined, isEqual, isObject, isArray, keys } from 'lodash'
import reducers from './reducers'

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(combineReducers(reducers), enhancer)

export default store

const cache = {}

// does this NEED to be flat? No, but it makes things easier for now
// What redux action type is associated with a change on this path in gun? 
const remotePaths = { //keys = reducers - meta
  cut: 'GET_CUT',
  cutIndex: 'GET_CUT_INDEX',
  crib: 'ADD_TO_CRIB',
  deck: 'UPDATE_DECK',
  firstCut: 'FIRST_CUT',
  player1Hand: 'GET_PLAYER1_HAND',
  player2Hand: 'GET_PLAYER2_HAND',
  player1Played: 'PLAYER1_PLAY_CARD',
  player2Played: 'PLAYER2_PLAY_CARD',
  secondCut: 'SECOND_CUT',
}

store.subscribe(() => {
  const newState = store.getState()
  keys(remotePaths).forEach((path) => {
    push({
      [path]: newState[path]
    })
  })
})

function push (container, path = Object.keys(container)[0], data = container[path]) {
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return
  // if (path contains player 2 and I'm player2....) return
  
  if (isEqual(cache[path], data) || JSON.stringify(data) === cache[path]) return
  if(path === 'player1Hand') {
    console.log('>>> p1H: ', data, cache[path])
    debugger;
  }
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

game.map((value, path) => {
  if(keys(remotePaths).indexOf(path) !== -1){
    updateStore({ [ path ]: value })
  } else{
    // console.warn(`nothing in store for ${path}`)
  }
})

function updateStore (container, path = Object.keys(container)[0], data = container[path]) {
  if (isNull(data) || isUndefined(data) || isEmpty(data)) return
  if (isEqual(cache[path], data)) return
  cache[path] = data
  const action = createAction(path, data)
  store.dispatch(action)
}

function createAction (path, data) {
  const actionFor = (type, data) => {
    const isJson = data && (data[0] === '{' || data[0] === '[')
    if(isJson){
      return { type, payload: JSON.parse(data) }
    }
    return { type, payload: data }
  }
  return actionFor(remotePaths[path], data)
}

// Debug helpers
window.store = store
window.game = game
window.cache = cache
window._ = _
window.gun = gun

window.restart = () =>{
  window.localStorage.clear()
  game.put({
    player1Hand: null,
    player2Hand: null,
    player1Played: null,
    player2Played: null,
    deck: null,
    meta: null,
    firstCut: null,
    secondCut: null,
    cut: null,
    crib: null,
    cutIndex: null
  })
  window.location.reload(true)
}

window.getHand = (hand, player) => {
  store.dispatch({
    type: `GET_${player.toUpperCase()}_HAND`,
    payload: hand || ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
  })
}
