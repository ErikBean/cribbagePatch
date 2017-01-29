import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from './deck'
import { size, clone } from 'lodash'
import Player from './player'
import Crib from './crib'
import Deck from './deckComponent'

class Game extends Component {
  constructor(props){
    super(props)
    this.state = {
      phase: 'discard'
    }
  }
  componentWillReceiveProps(newProps){
    if(newProps.crib.length === 4){
      // TODO: need to prompt player w/o crib to cut deck
      // TODO: need to prompt player w/ crib to click card
      this.setState({
        phase: 'cut'
      })
      // const cut = this.props.deck[13]
      // this.props.getCut(cut)
    }
  }
  render(){
    const deal = () => {
      const deck = shuffle(createDeck())
      const hand1 = []
      const hand2 = []
      for (let i = 0; i < 6; i++) {
        hand1[i] = deck[i]
        hand2[i] = deck[ i + 6 ]
      }
      this.props.updateDeck(deck)
      this.props.getHand('player1', hand1)
      this.props.getHand('player2', hand2)
    }
    const player1Cut = () => {
      const deck = shuffle(createDeck())
      this.props.updateDeck(deck)
      this.props.assignPlayer('player1')
      this.props.cutForFirstCrib('player1', deck[0])
    }
    const player2Cut = () => {
      this.props.assignPlayer('player2') // redundant, probably
      this.props.cutForFirstCrib('player2', this.props.deck[1])
    }
    
    return (
      <div>
        <div>
          <button disabled={this.props.isPlayer2 || this.props.p1BeginGameCut} onClick={player1Cut}>First Cut</button>
          <button disabled={this.props.isPlayer1 || this.props.p2BeginGameCut} onClick={player2Cut}>Second Cut</button>
        </div>
        <Player num='1' isCurrentPlayer={this.props.isPlayer1} deal={deal} phase={this.state.phase}/>
        <br />
        <Player num='2' isCurrentPlayer={this.props.isPlayer2} deal={deal} phase={this.state.phase}/>
        <Crib cards={this.props.crib} />
        <Deck deck={this.props.deck} />
        <br />
        <div id='debugDeck' onClick={(e) => showDeck(e, this.props.deck)}>
          Click to log the deck
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { deck, cut } = state
  const { isPlayer1, isPlayer2 } = state.meta
  const { player1, player2 } = state.players
  const { beginGameCut: p1BeginGameCut, discards: disc1 } = player1
  const { beginGameCut: p2BeginGameCut, discards: disc2 } = player2
  const crib = (disc1 || []).concat((disc2 || []))
  return {
    isPlayer1,
    isPlayer2,
    p1BeginGameCut,
    p2BeginGameCut,
    crib,
    cut,
    deck
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    cutForFirstCrib: (player, cut) => dispatch({
      type: `BEGIN_GAME_CUT`,
      payload: { player, cut }
    }),
    getHand: (player, hand) => dispatch({
      type: 'GET_HAND',
      payload: { player, hand }
    }),
    getCut: (cut) => dispatch({ type: 'GET_CUT', payload: cut })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)

function showDeck (e, deck) {
  e.target.innerHTML = JSON.stringify(deck)
}
