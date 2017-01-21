import { createStore, combineReducers } from 'redux'
import { isEqual, clone, size, omit, once } from 'lodash'
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

window.store = store

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh',
]);

// Reads key 'game'.
let game = gun.get('game');

// Exposed so the JS console can see it.
window.game = game;

let cachedDeck = null
let cache = {}

function pushDeck (deck) {
  if(!isEqual(deck, cachedDeck)){
    cache.deck = clone(deck)
    game.put({ deck })
  }
}

function pushPlayer (currentPlayer, playerNum) {
  if(!isEqual(currentPlayer, cache[playerNum])){
    console.log('>>> push player: ', currentPlayer, playerNum)
    cache[playerNum] = clone(currentPlayer)
    game.path(playerNum).put(currentPlayer)
  }
}

store.subscribe(() => {
  let newState = store.getState()
  const { isPlayer1, isPlayer2 } = newState.meta
  const { players: { player1, player2 } } = store.getState()
  pushDeck(newState.deck)
  if(isPlayer1){
    pushPlayer(player1, 'player1')
  } else if(isPlayer2){
    pushPlayer(player2, 'player2')
  }
})

game.path('deck').on((remoteDeck) => {
  console.warn('>>> new remoteDeck: ', remoteDeck)
  const newDeck = omit(remoteDeck, '_')
  if(!isEqual(newDeck, cache.deck)){
    store.dispatch({type: 'UPDATE_DECK', payload: newDeck})
  }
})

game.path('player1').on((p1) => {
  if(!p1) return
  const { isPlayer1, isPlayer2 } = store.getState().meta
  const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
  if(isNotAssignedPlayer && p1.beginGameCut){
    store.dispatch({type: `ASSIGN_PLAYER`, payload: 'player2'})
  }
  if(!isPlayer1){
    store.dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        player: 'player1',
        update: omit(p1, '_')
      }
    })
  }
})

game.path('player2').on((p2) => {
  if(!p2) return
  const { isPlayer2 } = store.getState().meta
  if(!isPlayer2){
    store.dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        player: 'player2',
        update: omit(p2, '_')
      }
    })
  }
})

window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
  localPlayer: null,
  player: null
})