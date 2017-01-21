import { createStore, combineReducers } from 'redux'
import { isEqual, clone, omit, get, set } from 'lodash'
import deck from './reducers/deck'
import players from './reducers/players'
import meta from './reducers/meta'
const reducer = combineReducers({
  meta,
  deck,
  players
})
const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(reducer, enhancer)
export default store

let cache = {}

store.subscribe(() => {
  let newState = store.getState()
  const { players: { player1, player2 } } = store.getState()
  pushDeck(newState.deck)
  pushPlayer(player1, 'player1')
  pushPlayer(player2, 'player2')
})

function pushDeck (data) {
  const deck = JSON.stringify(data)
  if(deck === cache.deck) return
  cache.deck = deck
  game.path('deck').put(deck)
}

function pushPlayer (data, playerNum) {
  const currentPlayer = JSON.stringify(data)
  if(currentPlayer === cache[playerNum]) return
  console.log('>>> push player: ', currentPlayer, playerNum)
  cache[playerNum] = currentPlayer
  game.path(playerNum).put(currentPlayer)
}

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh',
]);

// Reads key 'game'.
let game = gun.get('game');

game.path('deck').on((remoteDeck) => updateDeck(remoteDeck))

game.path('player1').on((data) => updatePlayer('player1', data))
game.path('player2').on((data) => updatePlayer('player2', data))

function updateDeck (remoteDeck) {
  if(!remoteDeck || remoteDeck === cache.deck) return
  cache.deck = remoteDeck
  console.info('>>> update deck: ', remoteDeck)
  store.dispatch({type: 'UPDATE_DECK', payload: JSON.parse(remoteDeck)})
}


function updatePlayer (playerNum, remotePlayer) {
  console.log('>>> Here: ', remotePlayer)
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
  if(JSON.parse(remotePlayer).beginGameCut){
    playerNum === 'player1' ? assignPlayer('player2') : assignPlayer('player1')
  }
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

window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
})