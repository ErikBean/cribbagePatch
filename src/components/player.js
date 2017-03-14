import React, { Component } from 'react'
import { connect } from 'react-redux'
import { difference, intersection, last, without, every, isEmpty, includes } from 'lodash'
import { sumOf, valueMaxTen } from '../points'
import Set from './set'
import ScoreBoard from './scoreBoard'

const isTooHighToPlay = (c, pegCount) => {
  return valueMaxTen(c) > (31 - pegCount)
}

const isMyCrib = (playerNum, round) => {
  // on first crib, playerNum = 1, round = 1
  return (playerNum + round) % 2 === 0
}

function stateFromProps (props) {
  const isWaitingForLead = isEmpty(props.playedCards) && props.hasFirstCrib
  const didPlayLast = includes(props.hand, last(props.playedCards))
  const isMyTurn = !didPlayLast || props.hasAGo
  const pegCount = sumOf(props.playedCards)
  
  return { isWaitingForLead, isMyTurn, pegCount }
}

class Player extends Component {
  constructor(props){
    super(props)
    this.state = stateFromProps(props)
    this.tryPlayCard = this.tryPlayCard.bind(this)
  }
  componentWillReceiveProps(nextProps){
    this.setState(stateFromProps(nextProps))
  }
  tryPlayCard(card){
    const { cut, playedCards } = this.props 
    const { isMyTurn, isWaitingForLead, pegCount } = this.state
    if (!cut || isWaitingForLead || !isMyTurn || isTooHighToPlay(card, pegCount)) {
      return
    }
    this.props.playPegCard(card, playedCards)
  }
  render(){
    const cribWinnerMsg = this.props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'
    return (
      <div id='player-container'>
        <h2>Player {this.props.num} {this.props.isCurrentPlayer ? '(This is You)' : ''}</h2>
        <div id='player-hand' hidden={!this.props.isCurrentPlayer}>
          Your Hand:
          <div id='deal-hands' hidden={this.props.isDoneDealing || this.props.noCuts}>
            <h5> {cribWinnerMsg} <br /> Waiting for deal </h5>
            <button id='deal-button' hidden={!this.props.hasFirstCrib} onClick={this.props.deal}> Deal! </button>
          </div>
          <div hidden={!this.props.isDoneDealing}>
            <ScoreBoard cards={this.props.myHandWithCut} />
            Peg Count: {this.props.pegCount}
            <Set
              cards={difference(this.props.hand, this.props.playedCards)}
              discard={this.props.discard}
              playCard={this.tryPlayCard} />
          </div>
        </div>
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:
          <Set cards={intersection(this.props.playedCards, this.props.hand)} />
          { (!this.props.isCurrentPlayer && this.props.hasAGo) ? 'Go!' : ''}
        </div>
      </div>
      )
    }
  }

const mapStateToProps = (state, ownProps) => {
  const { firstCut, secondCut, playedCards, round } = state
  const { isPlayer1, isPlayer2 } = state.meta
  const hand = state[`player${ownProps.num}Hand`] || []

  const theirNum = (3 - ownProps.num)
  const theirHand = state[`player${theirNum}Hand`] || []
  const myUnplayed = without(hand, ...playedCards)
  const theirUnplayed = without(theirHand, ...playedCards)
  const pegCount = sumOf(playedCards)
  const hasAGo = every(theirUnplayed, (c) => isTooHighToPlay(c, pegCount))

  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  const isDoneDealing = !!(hand.length || playedCards.length)
  const noCuts = !firstCut && !secondCut
  return {
    hand,
    playedCards,
    hasAGo,
    isCurrentPlayer,
    isDoneDealing,
    myHandWithCut: hand.concat(ownProps.cut || []),
    hasFirstCrib: isPlayer1,
    noCuts
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const playPegCard = (pegCard, played) => {
    dispatch({
      type: `PLAY_CARD`,
      payload: played.concat(pegCard)
    })
  }
  const discard = (discards) => {
    dispatch({
      type: `PLAYER${ownProps.num}_DISCARD`,
      payload: discards
    })
    dispatch({
      type: 'ADD_TO_CRIB',
      payload: discards
    })
  }

  return { discard, playPegCard }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
