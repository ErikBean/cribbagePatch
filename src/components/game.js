import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from '../deck'

import Player from './player'
import Crib from './crib'
import Deck from './deckComponent'
import Card from './card'
import GameInfo from './infoMessage'
import PeggingArea from './table'

class Game extends Component {
  constructor (props) {
    super(props)

    this.showMessage = this.showMessage.bind(this)
    this.assignPlayer = this.assignPlayer.bind(this)
    this.state = {
      message: 'Need to cut for first crib',
      nextAction: () => {},
      // this helps restore state on refresh
      isPlayer1: window.localStorage.getItem('cribbagePatchPlayer1'),
      isPlayer2: window.localStorage.getItem('cribbagePatchPlayer2'),
      didFirstCut: false,
    }
  }
  componentWillMount () {
    if (this.state.isPlayer1) {
      this.props.assignPlayer('player1')
    } else if (this.state.isPlayer2) {
      this.props.assignPlayer('player2')
    }
  }
  assignPlayer (myCut, theirCut) {
    console.log('>>> Here: ', {myCut, theirCut})
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


  render () {
    return (
      <div>
        <GameInfo text={this.state.message} onConfirm={this.state.nextAction} />
        <Deck 
          showMessage={this.showMessage}
          assignPlayer={this.assignPlayer}/>
        <div>
          <Player num='1' 
            cut={this.props.cut}
            hand={this.props.player1Hand}
            theirHand={this.props.player2Hand}
            showMessage={this.showMessage} />
          <Player num='2' 
            cut={this.props.cut}
            hand={this.props.player2Hand}
            theirHand={this.props.player1Hand}
            showMessage={this.showMessage} />
          <Crib 
            visibleCards={this.props.crib || []} 
            cards={(this.props.crib || []).concat(this.props.cut || [])} />
        </div>
        <br />
        <br />
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:<br />
          <PeggingArea playedCards={this.props.playedCards || []} />
        </div>
        <br />
        <br />
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
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
