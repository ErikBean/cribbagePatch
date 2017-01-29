import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle, valueOf } from './deck'
import { size, clone } from 'lodash'
import Player from './player'
import Crib from './crib'
import Deck from './deckComponent'
import Card from './card'

class Game extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasAlreadyCut: false
    }
  }
  componentWillReceiveProps (newProps) {
    if (newProps.player1.beginGameCut && newProps.player2.beginGameCut) {
      p1Val = valueOf(newProps.player1.beginGameCut)
      p2Val = valueOf(newProps.player2.beginGameCut)
      console.log('>>> Here: ', p1Val, p2Val)
      if (p1Val < p2Val) {
        this.props.assignPlayer('player1')
      } else if (p1Val > p2Val) {
        this.props.assignPlayer('player2') 
      } else {
        alert('tied!')
      }
    }
  }
  render () {
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
    const doFirstCut = () => {
      const deck = shuffle(createDeck())
      this.props.updateDeck(deck)
      this.props.cutForFirstCrib(true, deck[0])
      this.setState({
        hasAlreadyCut: true
      })
    }
    const doSecondCut = () => {
      this.props.cutForFirstCrib(false, this.props.deck[1])
      this.setState({
        hasAlreadyCut: true
      })
    }

    return (
      <div>
        <div hidden={this.props.player1.hand || this.props.player2.hand}>
          <button disabled={this.props.firstCut || this.state.hasAlreadyCut} onClick={doFirstCut}>
            First Cut
          </button>
          <Card card={this.props.firstCut} />
          <button disabled={!this.props.firstCut || this.props.secondCut || this.state.hasAlreadyCut} onClick={doSecondCut}>
            Second Cut
          </button>
          <Card card={this.props.secondCut} />
        </div>
        <div>
          <Player num='1' isCurrentPlayer={this.props.isPlayer1} deal={deal} />
          <br />
          <Player num='2' isCurrentPlayer={this.props.isPlayer2} deal={deal} />
          <Crib cards={this.props.crib} />
          <Deck deck={this.props.deck} />
          <br />
          <div id='debugDeck' onClick={(e) => showDeck(e, this.props.deck)}>
            Click to log the deck
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { deck, cut } = state
  const { isPlayer1, isPlayer2, firstCut, secondCut } = state.meta
  const { player1, player2 } = state.players
  const { discards: disc1 } = player1
  const { discards: disc2 } = player2
  const crib = (disc1 || []).concat((disc2 || []))
  return {
    isPlayer1,
    isPlayer2,
    player1,
    player2,
    firstCut,
    secondCut,
    crib,
    cut,
    deck
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: `BEGIN_GAME_CUT`,
      payload: { isFirst, cut }
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
