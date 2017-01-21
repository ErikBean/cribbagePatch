import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'
import Hand from './hand'

const Player = (props) => (
  <div>
    <span><b>Player {props.num}</b></span>
    <span hidden={!props.isCurrentPlayer}> ( This is you ) </span>

    <div hidden={props.myHand}>cut for first crib: {props.myBGC}</div>
    <h5 hidden={!props.isCurrentPlayer || props.waitingForCut}>
      <div hidden={props.myHand}>
        {props.hasFirstCrib ? 'You win the first crib!' : 'Opponent has the first crib'}
        <br />Waiting for deal
      </div>
      <div>hand: <Hand hand={props.myHand || []} /></div>
      <button hidden={!props.hasFirstCrib || props.myHand} onClick={props.deal}>Deal!</button>
    </h5>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const myPlayerNum = `player${ownProps.num}`
  const theirPlayerNum = `player${ownProps.num === '1' ? 2 : 1}`
  const my = state.players[myPlayerNum]
  const their = state.players[theirPlayerNum]
  return {
    myHand: my.hand,
    myBGC: my.beginGameCut,
    theirCut: their.beginGameCut,
    hasFirstCrib: valueOf(my.beginGameCut) < valueOf(their.beginGameCut),
    waitingForCut: !my.beginGameCut || !their.beginGameCut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Player)