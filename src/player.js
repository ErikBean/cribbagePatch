import React from 'react'
import { connect } from 'react-redux'
import { difference } from 'lodash'
import { createDeck, shuffle, valueOf } from './deck'
import Hand from './hand'

const Player = (props) => (
  <div hidden={!props.isCurrentPlayer}>
    <span><b>Player {props.num}</b></span>
    <h5 hidden={!props.isCurrentPlayer || props.waitingForCut}>
      <div hidden={props.myHand.length}>
        {props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'}
        <br />Waiting for deal
      </div>
      <button hidden={!props.hasFirstCrib || props.myHand.length} onClick={props.deal}>Deal!</button>
    </h5>
    <div hidden={!props.myHand.length}>
      hand: <Hand hasCut={props.hasCut} hand={props.myHand} discard={(discards) => props.discard(props.myHand, discards)} />
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const myHand = state.players[`player${ownProps.num}`].hand || []
  const cut = state.cut || []
  return {
    myHand: myHand.concat(cut),
    hasCut: cut.length > 0,
    hasFirstCrib: ( ownProps.num === '1' && ownProps.isCurrentPlayer),
    waitingForCut: !state.meta.firstCut || !state.meta.secondCut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const player = `player${ownProps.num}`
  const discard = (hand, discards) => {
    dispatch({
      type: 'GET_HAND',
      payload: {
        player,
        hand: difference(hand, discards)
      }
    })
    dispatch({
      type: 'DISCARD',
      payload: { player, discards }
    })
  }
  return { discard }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
