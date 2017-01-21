import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'

const Player = (props) => (
  <div>
    <span><b>Player {props.num}</b></span>
    <span hidden={!props.isCurrentPlayer}> ( This is you ) </span>

    <div>cut for first crib: {props.myBGC}</div>
    <div>hand: {JSON.stringify(props.myHand)}</div>
    <h5 hidden={!props.isCurrentPlayer || props.waitingForCut}>
      {props.hasFirstCrib ? 'You win!' : 'You lose'}
      <button hidden={!props.hasFirstCrib} onClick={props.deal}>Deal!</button>
      <div hidden={props.myHand}>Waiting for deal</div>
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
    hasFirstCrib: valueOf(my.beginGameCut) > valueOf(their.beginGameCut),
    waitingForCut: !my.beginGameCut || !their.beginGameCut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Player)