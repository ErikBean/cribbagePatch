import { createStore, combineReducers } from 'redux'
import _, { isEqual, clone, omit, get, set } from 'lodash'
import { valueOf } from './deck'
import deck from './reducers/deck'
import players from './reducers/players'
import meta from './reducers/meta'
import cut from './reducers/cut'

const reducer = combineReducers({
  meta,
  deck,
  players,
  cut
})
const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(reducer, enhancer)
export default store

let cache = {}

store.subscribe(() => {
  const { players: { player1, player2 }, meta, deck } = store.getState()
  push(JSON.stringify(player1), 'player1')
  push(JSON.stringify(player2), 'player2')
  if(meta.firstCut){
    push(meta.firstCut, 'firstCut')
  } 
  if (meta.secondCut){
    push(meta.secondCut, 'secondCut')
  }
  if(deck){
    push(JSON.stringify(deck), 'deck')
  }
})

function push (data, path) {
  if(cache[path] === data) return
  cache[path] = data
  game.path(path).put(data)
}


// function pushDeck (data) {
//   const deck = JSON.stringify(data)
//   if(deck === cache.deck) return
//   cache.deck = deck
//   game.path('deck').put(deck)
// }
// 
// function pushPlayer (data, playerNum) {
//   const currentPlayer = JSON.stringify(data)
//   if(currentPlayer === '{}' || currentPlayer === cache[playerNum]) return
//   cache[playerNum] = currentPlayer
//   console.log('>>> push player: ', currentPlayer, playerNum)
//   game.path(playerNum).put(currentPlayer)
// }

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh',
]);

// Reads key 'game'.
let game = gun.get('game');

game.path('deck').on((remoteDeck) => updateDeck(remoteDeck))

game.path('player1').on((data) => updatePlayer('player1', data))
game.path('player2').on((data) => updatePlayer('player2', data))

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

function updateDeck (remoteDeck) {
  if(!remoteDeck || remoteDeck === cache.deck) return
  cache.deck = remoteDeck
  console.info('>>> update deck: ', remoteDeck)
  store.dispatch({type: 'UPDATE_DECK', payload: JSON.parse(remoteDeck)})
}


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

function assignPlayer (player) {
  const { isPlayer1, isPlayer2 } = store.getState().meta
  const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
  if(isNotAssignedPlayer){
    store.dispatch({type: `ASSIGN_PLAYER`, payload: player})
  }
}

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
  secondCut: null
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