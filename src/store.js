import { createStore, combineReducers } from 'redux'
import _, { isEmpty, isNull, isUndefined, isEqual, clone, omit, get, set } from 'lodash'
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
  const { players: { player1, player2 }, meta, deck, cut, cutIndex } = store.getState()
  push(JSON.stringify(player1), 'player1')
  push(JSON.stringify(player2), 'player2')
  push(JSON.stringify(deck), 'deck')
  push(meta.firstCut, 'firstCut')
  push(meta.secondCut, 'secondCut')
  push(cut, 'cut')
  push(cutIndex, 'cutIndex')
})

function push (data, path) {
  if(isNull(data) || isUndefined(data) || isEmpty(data)) return
  if(cache[path] === data) return
  cache[path] = data
  game.path(path).put(data)
}


const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh',
]);

// Reads key 'game'.
let game = gun.get('game');

game.path('deck').on(function updateDeck (remoteDeck) {
  if(!remoteDeck || remoteDeck === cache.deck) return
  cache.deck = remoteDeck
  console.info('>>> update deck: ', remoteDeck)
  store.dispatch({type: 'UPDATE_DECK', payload: JSON.parse(remoteDeck)})
})

game.path('player1').on((data) => updatePlayer('player1', data))
game.path('player2').on((data) => updatePlayer('player2', data))
function updatePlayer (playerNum, remotePlayer) {
  if(!remotePlayer || remotePlayer === '{}') return
  if(remotePlayer === cache[playerNum]) return
  cache[playerNum] = remotePlayer
  console.log('>>> update player: ', remotePlayer)
  store.dispatch({
    type: 'UPDATE_PLAYER',
    payload: {
      player: playerNum,
      update: JSON.parse(remotePlayer)
    }
  })
}

game.path('firstCut').on((data) => {
  if(cache.firstCut === data) return
  cache.firstCut = data
  store.dispatch({
    type: `BEGIN_GAME_CUT`,
    payload: { isFirst: true, cut: data }
  })
})

game.path('secondCut').on((data) => {
  if(cache.secondCut === data) return
  cache.secondCut = data
  store.dispatch({
    type: `BEGIN_GAME_CUT`,
    payload: { isFirst: false, cut: data }
  })
})
game.path('cutIndex').on(function updateCutIndex(cutIndex){
  if(!cutIndex || cache.cutIndex === cutIndex) return
  cache.cutIndex === cutIndex
  store.dispatch({
    type: 'GET_CUT_INDEX',
    payload: cutIndex
  })
})
game.path('cut').on(function updateCutIndex(cut){
  if(!cut || cache.cut === cut) return
  cache.cut === cut
  store.dispatch({
    type: 'GET_CUT',
    payload: cut
  })
})
// Debug helpers
window.store = store
window.game = game
window.cache = cache
window._ = _

window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
  firstCut: null,
  secondCut: null,
  cut: null,
  cutIndex: null
})

window.getHand = (hand, player) => {
  store.dispatch({
    type: 'GET_HAND',
    payload: {
      player: player || 'player1',
      hand: hand || ['S1','S2','S3','S4','S5','S6']
    }
  })
}