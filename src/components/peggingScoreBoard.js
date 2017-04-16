import React, { Component } from 'react'
import { calcPegPoints } from '../points'



export default class PeggingScoreBoard extends Component {
  constructor (props) {
    super(props)
    this.state = calcPegPoints(props.playedCards)
  }
  componentWillReceiveProps (newProps) {
    this.setState(calcPegPoints(newProps.playedCards))
  }
  
  render () {
    return (
      <div>
        Pegging ponts for last card played: 
        <ul>
          <li>
            Fifteens: {this.state.fifteenPoints}
          </li>
          <li>
            pairs: {this.state.pairsPoints}
          </li>
          <li>
            runs: {this.state.runsPoints}
          </li>
        </ul>
      </div>
    )
  }
}
