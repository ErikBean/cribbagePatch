import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
import Player from './player'
import store from './store'

let deck
const game = (props) => (
  <div>
    <div>
      {props.waitingForDB ? 'Waitng to connect...' : ''}
      <button disabled={props.isPlayer2 || props.p1Cut} onClick={props.player1Cut}>Shuffle and Cut</button>
      <button disabled={props.hasGameStarted} onClick={props.player2Cut}>Cut</button>
      <div>
        Player One Cut: {props.p1Cut} 
      </div>
      <div>
        Player Two Cut: {props.p2Cut}
      </div>
      <h3 hidden={!props.hasGameStarted}>Let's start the game!</h3>
    </div>
    <Player />
    <div>
      {props.deck}
    </div>
  </div>
)


const mapStateToProps = (state) => ({
  waitingForDB: !state.meta.hasReceivedInitData,
  isPlayer1: state.meta.isPlayer1,
  isPlayer2: state.meta.isPlayer2,
  p1Cut: state.player1.beginGameCut,
  p2Cut: state.player2.beginGameCut,
  hasGameStarted: state.meta.hasGameStarted,
  deck: state.deck,
})
const mapDispatchToProps = (dispatch) => ({
  player1Cut: () => {
    dispatch({type: `ASSIGN_PLAYER1`})
    deck = shuffle(createDeck())
    dispatch({type: 'UPDATE_DECK', payload: deck})
    dispatch({type: `BEGIN_GAME_CUT_1`, payload: deck[0]})
  },
  player2Cut: () => {
    dispatch({type: `BEGIN_GAME_CUT_2`, payload: store.getState().deck[1]})
    dispatch({type: `START_GAME`})
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(game)