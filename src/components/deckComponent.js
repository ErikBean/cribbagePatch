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
      cutIndex: 0
    }
    this.changeCutIndex = this.changeCutIndex.bind(this)
    this.selectCutIndex = this.selectCutIndex.bind(this)
    this.doCut = this.doCut.bind(this)
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
    console.log('>>> Here: ', myCut)
    this.props.cutForFirstCrib(false, myCut)
    // Assign players here:
    this.props.assignPlayer(myCut, theirCut)
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
      <div >
        <div hidden={this.props.cut} >
          <input
            type='range'
            min='0' max='40'
            hidden={this.props.isMyCrib}
            disabled={this.props.cutIndex}
            onChange={this.changeCutIndex} />
          <button
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
  const { deck, cut, cutIndex, firstCut, secondCut, isPlayer1, isPlayer2, round } = state
  return {
    firstCut,
    secondCut,
    deck,
    cutIndex,
    cut,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    selectCutIndex: (index) => dispatch({type: 'GET_CUT_INDEX', payload: index}),
    doCut: (cut) => dispatch({type: 'GET_CUT', payload: cut})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deck)

