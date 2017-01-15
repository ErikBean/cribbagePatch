import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'
const Player = (props) => (
  <div>
    <span style={{fontWeight: props.isCurrentPlayer ? 'bold' : 'normal'}}>Player {props.num}:</span>
    <i>cut: {props.myCut}</i>
    <h3 hidden={!props.hasGameStarted || !props.isCurrentPlayer}>
      {props.hasFirstCrib ? 'You win!' : 'You lose :('}
      <br />
      Let's start the game!
    </h3>
  </div>
)

const mapStateToProps = (state, ownProps) => {
  const myPlayerNum = `player${ownProps.num}`
  const theirPlayerNum = `player${ownProps.num === '1' ? 2 : 1}`
  const myCut = state[myPlayerNum].beginGameCut
  const theirCut = state[theirPlayerNum].beginGameCut
  return {
    myCut,
    theirCut,
    hasFirstCrib: valueOf(myCut) > valueOf(theirCut),
    hasGameStarted: state.meta.hasGameStarted
  }
}
const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Player)