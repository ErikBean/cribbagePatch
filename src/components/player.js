import React from 'react'
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

const Player = (props) => {
  const cribWinnerMsg = props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'
  const playPegCard = (card) => {
    const isWaitingForLead = isEmpty(props.playedCards) && props.hasFirstCrib
    const didPlayLast = includes(props.hand, last(props.playedCards))
    const isMyTurn = !didPlayLast || props.hasAGo
    console.log('>>> Here: ', {go: props.hasAGo, isWaitingForLead, isMyTurn, tooH: isTooHighToPlay(card, props.pegCount)})
    if (!props.cut || isWaitingForLead || !isMyTurn || isTooHighToPlay(card, props.pegCount)) return
    props.playPegCard(card, props.playedCards)
  }
  return (
    <div id='player-container'>
      <h2>Player {props.num} {props.isCurrentPlayer ? '(This is You)' : ''}</h2>
      <div id='player-hand' hidden={!props.isCurrentPlayer}>
        Your Hand:
        <div id='deal-hands' hidden={props.isDoneDealing || props.noCuts}>
          <h5> {cribWinnerMsg} <br /> Waiting for deal </h5>
          <button id='deal-button' hidden={!props.hasFirstCrib} onClick={props.deal}> Deal! </button>
        </div>
        <div hidden={!props.isDoneDealing}>
          <ScoreBoard cards={props.myHandWithCut} />
          Peg Count: {props.pegCount}
          <Set
            cards={difference(props.hand, props.playedCards)}
            discard={props.discard}
            playCard={playPegCard} />
        </div>
      </div>
      <div id='played-cards' hidden={!props.cut}>
        On the Table:
        <Set cards={intersection(props.playedCards, props.hand)} />
        { (!props.isCurrentPlayer && props.hasAGo) ? 'Go!' : ''}
      </div>
    </div>
  )
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
  console.log('>>> GG: ', {theirUnplayed})
  const hasAGo = every(theirUnplayed, (c) => isTooHighToPlay(c, pegCount))

  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  const isDoneDealing = !!(hand.length || playedCards.length)
  const noCuts = !firstCut && !secondCut
  return {
    hand,
    playedCards,
    pegCount,
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
