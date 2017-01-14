import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Game from './game'

const App = () => (
  <Provider store={store}>
    <div>
      <h1>Cribbage Patch</h1>
      <Game />
    </div>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)