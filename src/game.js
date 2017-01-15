import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
import Player from './player'
import store from './store'

const game = (props) => (
  <div>
    <div>
      <button disabled={props.isPlayer2 || props.p1Cut} onClick={props.player1Cut}>Shuffle and Cut</button>
      <button disabled={props.hasGameStarted} onClick={props.player2Cut}>Cut</button>
      <h3 hidden={!props.hasGameStarted}>Let's start the game!</h3>
    </div>
    <Player num='1'/>
    <Player num='2'/>
    <div>
      {props.deck}
    </div>
    <button onClick={reload}>Restart the Game</button>
  </div>
)

function reload() {
  window.restart() // wipe gunDB
  window.location.reload()
}

const mapStateToProps = (state) => ({
  isPlayer1: state.meta.isPlayer1,
  isPlayer2: state.meta.isPlayer2,
  p1Cut: state.player1.beginGameCut,
  hasGameStarted: state.meta.hasGameStarted,
  deck: state.deck,
})
const mapDispatchToProps = (dispatch) => ({
  player1Cut: () => {
    dispatch({type: `ASSIGN_PLAYER1`})
    const deck = shuffle(createDeck())
    dispatch({type: 'UPDATE_DECK', payload: deck})
    dispatch({type: `BEGIN_GAME_CUT_1`, payload: deck[0]})
  },
  player2Cut: () => {
    dispatch({type: `BEGIN_GAME_CUT_2`, payload: store.getState().deck[1]})
    dispatch({type: `START_GAME`})
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(game)