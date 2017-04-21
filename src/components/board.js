import React, { Component } from 'react'
import R from 'ramda'
const POINTS_TO_WIN = 120;
const ROWS = 2
const ROW_LENGTH = POINTS_TO_WIN / ROWS

export default class Board extends Component {
  constructor(props){
    super(props)
    this.state = {
      P1:{
        secondPeg: 0
      },
      P2: {
        secondPeg: 0
      }
    }
  }
  render(){
    const holesForPlayer = (num) => (
      <div>
        {R.times(Hole(this.props, num), ROW_LENGTH)}
      </div>
    )
    return (
      <div id="board">
        {this.props.invert ? holesForPlayer(1) : holesForPlayer(2)}
        {this.props.invert ? holesForPlayer(2) : holesForPlayer(1)}
      </div>
    )
  }
}


const Hole = (props, num) => (index) => {
  return (
    <span key={index}>{index === props[`player${num}Points`] ? '!' : '.'}</span>
  )
}