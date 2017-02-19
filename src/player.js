import React from 'react'
import { connect } from 'react-redux'
import { difference } from 'lodash'
import { createDeck, shuffle, valueOf } from './deck'
import Set from './set'
import ScoreBoard from './scoreBoard'

const Player = (props) => {
  const cribWinnerMsg = props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'
  return (
    <div id='player-container'>
      <h2>Player {props.num} {props.isCurrentPlayer ?  '(This is You)' : ''}</h2>
      <div id='player-hand' hidden={!props.isCurrentPlayer}>
        Your Hand: 
        <div id='deal-hands' hidden={props.isDoneDealing || props.noCuts}>
          <h5> {cribWinnerMsg} <br /> Waiting for deal </h5>
          <button id='deal-button' hidden={!props.hasFirstCrib} onClick={props.deal}> Deal! </button>
        </div>
        <div hidden={!props.isDoneDealing}>
          <ScoreBoard cards={props.myHandWithCut} />
          <Set 
            cards={difference(props.hand, props.played)}
            discard={props.discard} 
            playCard={(card) => props.playPegCard(card, props.played)} />
        </div>
      </div>
      <div id='played-cards' hidden={!props.cut}>
        On the Table:
        <Set cards={props.played} />
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { firstCut, secondCut } = state
  const { isPlayer1, isPlayer2 } = state.meta
  const hand = state[`player${ownProps.num}Hand`] || []
  const played = state[`player${ownProps.num}Played`] || []
  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  const isDoneDealing = !!(hand.length || played.length)
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
  const playPegCard = (pegCard, played) => {  
    if (!ownProps.cut) return // can't peg before cutting
    dispatch({
      type: `PLAYER${ownProps.num}_PLAY_CARD`,
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
