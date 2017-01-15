import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
const Player = (props) => (
  <div hidden={props.noPlayer}>
    <div>{`You are player ${props.playerNum}`}</div>
  </div>
)


const mapStateToProps = (state) => ({
  playerNum: state.meta.isPlayer1 ? 1 : 2,
  noPlayer: !state.meta.isPlayer1 && !state.meta.isPlayer2 
})
const mapDispatchToProps = (dispatch) => ({
  init: () => {
    deck = shuffle(createDeck())
    dispatch({type: 'UPDATE_DECK', payload: deck})
  },
  beginGameCut: (deck) => {
    dispatch({type: 'BEGIN_GAME_CUT', payload: deck[0]})
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)