import React, { Component } from 'react'
import { CUT_FOR_FIRST_CRIB_2 } from './playerMessages'

import Card from './card'

export default class Deck extends Component {
  constructor(props){
    super(props)
    this.state = {
      hasShownMessage: false
    }
  }
  componentWillReceiveProps (nextProps) { // TODO: lift this up, so this can be stateless
    if (nextProps.firstCut && !nextProps.secondCut && !nextProps.hasFirstCut && !this.state.hasShownMessage) {
      this.setState({
        hasShownMessage: true
      })
      this.props.showMessage(CUT_FOR_FIRST_CRIB_2, this.props.doSecondCut)
    }
    if (nextProps.firstCut && nextProps.secondCut && this.props.hasFirstCut && !this.props.playerAssigned) {
      const myCut = nextProps.firstCut
      const theirCut = nextProps.secondCut
      this.props.assignPlayer(myCut, theirCut)
    }
  }

  render () {
    return (
      <div style={{display: 'inline-block'}}>
        <div hidden={this.props.round > 0}>
          <span hidden={!this.props.firstCut} data-qa="first-cut" data-qa-card-value={this.props.firstCut}>
            <Card card={this.props.firstCut} />
          </span>
          <span hidden={!this.props.secondCut} data-qa="second-cut" data-qa-card-value={this.props.secondCut}>
            <Card card={this.props.secondCut} />
          </span>
        </div>
        <div hidden={!this.props.cut}>
          <div>CUT:</div>
          <Card card={this.props.cut} isOnDeck />
        </div>
      </div>
    )
  }
}


