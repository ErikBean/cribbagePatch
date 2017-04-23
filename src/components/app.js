import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store'
import Game from './game'
const App = () => (
  <Provider store={store}>
    <div>
      <button style={{width: '100%'}} onClick={window.restart}>Restart the Game</button>
      <h1>Cribbage Patch</h1>
      <Game />
    </div>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    ReactDOM.render(App)
  })
}
// for enzyme tests: 
export default App 