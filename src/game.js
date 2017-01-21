import React from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
import { size, clone } from 'lodash'
import Player from './player'
import store from './store'

const game = (props) => (
  <div>
    <div>
      <button disabled={props.isPlayer2 || props.p1Cut} onClick={props.player1Cut}>Shuffle and Cut</button>
      <button disabled={props.isPlayer1 || props.p2Cut} onClick={props.player2Cut}>Cut</button>
    </div>
    <Player num='1' isCurrentPlayer={props.isPlayer1} deal={props.deal}/>
    <Player num='2' isCurrentPlayer={props.isPlayer2} deal={props.deal}/>
    <br />
    <div id="debugDeck" onClick={(e) => showDeck(e, props.deck)}>
      Click to log the deck
    </div>
  </div>
)

const mapStateToProps = (state) => {
  const {
    players: {
      player1: {
        beginGameCut: p1Cut
      },
      player2: {
        beginGameCut: p2Cut
      }
    },
    deck
  } = state
  const { isPlayer1, isPlayer2 } = state.meta
  return {
    isPlayer1,
    isPlayer2,
    p1Cut,
    p2Cut,
    deck
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    player1Cut: () => {
      const deck = shuffle(createDeck())
      dispatch({type: 'UPDATE_DECK', payload: deck})
      dispatch({type: `ASSIGN_PLAYER`, payload: 'player1'})
      dispatch({
        type: `BEGIN_GAME_CUT`,
        payload: {
          player: 'player1',
          cut: deck[0]
        }
      })
    },
    player2Cut: () => {
      dispatch({
        type: `BEGIN_GAME_CUT`,
        payload: {
          player: 'player2',
          cut: store.getState().deck[1]
        }
      })
      dispatch({type: `START_GAME`})
    },
    deal: () => {
      let deck = shuffle(store.getState().deck)
      
      let hand1 = {}, hand2 = {}
      for(let i = 1; i < 7; i++){
        const lastIndex = size(deck) - i  
        hand1[i] = clone(deck[lastIndex])
        hand2[i] = clone(deck[lastIndex - 6 ])
        deck[lastIndex] = null
        deck[lastIndex - 6 ] = null
      }
      dispatch({type: 'UPDATE_DECK', payload: deck})
      
      dispatch({
        type: 'GET_HAND',
        payload: {
          player: 'player1',
          hand: hand1
        }
      })
      dispatch({
        type: 'GET_HAND',
        payload: {
          player: 'player2',
          hand: hand2
        }
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(game)

function showDeck (e, deck) {
  e.target.innerHTML = JSON.stringify(deck)
}