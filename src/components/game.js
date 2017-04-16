import React, { Component } from 'react'
import { connect } from 'react-redux'
import { valueOf, shuffle, createDeck } from '../deck'

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
      console.log('>>> componentWillMount player1: ')
      this.props.assignPlayer('player1')
    } else if (this.state.isPlayer2) {
      console.log('>>> componentWillMount player2: ')
      this.props.assignPlayer('player2')
    }
  }
  assignPlayerByCut (myCut, theirCut) {
    console.trace('>>> cutz: ', {myCut, theirCut}, valueOf(myCut) < valueOf(theirCut))
    if (!myCut || !theirCut) console.error('!!!!!assign based on no cut!', {myCut, theirCut})
    if (valueOf(myCut) < valueOf(theirCut)) {
      console.log('>>> assignP1: ')
      this.props.assignPlayer('player1')
      window.localStorage.setItem('cribbagePatchPlayer1', true)
    } else if (valueOf(myCut) > valueOf(theirCut)) {
      console.log('>>> assignP2: ')
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
  render () {
    return (
      <div>
        <GameInfo text={this.state.message} onConfirm={this.state.nextAction} >
          <input
            type='range'
            min='0' max='40'
            disabled={this.props.cutIndex}
            onChange={this.changeCutIndex} />
        </GameInfo>
        <Deck
          showMessage={this.showMessage}
          assignPlayer={this.assignPlayerByCut}
          playerAssigned={this.props.isPlayer1 || this.props.isPlayer2}
          hasFirstCut={this.state.hasFirstCut}/>
        <div>
          <Player num='1'
            cut={this.props.cut}
            isUnassigned={!this.props.isPlayer1 && !this.props.isPlayer2}
            cutIndex={this.props.cutIndex}
            hand={this.props.player1Hand}
            crib={this.props.crib}
            theirHand={this.props.player2Hand}
            showMessage={this.showMessage}
            doFirstCut={this.doFirstCut}
            doSecondCut={this.doSecondCut}
            cutDeck={this.cutDeck}
            selectCutIndex={this.selectCutIndex} />
          <Player num='2'
            isUnassigned={!this.props.isPlayer1 && !this.props.isPlayer2}
            cut={this.props.cut}
            cutIndex={this.props.cutIndex}
            hand={this.props.player2Hand}
            crib={this.props.crib}
            theirHand={this.props.player1Hand}
            showMessage={this.showMessage}
            doFirstCut={this.doFirstCut}
            doSecondCut={this.doSecondCut}
            cutDeck={this.cutDeck}
            selectCutIndex={this.selectCutIndex} />
          <Crib
            visibleCards={this.props.crib || []}
            cards={(this.props.crib || []).concat(this.props.cut || [])} />
        </div>
        <br />
        <br />
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:<br />
          <PeggingArea
            invert={this.props.isPlayer2}
            playedCards={this.props.playedCards || []}
            player1Hand={this.props.player1Hand}
            player2Hand={this.props.player2Hand}
            isPlayer1={this.props.isPlayer1}
            isPlayer2={this.props.isPlayer2}
          />
        </div>
        <br />
        <br />
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
    doCut: (cut) => dispatch({type: 'GET_CUT', payload: cut}),
    selectCutIndex: (index) => dispatch({type: 'GET_CUT_INDEX', payload: index}),
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
