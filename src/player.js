import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
const Player = (props) => (
  <div>
    <b>Player {props.num}:</b>
    <i>cut: {props.cut}</i>
    
  </div>
)


const mapStateToProps = (state, ownProps) => ({
  cut: state[`player${ownProps.num}`].beginGameCut
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