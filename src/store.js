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

window.store = store

const gun = Gun([
  'https://gun-starter-app-lzlbcefjql.now.sh',
]);

// Reads key 'game'.
let game = gun.get('game');

// Exposed so the JS console can see it.
window.game = game;

let cache = {}
window.cache = cache
function pushDeck (deck) {
  if(!isEqual(deck, get(cache, 'deck'))){
    cache.deck = deck
    game.put({ deck })
  }
}

function pushPlayer (currentPlayer, playerNum) {
  if(isEqual(currentPlayer, get(cache, playerNum)) return
  console.log('>>> push player: ', currentPlayer, playerNum)
  set(cache, playerNum, currentPlayer)
  game.path(playerNum).put(currentPlayer)
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
  const newDeck = omit(remoteDeck, '_')
  if(!isEqual(newDeck, cache.deck)){
    console.info('>>> new remoteDeck: ', remoteDeck)
    store.dispatch({type: 'UPDATE_DECK', payload: newDeck})
    cache.deck = newDeck
  }
})

function assignPlayer (player) {
  const { isPlayer1, isPlayer2 } = store.getState().meta
  const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
  if(isNotAssignedPlayer){
    store.dispatch({type: `ASSIGN_PLAYER`, payload: player})
  }
}

game.path('player1.beginGameCut').on((cut) => {
  if(cut === get(cache, 'player1.beginGameCut')) return
  set(cache, 'player1.beginGameCut', cut)
  assignPlayer('player2')
  store.dispatch({
    type: `BEGIN_GAME_CUT`,
    payload: {
      player: 'player1',
      cut: cut
    }
  })
})

game.path('player2.beginGameCut').on((cut) => {
  if(cut === get(cache, 'player2.beginGameCut')) return
  set(cache, 'player2.beginGameCut', cut)
  assignPlayer('player1')
  store.dispatch({
    type: `BEGIN_GAME_CUT`,
    payload: {
      player: 'player2',
      cut: cut
    }
  })
})


window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
  localPlayer: null,
  player: null
})