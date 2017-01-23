import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'
import Card from './card'
import Line from './line'

export default class Hand extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: [null, null], // Should always be length 2
      fifteens: getFifteens(this.props.hand),
      pairs: getPairs(this.props.hand), // 3 of a kind if any prop has value > 1
      runs: getRuns(this.props.hand)
    }
    this.toggleSelect = this.toggleSelect.bind(this)
    this.numFifteens = this.numFifteens.bind(this)
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
  numFifteens(){
    return Object.keys(this.state.fifteens).map((k) =>{
      return this.state.fifteens[k].length
    }).reduce((acc, curr) => {
      return acc + curr
    }, 0)
  }
  numPairs(){
    return Object.keys(this.state.pairs).map((k) => {
      return this.state.pairs[k]
    }).reduce((acc, curr) => {
      return acc + curr
    }, 0)
  }
  render () {
    const renderCard = (card) => (
      <Card
        toggleSelect={this.toggleSelect.bind(null,card)}
        isSelected={includes(this.state.selected, card)}
        card={card}
        key={card} />
    )    
    return (
      <div>
        <ul>
          <li>
            Fifteens: {this.numFifteens()}
          </li>
          <li>
            pairs:{this.numPairs()}
          </li>
          <li>
            runs:{JSON.stringify(this.state.runs)}
          </li>
        </ul>
        {this.props.hand.map(renderCard)}
      </div>
    )
  }
}