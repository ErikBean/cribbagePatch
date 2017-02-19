import React, { Component } from 'react'
import { without, includes } from 'lodash'
import Card from './card'

export default class Set extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: [null, null], // Should always be length 2
      hasActionsAvailable: (props.discard || props.playCard),
      hasDiscarded: props.cards.length <= 4
    }

    this.toggleSelect = this.toggleSelect.bind(this)
    this.discard = this.discard.bind(this)
  }

  componentWillReceiveProps (props) {
    this.setState({
      ...this.state,
      hasActionsAvailable: (props.discard || props.playCard),
      hasDiscarded: props.cards.length <= 4
    })
  }

  toggleSelect (card) {
    if (this.state.hasDiscarded) return
    const nextSelected = includes(this.state.selected, card)
      ? [ null, ...without(this.state.selected, card) ]
      : [ card, this.state.selected[0] ]
    this.setState({
      selected: nextSelected
    })
  }
  discard () {
    const { selected } = this.state
    if (!selected[0] || !selected[1]) {
      window.alert('Plz selct TWO cards for cribber')
      return
    }
    this.props.discard(selected)
  }
  handleClick (card) {
    if (!this.state.hasActionsAvailable) return
    else if (this.state.hasDiscarded) {
      this.props.playCard(card)
    } else {
      this.toggleSelect(card)
    }
  }
  render () {
    const outerBorder = {
      border: this.state.hasDiscarded ? '1px solid black' : 'none'
    }
    const colorHand = {
      backgroundColor: this.state.hasActionsAvailable ? 'blue' : 'red'
    }
    return (
      <div style={outerBorder}>
        <div id='cardset' style={colorHand}>
          <br />
          {this.props.cards.map((card) => (
            <Card
              clickHandler={() => this.handleClick(card)}
              isSelected={includes(this.state.selected, card)}
              // highlightOnHover={state.hasDiscarded}
              card={card}
              key={card} />
          ))}
        </div>
        <br />
        <button onClick={this.discard} hidden={this.state.hasDiscarded}>
          Place in crib
        </button>
      </div>
    )
  }
}
