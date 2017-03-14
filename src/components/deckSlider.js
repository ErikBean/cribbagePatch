import React, { Component } from 'react'
import { connect } from 'react-redux'

import Card from './card'

class DeckSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasBeenCut: false,
      cutIndex: 0
    }
    this.changeCutIndex = this.changeCutIndex.bind(this)
    this.selectCutIndex = this.selectCutIndex.bind(this)
    this.doCut = this.doCut.bind(this)
  }
  selectCutIndex () {
    this.setState({
      hasBeenCut: true
    })
    this.props.selectCutIndex(this.state.cutIndex)
  }
  changeCutIndex (e) {
    this.setState({
      cutIndex: e.target.value
    })
  }
  doCut () {
    const NUM_CARDS_DEALT = 12
    this.props.doCut(this.props.deck[NUM_CARDS_DEALT + this.state.cutIndex])
  }
  render () {
    return (
      <div hidden={this.props.isHidden}>
        <div hidden={this.props.cut} >
          <span hidden={this.props.isMyCrib}>After putting cards in crib, cut the deck:</span>
          <span hidden={!this.props.isMyCrib || this.props.cutIndex}>Waiting for other player to cut the deck</span>
          <input
            type='range'
            min='0' max='40'
            hidden={this.props.isMyCrib}
            disabled={this.props.cutIndex}
            onChange={this.changeCutIndex} />
          <button
            hidden={this.props.isMyCrib}
            disabled={this.props.hasBeenCut}
            onClick={this.selectCutIndex}>
            Cut the deck!
          </button>
          <button
            disabled={!this.props.isMyCrib || !this.props.cutIndex}
            onClick={this.doCut}>
            Cut 5th Card
          </button>
        </div>
        <div hidden={!this.props.cut}>
          <Card card={this.props.cut} isOnDeck />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    cutIndex: state.cutIndex,
    cut: state.cut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectCutIndex: (index) => dispatch({type: 'GET_CUT_INDEX', payload: index}),
    doCut: (cut) => dispatch({type: 'GET_CUT', payload: cut})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckSlider)
