import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from '../deck'

import Card from './card'

class Deck extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasFirstCut: false,
      hasBeenCut: false,
    }
    this.doFirstCut = this.doFirstCut.bind(this)
    this.doSecondCut = this.doSecondCut.bind(this)
    this.updatePrompt = this.updatePrompt.bind(this)
  }
  componentWillMount(){
    this.updatePrompt(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    this.updatePrompt(nextProps)
    if (nextProps.firstCut && nextProps.secondCut && this.state.hasFirstCut) {
      const myCut = nextProps.firstCut
      const theirCut = nextProps.secondCut
      this.props.assignPlayer(myCut, theirCut)
    }
  }
    
  updatePrompt(props){
    if(!props.firstCut && !props.secondCut){
      props.showMessage('Cut for first crib #1', this.doFirstCut)
    } else if(props.firstCut && !props.secondCut){
      if(this.state.hasFirstCut){
        props.showMessage('Waiting for cut for first crib #2', null)
      } else {
        props.showMessage('Cut for first crib #2', this.doSecondCut)
      }
    }
  }

  doFirstCut () {
    const deck = shuffle(createDeck())
    this.props.updateDeck(deck)
    const myCut = deck[0]
    this.props.cutForFirstCrib(true, myCut)
    this.setState({hasFirstCut: true}, () => this.updatePrompt(this.props))
    // then wait for remote player to make second cut
  }
  doSecondCut () {
    const myCut = this.props.deck[1]
    const theirCut = this.props.firstCut
    this.props.cutForFirstCrib(false, myCut)
    // Assign players here:
    this.props.assignPlayer(myCut, theirCut)
  }

  render () {
    return (
      <div>
        <div hidden={this.props.round > 0}>
          <Card card={this.props.firstCut} />
          <Card card={this.props.secondCut} />
        </div>
        <div hidden={!this.props.cut}>
          <Card card={this.props.cut} isOnDeck />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  const { deck, cut, firstCut, secondCut, isPlayer1, isPlayer2, round } = state
  return {
    firstCut,
    secondCut,
    deck,
    cut,
    round
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deck)

