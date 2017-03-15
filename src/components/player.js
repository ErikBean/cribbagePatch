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
  const pegCount = sumOf(props.playedCards)
  const myUnplayed = without(props.hand, ...props.playedCards)
  const theirUnplayed = without(props.theirHand, ...props.playedCards)
  const hasAGo = every(theirUnplayed, (c) => isTooHighToPlay(c, pegCount)) && didPlayLast
  const isMyTurn = !didPlayLast || hasAGo
  
  return { isWaitingForLead, isMyTurn, pegCount, hasAGo }
}

class Player extends Component {
  constructor(props){
    super(props)
    this.state = stateFromProps(props)
    this.tryPlayCard = this.tryPlayCard.bind(this)
  }
  componentWillReceiveProps(nextProps){
    this.setState(stateFromProps(nextProps))
    const cribWinnerMsg = nextProps.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'

    if(nextProps.hasFirstCrib){
      this.props.showMessage('You win the first crib!')
    } else if(nextProps.opponentHasFirstCrib){
      this.props.showMessage('Opponent has the first crib')
    }
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
          <div id='deal-hands' hidden={this.props.isDoneDealing}>
            <h5> {cribWinnerMsg} <br /> Waiting for deal </h5>
            <button id='deal-button' hidden={!this.props.hasFirstCrib} onClick={this.props.deal}> Deal! </button>
          </div>
          <div hidden={!this.props.isDoneDealing}>
            <ScoreBoard cards={this.props.myHandWithCut} />
            Peg Count: {this.state.pegCount}
            <Set
              cards={difference(this.props.hand, this.props.playedCards)}
              discard={this.props.discard}
              playCard={this.tryPlayCard} />
          </div>
        </div>
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:
          <Set cards={intersection(this.props.playedCards, this.props.hand)} />
          { (!this.props.isCurrentPlayer && this.state.hasAGo) ? 'Other player says Go!' : '' }
        </div>
      </div>
      )
    }
  }

const mapStateToProps = (state, ownProps) => {
  const { firstCut, secondCut, playedCards, round } = state
  const { isPlayer1, isPlayer2 } = state.meta

  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  const isDoneDealing = !!(ownProps.hand.length || playedCards.length)
  return {
    // hand,
    playedCards,
    isCurrentPlayer,
    isDoneDealing,
    myHandWithCut: ownProps.hand.concat(ownProps.cut || []),
    hasFirstCrib: isPlayer1,
    opponentHasFirstCrib: isPlayer2,
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
