import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pick } from 'lodash'
import { valueOf, shuffle, createDeck } from '../deck'
import Player from './player'
import Crib from './crib'
import Deck from './deckComponent'
import GameInfo from './infoMessage'
import PeggingArea from './peggingArea'
import Board from './board'

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
    this.advanceRound = this.advanceRound.bind(this)
    this.countHand = this.countHand.bind(this)
    this.flipCrib = this.flipCrib.bind(this)
    this.state = {
      isCribHidden:true,
      cutIndex: 20,
      message: 'init game',
      nextAction: null,
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
  showMessage (message, cb) {
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
  discard (playerNum, [cardA, cardB]) {
    if (!cardA || !cardB) {
      window.alert('select 2 cards!')
      return
    }
    this.props.discard([cardA, cardB], playerNum)
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
  advanceRound (goPoints, playerNum) {
    const playedCards = this.props.playedCards || []
    const numCardsPlayed = playedCards.length
    if (numCardsPlayed === 0) throw new Error('shouldnt advance round with no cards played!')
    if (numCardsPlayed < 8) {
      this.props.restartPegging(goPoints, playerNum, numCardsPlayed)
    } else { // this will tell players pegging is done, since playedcards=8
      this.props.restartPegging(goPoints, playerNum, 0)
    }
  }
  countHand (playerNum, handPoints) {
    const currentPoints = this.props[`player${playerNum}Points`]
    const totalPoints = currentPoints + handPoints
    this.props.getPointsForPlayer(playerNum, totalPoints)
  }
  flipCrib(){
    console.log('>>> OK, flip the crib!: ')
    this.setState({
      isCribHidden: false
    })
  }
  render () {
    const playerActions = pick(this, ['showMessage', 'doFirstCut', 'doSecondCut', 'countHand', 'cutDeck', 'deal', 'discard', 'advanceRound', 'selectCutIndex', 'flipCrib'])
    const renderPlayerSpace = (num) => {
      const myHand = Array.from(this.props[`player${num}Hand`] || []).sort()
      const theirHand = Array.from(this.props[`player${3 - parseInt(num)}Hand`] || []).sort()  // 3-2=1, 3-1=2
      const numCardsPlayed = (this.props.playedCards || []).length
      return (
        <Player num={num}
          hand={myHand}
          theirHand={theirHand}
          cut={this.props.cut}
          cutIndex={this.props.cutIndex}
          crib={this.props.crib}
          isCribHidden={this.state.isCribHidden}
          actions={playerActions} >
          <PeggingArea
            isHidden={!this.props.cut}
            playedCards={this.props.playedCards || []}
            pastPlayedCardsIndex={this.props.pastPlayedCardsIndex}
            playerHand={this.props[`player${num}Hand`]} />
        </Player>
      )
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
        {this.props.isPlayer1 ? renderPlayerSpace('2') : renderPlayerSpace('1')}
        <Board
          invert={this.props.isPlayer2}
          player1Points={this.props.player1Points || 0}
          player2Points={this.props.player2Points || 0} />
        {this.props.isPlayer1 ? renderPlayerSpace('1') : renderPlayerSpace('2')}
        <Deck
          showMessage={this.showMessage}
          assignPlayer={this.assignPlayerByCut}
          playerAssigned={this.props.isPlayer1 || this.props.isPlayer2}
          hasFirstCut={this.state.hasFirstCut}
          doSecondCut={this.doSecondCut} />
        <Crib
          isHidden={this.state.isCribHidden}
          visibleCards={this.props.crib || []}
          cards={(this.props.crib || []).concat(this.props.cut || [])} />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { isPlayer1, isPlayer2 } = state.meta
  return {
    isPlayer1,
    isPlayer2,
    ...state
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const discard = (discards, num) => {
    dispatch({
      type: `PLAYER${num}_DISCARD`,
      payload: discards
    })
    dispatch({
      type: 'ADD_TO_CRIB',
      payload: discards
    })
  }
  return {
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    discard,
    doCut: (cut) => dispatch({type: 'GET_CUT', payload: cut}),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    }),
    incrementRound: (nextRound) => dispatch({type: 'INCREMENT_ROUND', payload: nextRound}),
    selectCutIndex: (index) => dispatch({type: 'GET_CUT_INDEX', payload: index}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    restartPegging: (goPoints, playerNum, numCardsPlayed) => {
      dispatch({type: `PLAYER${playerNum}_POINTS`, payload: goPoints}) // take points for the go
      dispatch({type: 'MARK_CARDS_PEGGED', payload: (numCardsPlayed)}) // grey-out cards from last round (future). subtract one because we want the index, not the length
    },
    getPointsForPlayer: (playerNum, points) => dispatch({type: `PLAYER${playerNum}_POINTS`, payload: points})

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
