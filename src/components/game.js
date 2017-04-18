import React, { Component } from 'react'
import { connect } from 'react-redux'
import { valueOf, shuffle, createDeck } from '../deck'
import { playerActionSelector } from './playerSelectors'

import Player from './player'
import Crib from './crib'
import Deck from './deckComponent'
import GameInfo from './infoMessage'
import PeggingArea from './peggingArea'

class Game extends Component {
  constructor (props) {
    super(props)
    this.showMessage = this.showMessage.bind(this)
    this.assignPlayerByCut = this.assignPlayerByCut.bind(this)
    this.changeCutIndex = this.changeCutIndex.bind(this)
    this.selectCutIndex = this.selectCutIndex.bind(this)
    this.doFirstCut = this.doFirstCut.bind(this)
    this.doSecondCut = this.doSecondCut.bind(this)
    this.cutDeck = this.cutDeck.bind(this)
    this.deal = this.deal.bind(this)
    this.discard = this.discard.bind(this)
    this.state = {
      cutIndex: 20,
      message: 'Need to cut for first crib',
      nextAction: () => {},
      // this helps restore state on refresh
      isPlayer1: window.localStorage.getItem('cribbagePatchPlayer1'),
      isPlayer2: window.localStorage.getItem('cribbagePatchPlayer2'),
      hasFirstCut: false
    }
  }
  componentWillMount () {
    if (this.state.isPlayer1) {
      this.props.assignPlayer('player1')
    } else if (this.state.isPlayer2) {
      this.props.assignPlayer('player2')
    }
  }
  assignPlayerByCut (myCut, theirCut) {
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
  selectCutIndex () {
    this.props.selectCutIndex(this.state.cutIndex)
  }
  changeCutIndex (e) {
    this.setState({
      cutIndex: e.target.value
    })
  }
  cutDeck () {
    const NUM_CARDS_DEALT = 12
    this.props.doCut(this.props.deck[NUM_CARDS_DEALT + parseInt(this.props.cutIndex)])
  }
  doFirstCut () {
    const deck = shuffle(createDeck())
    const myCut = deck[0]
    this.setState({hasFirstCut: true})
    this.props.updateDeck(deck)
    this.props.cutForFirstCrib(true, myCut)
    // then wait for remote player to make second cut
  }
  doSecondCut () {
    const myCut = this.props.deck[1]
    const theirCut = this.props.firstCut
    this.props.cutForFirstCrib(false, myCut)
    // Assign players here:
    this.assignPlayerByCut(myCut, theirCut)
  }
  discard ([cardA, cardB]) {
    if (!cardA || !cardB) {
      window.alert('select 2 cards!')
      return
    }
    this.props.discard([cardA, cardB])
  }
  deal () {
    const deck = shuffle(createDeck())
    const hand1 = []
    const hand2 = []
    for (let i = 0; i < 6; i++) {
      hand1[i] = deck[i]
      hand2[i] = deck[ i + 6 ]
    }
    this.props.incrementRound((this.props.round || 0) + 1)
    this.props.updateDeck(deck)
    this.props.getHand('player1', hand1)
    this.props.getHand('player2', hand2)
  }
  render () {
    const renderPlayer = (num) => {
      return (<Player num={num}
        hand={this.props[`player${num}Hand`]}
        theirHand={this.props[`player${3 - parseInt(num)}Hand`]} // 3-2=1, 3=1=2
        cut={this.props.cut}
        cutIndex={this.props.cutIndex}
        crib={this.props.crib}
        showMessage={this.showMessage}
        doFirstCut={this.doFirstCut}
        doSecondCut={this.doSecondCut} //TODO: just pass next action (det by selector), instead of all these
        cutDeck={this.cutDeck}
        deal={this.deal}
        discard={this.discard}
        selectCutIndex={this.selectCutIndex} />)
    }
    return (
      <div>
        <GameInfo text={this.state.message} onConfirm={this.state.nextAction} >
          <input
            type='range'
            min='0' max='40'
            disabled={this.props.cutIndex}
            onChange={this.changeCutIndex} />
        </GameInfo>
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:<br />
          <PeggingArea
            invert={this.props.isPlayer2}
            playedCards={this.props.playedCards || []} // TODO: need to slice on RESTART
            player1Hand={this.props.player1Hand}
            player2Hand={this.props.player2Hand}
            isPlayer1={this.props.isPlayer1}
            isPlayer2={this.props.isPlayer2} />
        </div>
        {this.props.isPlayer1 ? renderPlayer('2') : renderPlayer('1')}
        <Deck
          showMessage={this.showMessage}
          assignPlayer={this.assignPlayerByCut}
          playerAssigned={this.props.isPlayer1 || this.props.isPlayer2}
          hasFirstCut={this.state.hasFirstCut}
          doSecondCut={this.doSecondCut} />
        <Crib
          visibleCards={this.props.crib || []}
          cards={(this.props.crib || []).concat(this.props.cut || [])} />
        {this.props.isPlayer1 ? renderPlayer('1') : renderPlayer('2')}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { firstCut, cutIndex, deck, cut, crib, player1Hand, player2Hand, playedCards, round } = state
  const { isPlayer1, isPlayer2 } = state.meta
  return {
    firstCut,
    isPlayer1,
    isPlayer2,
    player1Hand,
    player2Hand,
    playedCards,
    crib,
    deck,
    cut,
    cutIndex,
    round
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    doCut: (cut) => dispatch({type: 'GET_CUT', payload: cut}),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    }),
    incrementRound: (nextRound) => dispatch({type: 'INCREMENT_ROUND', payload: nextRound}),
    selectCutIndex: (index) => dispatch({type: 'GET_CUT_INDEX', payload: index}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
