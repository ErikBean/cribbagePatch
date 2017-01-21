import React, { Component } from 'react'
import { without, includes } from 'lodash'
import Card from './card'

export default class Hand extends Component {
  constructor(props){
    super(props)
    this.state = {
      cards: props.cards,
      selected: [null, null]
    }
    this.toggleSelect = this.toggleSelect.bind(this)
  }
  toggleSelect(card) {
    if(includes(this.state.selected, card)){
      this.setState({
        selected: [null].concat(without(this.state.selected, card))
      })
    } else {
      this.setState({
        selected: [card, this.state.selected[0]]
      })
    }
  }
  render() {
    return (
      <div>
        {this.props.hand.map((card) => (
          <Card 
            toggleSelect={this.toggleSelect.bind(null,card)}
            isSelected={includes(this.state.selected, card)}
            card={card}
            key={card} />
        ))}
      </div>
    )
  }
}