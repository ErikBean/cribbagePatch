import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'

// Sum the length of all arrays in obj
function sumLengths(obj){
  return Object.keys(obj).map((k) => {
    return obj[k].length
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

// Sum all values in obj
function sumValues(obj){
  return Object.keys(obj).map((k) => {
    return obj[k]
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

export default class ScoreBoard extends Component {
  constructor(props){
    super(props)
    this.state = {}
    this.computePoints = this.computePoints.bind(this)
  }
  componentWillReceiveProps(newProps){
    this.computePoints(newProps.cards)
  }
  computePoints(cards){
    const fifteens = getFifteens(cards)
    const pairs = getPairs(cards)
    const runs = getRuns(cards)
    this.setState({
      pairs,
      fifteens,
      runs,
      numPairs: sumValues(pairs),
      numFifteens: sumLengths(fifteens),
      numRuns: runs.length
    })
  }

  render(){
    return (
      <div>
        <ul>
          <li>
            Fifteens: {this.state.numFifteens}
          </li>
          <li>
            pairs: {this.state.numPairs}
          </li>
          <li>
            runs: {this.state.numRuns}
          </li>
        </ul>
      </div>
    )
  }
}

// export default ScoreBoard