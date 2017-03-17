import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from '../deck'

import Player from './player'
import Crib from './crib'
import DeckSlider from './deckSlider'
import Card from './card'
import GameInfo from './infoMessage'
import PeggingArea from './table'

class Game extends Component {
  constructor (props) {
    super(props)
    this.doSecondCut = this.doSecondCut.bind(this)
    this.doFirstCut = this.doFirstCut.bind(this)
    this.deal = this.deal.bind(this)
    this.showMessage = this.showMessage.bind(this)
    this.assignPlayer = this.assignPlayer.bind(this)
    this.state = {
      message: 'Need to cut for first crib',
      nextAction: this.doFirstCut,
      // this helps restore state on refresh
      isPlayer1: window.localStorage.getItem('cribbagePatchPlayer1'),
      isPlayer2: window.localStorage.getItem('cribbagePatchPlayer2'),
      didFirstCut: false
    }
  }
  componentWillMount () {
    if (this.state.isPlayer1) {
      this.props.assignPlayer('player1')
    } else if (this.state.isPlayer2) {
      this.props.assignPlayer('player2')
    }
  }
  componentWillReceiveProps (newProps) {
    if (newProps.firstCut && !newProps.isPlayer1) {
      this.setState({nextAction: this.doSecondCut})
    }
    if (newProps.firstCut && newProps.secondCut && !this.state.isPlayer1 && !this.state.isPlayer2) {
      const myCut = this.state.didFirstCut ? newProps.firstCut : newProps.secondCut
      const theirCut = this.state.didFirstCut ? newProps.secondCut : newProps.firstCut
      this.assignPlayer(myCut, theirCut)
    }
  }
  assignPlayer (myCut, theirCut) {
    if (!myCut || !theirCut) console.error('!!!!!assign based on no cut!', {myCut, theirCut})
    if (valueOf(myCut) < valueOf(theirCut)) {
      this.props.assignPlayer('player1')
      window.localStorage.setItem('cribbagePatchPlayer1', true)
    } else if (valueOf(myCut) > valueOf(theirCut)) {
      this.props.assignPlayer('player2')
      window.localStorage.setItem('cribbagePatchPlayer2', true)
    }
  }
  showMessage (message, cb = () => {}) {
    this.setState({message, nextAction: cb})
  }
  doFirstCut () {
    const deck = shuffle(createDeck())
    this.props.updateDeck(deck)
    const myCut = deck[0]
    this.props.cutForFirstCrib(true, myCut)
    this.setState({didFirstCut: true})
    // then wait for remote player to make second cut
  }
  doSecondCut () {
    const myCut = this.props.deck[1]
    const theirCut = this.props.firstCut
    this.props.cutForFirstCrib(false, myCut)
    // Assign players here:
    this.assignPlayer(myCut, theirCut)
  }
  deal () {
    const deck = shuffle(createDeck())
    const hand1 = []
    const hand2 = []
    for (let i = 0; i < 6; i++) {
      hand1[i] = deck[i]
      hand2[i] = deck[ i + 6 ]
    }
    this.props.incrementRound((this.props.currentRound + 1))
    this.props.updateDeck(deck)
    this.props.getHand('player1', hand1)
    this.props.getHand('player2', hand2)
  }
  render () {
    return (
      <div>
        <GameInfo text={this.state.message} onConfirm={this.state.nextAction} />
        <div hidden={this.props.doneFirstDeal}>
          <Card card={this.props.firstCut} />
          <Card card={this.props.secondCut} />
        </div>
        <div>
          <Player num='1' cut={this.props.cut} deal={this.deal} hand={this.props.player1Hand} theirHand={this.props.player2Hand} showMessage={this.showMessage} />
          <Player num='2' cut={this.props.cut} deal={this.deal} hand={this.props.player2Hand} theirHand={this.props.player1Hand} showMessage={this.showMessage} />
          <Crib visibleCards={this.props.crib || []} cards={(this.props.crib || []).concat(this.props.cut || [])} />
          <DeckSlider
            deck={this.props.deck}
            isHidden={!this.props.crib || this.props.crib.length !== 4}
            isMyCrib={this.props.isMyCrib} />
        </div>
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:<br />
          <PeggingArea playedCards={this.props.playedCards || []} />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { round, deck, cut, crib, player1Hand, player2Hand, playedCards, firstCut, secondCut } = state
  const { isPlayer1, isPlayer2, isMyCrib } = state.meta
  const doneFirstDeal = (player1Hand || []).length > 0 || (player2Hand || []).length > 0
  return {
    currentRound: round,
    firstCut,
    secondCut,
    doneFirstDeal,
    isPlayer1,
    isPlayer2,
    player1Hand,
    player2Hand,
    playedCards,
    isMyCrib,
    crib,
    deck,
    cut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRound: (nextRound) => dispatch({type: 'INCREMENT_ROUND', payload: nextRound}),
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
