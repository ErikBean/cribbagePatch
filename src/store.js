import { createStore, combineReducers } from 'redux'
import deck from './reducers/deck'
import player1 from './reducers/player1'
import player2 from './reducers/player2'
import meta from './reducers/meta'
const store = createStore(combineReducers({
  deck,
  player1,
  player2,
  meta
}))
export default store

window.store = store

const gun = Gun([
  'https://gun-starter-app-ujjhononwf.now.sh/gun',
]);

// Reads key 'game'.
let game = gun.get('game');

// Exposed so the JS console can see it.
window.game = game;

let cachedDeck = {}
let cachedPlayer = {}

function pushDeck (deck) {
  if(deck !== null && deck !== cachedDeck){
    cachedDeck = deck
    console.log('>>> Push this deck to DB: ', deck)
    game.put({ deck })
  }
}

function pushPlayer (currentPlayer, id) {
  if(currentPlayer && currentPlayer !== cachedPlayer[id]){
    cachedPlayer[id] = currentPlayer
    console.log(`>>> Push this ${id} to DB: `, currentPlayer)
    game.put({
      [id]: currentPlayer
    })
  }
}

store.subscribe(() => {
  let newState = store.getState()
  const { isPlayer1, isPlayer2 } = newState.meta
  
  pushDeck(store.getState().deck)

  if(isPlayer1){
    pushPlayer(store.getState().player1, 'player1')
  } else if(isPlayer2){
    pushPlayer(store.getState().player2, 'player2')
  }
})

game.path('deck').on((remoteDeck) => {
  console.warn('>>> new remoteDeck: ', remoteDeck)
  if(remoteDeck){
    delete remoteDeck._
  }
  if(store.getState().deck === null){
    store.dispatch({type: 'UPDATE_DECK', payload: remoteDeck})
  }
})

// console.log('game is currently: ', game.val())
// Listen for real-time change events.
game.path('player1.beginGameCut').on(function (bgc1) {
  console.log('>>> Got BGC1 fom DB: : ', bgc1)
  const { isPlayer1, isPlayer2 } = store.getState().meta
  const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
  if(isNotAssignedPlayer){
    console.log('>>> Ok I am player2! ')
    store.dispatch({type: `ASSIGN_PLAYER2`})
  }
  if(!isPlayer1){
    store.dispatch({type: `BEGIN_GAME_CUT_1`, payload: bgc1})
  }
});

game.path('player2.beginGameCut').on(function (bgc2) {
  console.log('>>> Got BGC2 fom DB: : ', bgc2)
  const { isPlayer1, isPlayer2 } = store.getState().meta
  const isNotAssignedPlayer = ( !isPlayer1 && !isPlayer2 )
  if(isNotAssignedPlayer){
    console.log('>>> Ok I am player1! ')
    store.dispatch({type: `ASSIGN_PLAYER1`})
  }
  if(!isPlayer2){
    store.dispatch({type: `BEGIN_GAME_CUT_2`, payload: bgc2})
  }
  store.dispatch({type: `START_GAME`})
});



window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
  localPlayer: null,
  player: null
})