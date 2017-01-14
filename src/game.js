import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'

const game = (props) => (
  <div>
    <button onClick={props.init}>Shuffle</button>
    <button onClick={props.decrement}>DECREMENT</button>
    <div>
      {props.deck}
    </div>
  </div>
)


const mapStateToProps = (state) => state
const mapDispatchToProps = (dispatch) => ({
  init: () => {
    const newDeck = shuffle(createDeck())
    dispatch({type: 'INIT_DECK', payload: newDeck})
  },
  decrement: () => dispatch({type: 'DECREMENT'})
})

export default connect(mapStateToProps, mapDispatchToProps)(game)

function startGame(dispatch) {
  const newDeck = shuffle(createDeck())
  dispatch({type: 'INIT_DECK', payload: newDeck})
}