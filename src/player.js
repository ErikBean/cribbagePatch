import React from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { createDeck, shuffle, valueOf } from './deck'
import Hand from './hand'
import ScoreBoard from './scoreBoard'

const Player = (props) => (
  <div hidden={!props.isCurrentPlayer}>
    <span><b>Player {props.num}</b></span>
    <h5 hidden={!props.isCurrentPlayer || props.waitingForCut}>
      <div hidden={props.hand.length}>
        {props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'}
        <br />Waiting for deal
      </div>
      <button hidden={!props.hasFirstCrib || props.hand.length || props.played.length}
        onClick={props.deal}>
        Deal!
      </button>
    </h5>
    <div hidden={!props.hand.length}>
      <ScoreBoard cards={props.myHandWithCut} />
      <Hand
        hand={props.hand}
        played={props.played}
        discard={props.discard}
        playCard={(card) => props.playPegCard(card, props.hand)} />
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const { firstCut, secondCut, isPlayer1, isPlayer2 } = state.meta
  const hand = state[`player${ownProps.num}Hand`] || []
  const played = state[`player${ownProps.num}Played`] || []
  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  return {
    hand,
    isCurrentPlayer,
    played,
    myHandWithCut: hand.concat(ownProps.cut || []),
    hasFirstCrib: isPlayer1,
    waitingForCut: !firstCut || !secondCut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const playPegCard = (pegCard, hand) => {
    if(!ownProps.cut) return // can't peg before cutting
    dispatch({
      type: `PLAYER${ownProps.num}_PLAY_CARD`,
      payload: pegCard
    })
    dispatch({
      type: `GET_PLAYER${ownProps.num}_HAND`,
      payload: without(hand, pegCard)
    })
  }
  const discard = (discards) =>{
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
