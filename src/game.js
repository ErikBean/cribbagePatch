import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
import Player from './player'
import store from './store'

const game = (props) => (
  <div>
    <div>
      <button disabled={props.isPlayer2 || props.p1Cut} onClick={props.player1Cut}>Shuffle and Cut</button>
      <button disabled={props.isPlayer1 || props.p2Cut} onClick={props.player2Cut}>Cut</button>
    </div>
    <Player num='1' isCurrentPlayer={props.isPlayer1}/>
    <Player num='2' isCurrentPlayer={props.isPlayer2}/>
    <div>
      {JSON.stringify(props.deck)}
    </div>
  </div>
)

const mapStateToProps = (state) => {
  const { player1, player2, deck } = state
  const { isPlayer1, isPlayer2 } = state.meta
  return {
    isPlayer1,
    isPlayer2,
    p1Cut: player1.beginGameCut,
    p2Cut: player2.beginGameCut,
    deck
  }
}
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