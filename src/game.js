import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'
import { size, clone } from 'lodash'
import Player from './player'
import Crib from './crib'
import DeckSlider from './deckSlider'
import Card from './card'

class Game extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasAlreadyCut: false,
      hasFirstCut: null,
      myCut: null
    }
    this.doSecondCut = this.doSecondCut.bind(this)
    this.doFirstCut = this.doFirstCut.bind(this)
    this.deal = this.deal.bind(this)
    this.assignPlayerBasedOnCuts = this.assignPlayerBasedOnCuts.bind(this)
  }
  componentWillReceiveProps(newProps){
    const isNotAssignedPlayer = ( !this.props.isPlayer1 && !this.props.isPlayer2 )
    if(this.state.hasFirstCut && newProps.secondCut && isNotAssignedPlayer){
      // Assign players here:
      this.assignPlayerBasedOnCuts(this.state.myCut, newProps.secondCut)
    }
  }
  assignPlayerBasedOnCuts(myCut, theirCut){
    if(valueOf(myCut) < valueOf(theirCut)){
      this.props.assignPlayer('player1')
    } else if(valueOf(myCut) > valueOf(theirCut)){
      this.props.assignPlayer('player2')
    } else{
      alert('tie!')
    }
  }
  doFirstCut(){
    const deck = shuffle(createDeck())
    this.props.updateDeck(deck)
    const myCut = deck[0]
    this.props.cutForFirstCrib(true, myCut)
    this.setState({
      hasAlreadyCut: true,
      hasFirstCut: true,
      myCut,
    })
    // then wait for remote player to make second cut
  }
  doSecondCut() {
    const myCut = this.props.deck[1]
    this.props.cutForFirstCrib(false, myCut)
    this.setState({
      hasAlreadyCut: true,
      hasFirstCut: false,
      myCut
    })
    // Assign players here:
    this.assignPlayerBasedOnCuts(myCut, this.props.firstCut)
  }
  deal(){
    const deck = shuffle(createDeck())
    const hand1 = []
    const hand2 = []
    for (let i = 0; i < 6; i++) {
      hand1[i] = deck[i]
      hand2[i] = deck[ i + 6 ]
    }
    this.props.updateDeck(deck)
    this.props.getHand('player1', hand1)
    this.props.getHand('player2', hand2)
  }
  render () {
    return (
      <div>
        <div hidden={this.props.doneFirstDeal}>
          <button disabled={this.props.firstCut || this.state.hasAlreadyCut} onClick={this.doFirstCut}>
            First Cut
          </button>
          <Card card={this.props.firstCut} />
          <button disabled={!this.props.firstCut || this.props.secondCut || this.state.hasAlreadyCut} onClick={this.doSecondCut}>
            Second Cut
          </button>
          <Card card={this.props.secondCut} />
        </div>
        <div>
          <Player num='1' isCurrentPlayer={this.props.isPlayer1} deal={this.deal} />
          <br />
          <Player num='2' isCurrentPlayer={this.props.isPlayer2} deal={this.deal} />
          <Crib cards={(this.props.crib || []).concat(this.props.cut || [])} />
          <DeckSlider 
            deck={this.props.deck} 
            isHidden={!this.props.crib || this.props.crib.length !== 4}
            isMyCrib={this.props.isMyCrib} />
          <br />
          <div id='debugDeck' onClick={(e) => showDeck(e, this.props.deck)}>
            Click to log the deck
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { deck, cut, crib, player1Hand, player2Hand } = state
  const { isPlayer1, isPlayer2, firstCut, secondCut, isMyCrib } = state.meta
  const doneFirstDeal = player1Hand || player2Hand
  return {
    firstCut,
    secondCut,
    doneFirstDeal,
    isPlayer1,
    isPlayer2,
    isMyCrib,
    crib,
    deck,
    cut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: `BEGIN_GAME_CUT`,
      payload: { isFirst, cut }
    }),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

function showDeck (e, deck) {
  e.target.innerHTML = JSON.stringify(deck)
}
