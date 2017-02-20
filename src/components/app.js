import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store'
import Game from './game'

const App = () => (
  <Provider store={store}>
    <div>
      <button style={{width: '100%'}} onClick={reload}>Restart the Game</button>
      <h1>Cribbage Patch</h1>
      <Game />
    </div>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

function reload () {
  window.restart() // wipe gunDB
  // setTimeout(() => window.location.reload(), 200)
}
