import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Counter from './counter'

const App = () => (
  <Provider store={store}>
    <div>
      <h1>Cribbage Patch</h1>
      <Counter />
    </div>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)