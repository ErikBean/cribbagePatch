import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'
import Card from './card'

export default class Hand extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: [null, null], // Should always be length 2
    }
    this.toggleSelect = this.toggleSelect.bind(this)
    this.discard = this.discard.bind(this)
  }
  
  toggleSelect (card) {
    if(this.props.hand.length < 6) return
    const nextSelected = includes(this.state.selected, card) ?
      [ null, ...without(this.state.selected, card) ] :
      [ card, this.state.selected[0] ]
    this.setState({
      selected: nextSelected
    })
  }
  discard () {
    const { selected } = this.state
    if(!selected[0] || !selected[1]) {
      alert('Plz selct TWO cards for cribber')
      return
    }
    this.props.discard(selected)
  }
  render () {
    return (
      <div>
        {this.props.hand.map((card) => (
          <Card
            toggleSelect={this.toggleSelect.bind(null, card)}
            isSelected={includes(this.state.selected, card)}
            card={card}
            key={card} />
        ))}
        <br />
        <button onClick={this.discard}>
          Place in crib
        </button>
      </div>
    )
  }
}
