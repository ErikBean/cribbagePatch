import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'

const Player = (props) => (
  <div>
    <span><b>Player {props.num}</b></span>
    <span hidden={!props.isCurrentPlayer}> ( This is you ) </span>

    <div>cut for first crib: {props.myBGC}</div>
    <div>hand: {props.myHand}</div>
    <h5 hidden={!props.hasGameStarted || !props.isCurrentPlayer}>
      {props.hasFirstCrib ? 'You win!' : 'You lose :('}
      <button hidden={!props.hasFirstCrib} onClick={props.deal}>Deal!</button>
    </h5>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const myPlayerNum = `player${ownProps.num}`
  const theirPlayerNum = `player${ownProps.num === '1' ? 2 : 1}`
  return {
    myHand: state[myPlayerNum].hand,
    myBGC: state[myPlayerNum].beginGameCut,
    theirCut: state[theirPlayerNum].beginGameCut,
    hasFirstCrib: valueOf(state[myPlayerNum].beginGameCut) > valueOf(state[theirPlayerNum].beginGameCut),
    hasGameStarted: state.meta.hasGameStarted
  }
}
const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Player)