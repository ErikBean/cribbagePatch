import { createStore } from 'redux'
import deck from './reducers/deck'
const store = createStore(deck)
export default store

window.store = store

let localDeck = {}

const gun = Gun([
  'https://gun-starter-app-ujjhononwf.now.sh/gun',
]);

// Reads key 'game'.
let game = gun.get('game');

// Exposed so the JS console can see it.
window.game = game;


store.subscribe(() => {
  console.log('subscribe! ', store.getState().deck)
  // Writes a value to the key 'game'.
  game.put({ deck: JSON.stringify(store.getState().deck) });
})

console.log('game is currently: ', game.val())
// Listen for real-time change events.
game.path('deck').on(function (deck) {
  console.log('deck on DB:', JSON.parse(deck));
});