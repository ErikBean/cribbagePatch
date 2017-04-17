/* global Gun */
import { createStore, combineReducers } from 'redux'
import { isNull, isUndefined, isEqual, isArray, keys } from 'lodash'
import reducers from './reducers'

const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const rootReducer = combineReducers(reducers)
const overrideState = (state = {}, action) => { // used to test the app, in a certain state
  if(action.type === 'TEST_STATE'){
    return action.testState
  }
  return rootReducer(state, action)
}
const store = createStore(overrideState, enhancer)

export default store

const cache = {}

// does this NEED to be flat? No, but it makes things easier for now
// Indicates which redux action type is associated with a change on this path in gun
const remotePaths = { // keys = reducers - meta
  cut: 'GET_CUT',
  cutIndex: 'GET_CUT_INDEX',
  crib: 'ADD_TO_CRIB',
  deck: 'UPDATE_DECK',
  firstCut: 'FIRST_CUT',
  player1Hand: 'GET_PLAYER1_HAND',
  player2Hand: 'GET_PLAYER2_HAND',
  playedCards: 'PLAY_CARD',
  secondCut: 'SECOND_CUT',
  round: 'INCREMENT_ROUND'
}

store.subscribe(() => {
  const newState = store.getState()
  keys(remotePaths).forEach((path) => {
    push(path, newState[path])
  })
})

function push (path, data) {
  if (isUndefined(data) || isNull(data)) return
  if (isEqual(cache[path], data) || JSON.stringify(data) === cache[path]) return
  if (isArray(data)) {
    const jsonData = JSON.stringify(data)
    cache[path] = jsonData
    game.path(path).put(jsonData)
  } else {
    cache[path] = data
    game.path(path).put(data)
  }
}

function updateStore (path, data) {
  if (isNull(data) || isUndefined(data) || data === '') return
  if (isEqual(cache[path], data)) return
  cache[path] = data
  const action = createAction(path, data)
  store.dispatch(action)
}

const gun = Gun([
  'https://gun-uvmkdvqfub.now.sh',
  'https://gun-mvdlzwopkp.now.sh'
])

// Reads key 'game'.
let game = gun.get('game')

game.map((value, path) => {
  if (keys(remotePaths).indexOf(path) !== -1) {
    updateStore(path, value)
  }
})

function createAction (path, data) {
  const actionFor = (type, data) => {
    const isJson = data && (data[0] === '[')
    if (isJson) {
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
window.gun = gun

window.restart = () => {
  window.localStorage.clear()
  game.put({
    player1Hand: '[]',
    player2Hand: '[]',
    playedCards: '[]',
    deck: '[]',
    crib: '[]',
    meta: null,
    firstCut: null,
    secondCut: null,
    cut: null,
    cutIndex: null,
    round: 0
  })
  window.localStorage.clear()
  window.location.reload()
}
window.gunVal = game.val(console.log.bind(console))
window.getHand = (hand, player) => {
  store.dispatch({
    type: `GET_${player.toUpperCase()}_HAND`,
    payload: hand || ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
  })
}
window.assignPlayer = () => {
  const oldState = store.getState()
  const newState = {
    meta: {
      isPlayer1: false,
      isPlayer2: true
    },
    player1Hand: ['S3', 'S4', 'S5', 'S6'],
    player2Hand: ['H3', 'H4', 'H5', 'H6'],
    playedCards: [],
    crib: ['S1', 'S2', 'H1', 'H2'],
    cut: 'C4',
    cutIndex: 23
  }
  const desiredStoreState = Object.assign({}, oldState, newState)
  store.dispatch({type: 'TEST_STATE', testState: desiredStoreState})
}
window.startPegging = () => {
  const oldState = store.getState()
  const newState = {
    meta: {
      isPlayer1: true,
      isPlayer2: false
    },
    player1Hand: ['S3', 'S4', 'S5', 'S6'],
    player2Hand: ['H3', 'H4', 'H5', 'H6'],
    playedCards: [],
    crib: ['S1', 'S2', 'H1', 'H2'],
    cut: 'C4',
    cutIndex: 23
  }
  const desiredStoreState = Object.assign({}, oldState, newState)
  store.dispatch({type: 'TEST_STATE', testState: desiredStoreState})
}
