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
    const holesForPlayer = (num, color) => (
      <div>
        {R.times(Hole(this.props, num, color), POINTS_TO_WIN)}
      </div>
    )
    return (
      <div id="board">
        {this.props.invert ? holesForPlayer(1, 'red') : holesForPlayer(2, 'blue')}
        <br />
        {this.props.invert ? holesForPlayer(2, 'blue') : holesForPlayer(1, 'red')}
      </div>
    )
  }
}


const Hole = (props, num, color) => (index) => {
  const hasPeg = ((index + 1) === props[`player${num}Points`])

  const getIcon = () => {    
    if(hasPeg){
      return '!'
    } else if((index + 1)%5 === 0){
      return index + 1
    } else if(index%ROW_LENGTH == 0){
      return <br />
    } else {
      return '.'
    }
  }
  const pegStyle = {
    color:  color,
    fontWeight: 'bold'
  }
  return (
    <span key={index} style={hasPeg ? pegStyle : null}>{getIcon()}</span>
  )
}