import { createStore, combineReducers } from 'redux'
import { isEqual, clone, size, omit, once } from 'lodash'
import deck from './reducers/deck'
import players from './reducers/players'
import meta from './reducers/meta'
const store = createStore(combineReducers({
  deck,
  players,
  meta
}))
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
let cachedPlayers = {}

function pushDeck (deck) {
  if(!isEqual(deck, cachedDeck)){
    cachedDeck = clone(deck)
    game.put({ deck })
  }
}

function pushPlayer (currentPlayer, id) {
  if(!isEqual(currentPlayer, cachedPlayers[id])){
    cachedPlayers[id] = clone(currentPlayer)
    game.put({
      [id]: currentPlayer
    })
  }
}


let listenForOtherPlayer = once(function(player){
  game.path(player).on((np) => {
    console.log(`update from ${player}: `, np)
    const { isPlayer1, isPlayer2 } = store.getState().meta
    const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
    if(isNotAssignedPlayer){
      player === 'player1' ? store.dispatch({type: `ASSIGN_PLAYER2`}) : store.dispatch({type: `ASSIGN_PLAYER1`})
    }
  })
})

store.subscribe(() => {
  let newState = store.getState()
  const { isPlayer1, isPlayer2 } = newState.meta
  const { player1, player2 } = store.getState()
  pushDeck(newState.deck)
  if(isPlayer1){
    listenForOtherPlayer('player2')
    pushPlayer(player1, 'player1')
  } else if(isPlayer2){
    listenForOtherPlayer('player1')
    pushPlayer(player2, 'player2')
  }
})

game.path('deck').on((remoteDeck) => {
  console.warn('>>> new remoteDeck: ', remoteDeck)
  store.dispatch({type: 'UPDATE_DECK', payload: omit(remoteDeck, '_')})
})

// console.log('game is currently: ', game.val())
// // Listen for real-time change events.
// game.path('player1.beginGameCut').on(function (bgc1) {
//   const { isPlayer1, isPlayer2 } = store.getState().meta
//   const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
//   if(isNotAssignedPlayer){
//     store.dispatch({type: `ASSIGN_PLAYER2`})
//   }
//   if(!isPlayer1){
//     store.dispatch({type: `BEGIN_GAME_CUT_1`, payload: bgc1})
//   }
// });
// 
// game.path('player2.beginGameCut').on(function (bgc2) {
//   const { isPlayer1, isPlayer2 } = store.getState().meta
//   const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
//   if(isNotAssignedPlayer){
//     store.dispatch({type: `ASSIGN_PLAYER1`})
//   }
//   if(!isPlayer2){
//     store.dispatch({type: `BEGIN_GAME_CUT_2`, payload: bgc2})
//   }
//   store.dispatch({type: `START_GAME`})
// });


window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
  localPlayer: null,
  player: null
})