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
let cachedState = {}

function updateDeck () {
  let newState = store.getState()
  if(newState.deck !== cachedState.deck && newState.deck !== 'uninitialized'){
    cachedState.deck = newState.deck
    console.log('>>> Here: ', newState.deck)
    game.put({
      'deck': JSON.stringify(newState.deck)
    })
  }
}

store.subscribe(() => {
  updateDeck()
  let newState = store.getState()
  const hasNotAssignedPlayers = !newState.meta.isPlayer1 && !newState.meta.isPlayer2
  if(hasNotAssignedPlayers){
    console.log('has not assigned players: ')
    return;
  }
  const playerNum = newState.meta.isPlayer1 ? 'player1' : 'player2'
  // Writes a value to the key 'game'.
  if(newState[playerNum] !== cachedState[playerNum]){
    cachedState[playerNum] = newState[playerNum]
    game.put({
      [playerNum]: JSON.stringify(newState[playerNum])
    })
  }

})

game.on((data) => {
  if(store.getState().deck === 'uninitialized' && data.deck){
    store.dispatch({type: 'UPDATE_DECK', payload: JSON.parse(data.deck)})
  }
})

// console.log('game is currently: ', game.val())
// Listen for real-time change events.
game.path('player1').on(function (p) {
  console.log('player1!!! ', p)
  const player = JSON.parse(p)
  if(player && player.beginGameCut && !store.getState().meta.isPlayer1){
    // if there is a cut from player1 on the DB, they have started the game and we are player 2: 
    store.dispatch({type: `BEGIN_GAME_CUT_1`, payload: player.beginGameCut})
    store.dispatch({type: `ASSIGN_PLAYER2`})
  }
});

game.path('player2').on(function (p) {
  console.log('player2!!! ', p)
  const player = JSON.parse(p)
  if(player && player.beginGameCut && !store.getState().meta.isPlayer2){
    // if there is a cut from player1 on the DB, they have started the game and we are player 2: 
    store.dispatch({type: `BEGIN_GAME_CUT_2`, payload: player.beginGameCut})
    store.dispatch({type: `ASSIGN_PLAYER2`})
  }
});



window.restart = () => game.put({
  player1: null,
  player2: null,
  deck: null,
  meta: null,
})