import React, { Component } from 'react'
import ReactDOM from 'react-dom'
console.log('foo')

export default class App extends Component {
  render(){
    return (
      <h1>Cribbage Patch</h1>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('app')
)