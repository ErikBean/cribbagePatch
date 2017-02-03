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
    console.log('>>> constuctor! ', props.cards)
    const fifteens = getFifteens(props.cards)
    const pairs = getPairs(props.cards)
    
    this.state = {
      pairs,
      fifteens,
      numPairs: sumValues(pairs),
      numFifteens: sumLengths(fifteens),
      runs: getRuns(props.cards).length
    }
  }
  componentWillReceiveProps(newProps){
    console.log('>>> ScoreBoard GETTING PROPS: ', newProps)
    const { cards } = newProps
    const fifteens = getFifteens(cards)
    const pairs = getPairs(cards)
    
    this.setState({
      pairs,
      fifteens,
      numPairs: sumValues(pairs),
      numFifteens: sumLengths(fifteens),
      runs: getRuns(cards).length
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
            runs: {this.state.runs}
          </li>
        </ul>
      </div>
    )
  }
}

// export default ScoreBoard