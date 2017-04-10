import React, { Component } from 'react'
import Card from './card'
import ScoreBoard from './scoreBoard'

export default class Crib extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isHidden: true
    }
    this.reveal = this.reveal.bind(this)
  }
  reveal () {
    this.setState({
      isHidden: false
    })
  }
  render () {
    return (
      <div hidden={!this.props.cards.length}>
        <button onClick={this.reveal}>
          Show the Crib
        </button>
        <div hidden={this.state.isHidden}>
          {/* <ScoreBoard cards={this.props.cards} /> */}
          {this.props.visibleCards.map((card) => <Card key={card} card={card} />)}
        </div>
      </div>
    )
  }
}

