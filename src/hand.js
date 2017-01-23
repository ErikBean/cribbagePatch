import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'
import Card from './card'
import Line from './line'

export default class Hand extends Component {
  constructor (props) {
    super(props)
    const fifteens = getFifteens(props.hand)
    const pairs = getPairs(props.hand)
    console.log('>>> stuff! ! : ', {fifteens, pairs})
    this.state = {
      selected: [null, null], // Should always be length 2
      fifteens, 
      pairs,
      runs: getRuns(props.hand).length,
      numFifteens: Object.keys(fifteens).map((k) => {
        return fifteens[k].length
      }).reduce((acc, curr) => {
        return acc + curr
      }, 0),
      numPairs: Object.keys(pairs).map((k) => {
        return pairs[k]
      }).reduce((acc, curr) => {
        return acc + curr
      }, 0)
    }
    this.toggleSelect = this.toggleSelect.bind(this)
  }
  toggleSelect (card) {
    if (includes(this.state.selected, card)) {
      this.setState({
        selected: [null, ...without(this.state.selected, card)]
      })
    } else {
      this.setState({
        selected: [card, this.state.selected[0]]
      })
    }
  }
  render () {
    const renderCard = (card) => (
      <Card
        toggleSelect={this.toggleSelect.bind(null, card)}
        isSelected={includes(this.state.selected, card)}
        card={card}
        key={card} />
    )
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
        {this.props.hand.map(renderCard)}
      </div>
    )
  }
}
