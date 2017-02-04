import React from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { createDeck, shuffle, valueOf } from './deck'
import Hand from './hand'
import ScoreBoard from './scoreBoard'

const Player = (props) => {
  const cribWinnerMsg = props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'
  return (
    <div hidden={!props.isCurrentPlayer}>
      <h2>Player {props.num}</h2>
      <div id="deal-hands" hidden={props.isDoneDealing || props.noCuts}>
        <h5> {cribWinnerMsg} <br /> Waiting for deal </h5>
        <button hidden={!props.hasFirstCrib} onClick={props.deal}> Deal! </button>
      </div>
      <div hidden={!props.isDoneDealing}>
        <ScoreBoard cards={props.myHandWithCut} />
        <Hand
          hand={props.hand}
          played={props.played}
          discard={props.discard}
          playCard={(card) => props.playPegCard(card, props.hand)} />
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { firstCut, secondCut, isPlayer1, isPlayer2 } = state.meta
  const hand = state[`player${ownProps.num}Hand`] || []
  const played = state[`player${ownProps.num}Played`] || []
  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  const isDoneDealing = hand.length || played.length
  const noCuts = !firstCut && !secondCut
  return {
    hand,
    played,
    isCurrentPlayer,
    isDoneDealing,
    myHandWithCut: hand.concat(ownProps.cut || []),
    hasFirstCrib: isPlayer1,
    noCuts
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const playPegCard = (pegCard, hand) => {
    if (!ownProps.cut) return // can't peg before cutting
    dispatch({
      type: `PLAYER${ownProps.num}_PLAY_CARD`,
      payload: pegCard
    })
    dispatch({
      type: `GET_PLAYER${ownProps.num}_HAND`,
      payload: without(hand, pegCard)
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
