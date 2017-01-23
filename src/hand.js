import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'
import Card from './card'
import Line from './line'

export default class Hand extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: [null, null], // Should always be length 2
    }
    this.toggleSelect = this.toggleSelect.bind(this)
  }
  toggleSelect (card) {
    const nextSelected = includes(this.state.selected, card) ?
      [ null, ...without(this.state.selected, card) ] :
      [ card, this.state.selected[0] ]
    this.setState({
      selected: nextSelected
    })
  }

  render () {
    const fifteens = getFifteens(this.props.hand)
    const pairs = getPairs(this.props.hand)
    const runs = getRuns(this.props.hand).length
    const numFifteens = sumLengths(fifteens)
    const numPairs = sumValues(pairs)
    return (
      <div>
        <ul>
          <li>
            Fifteens: {numFifteens}
          </li>
          <li>
            pairs: {numPairs}
          </li>
          <li>
            runs: {runs}
          </li>
        </ul>
        {this.props.hand.map((card) => (
          <Card
            toggleSelect={this.toggleSelect.bind(null, card)}
            isSelected={includes(this.state.selected, card)}
            card={card}
            key={card} />
        ))}
      </div>
    )
  }
}

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