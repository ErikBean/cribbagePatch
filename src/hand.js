import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens } from './points'
import Card from './card'
import Line from './line'

export default class Hand extends Component {
  constructor(props){
    super(props)
    this.state = {
      cards: props.cards,
      selected: [null, null] // Should always be length 2
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
    const renderCard = (card) => (
      <Card
        toggleSelect={this.toggleSelect.bind(null,card)}
        isSelected={includes(this.state.selected, card)}
        card={card}
        key={card} />
    )
    getFifteens(this.props.hand)
    
    // const renderLine = (card, otherCard) => {
    //   if(isFifteen(card, otherCard)){
    //     return (<Line from={card} to={otherCard} key={`${card}+${otherCard}`}/>)
    //   }
    // }
    return (
      <div>
        {this.props.hand.map(renderCard)}
      </div>
    )
  }
}