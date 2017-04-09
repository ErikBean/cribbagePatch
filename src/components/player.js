import React, { Component } from 'react'
import { connect } from 'react-redux'
import { difference, last, every, isEmpty, includes, size } from 'lodash'
import { sumOf, valueMaxTen, getPegPoints } from '../points'
import { createDeck, shuffle } from '../deck'

import Card from './card'
import ScoreBoard from './scoreBoard'

const isTooHighToPlay = (c, pegCount) => {
  return valueMaxTen(c) > (31 - pegCount)
}

const isMyCrib = (playerNum, round) => {
  // on first crib, playerNum = 1, round = 1
  return (parseInt(playerNum) + round) % 2 === 0
}

function stateFromProps (props) {
  const isWaitingForLead = isEmpty(props.playedCards) && props.hasFirstCrib
  const didPlayLast = includes(props.hand, last(props.playedCards))
  const pegCount = sumOf(props.playedCards || [])
  const myUnplayed = difference(props.hand, props.playedCards)
  const theirUnplayed = difference(props.theirHand, props.playedCards)
  const hasAGo = every(theirUnplayed, (c) => isTooHighToPlay(c, pegCount)) && didPlayLast
  const isMyTurn = !didPlayLast || hasAGo
  const shouldDiscard = (props.hand || []).length > 4
  return { isWaitingForLead, isMyTurn, pegCount, hasAGo, shouldDiscard, myUnplayed }
}

class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: [null, null],
      ...stateFromProps(props)
    }
    this.tryPlayCard = this.tryPlayCard.bind(this)
    this.onCardClick = this.onCardClick.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
    this.deal = this.deal.bind(this)
    this.discard = this.discard.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.setState(stateFromProps(nextProps), this.componentDidUpdate)
    if (nextProps.hasFirstCrib && !(nextProps.hand || []).length) {
      this.props.showMessage('You win the first crib! Deal the cards.', this.deal)
    } else if (nextProps.opponentHasFirstCrib && !(nextProps.hand || []).length) {
      this.props.showMessage('Opponent has the first crib. Waiting for deal.', null)
    }
  }
  componentDidUpdate () {
    const hasHand = this.props.hand && this.props.hand.length
    const { num, round, showMessage, isCurrentPlayer, cut, cutIndex, crib } = this.props
    const hasCrib = isMyCrib(num, round)
    if (!hasHand || !isCurrentPlayer) return
    if (this.state.shouldDiscard) {
      showMessage('please discard 2 cards', this.discard)
    } else if (size(crib) < 4) {
      showMessage('Waiting for other player to discard', null)
    } else if (!cutIndex && !hasCrib) { // need to cut 5th card
      showMessage('Cut the Deck!', this.props.selectCutIndex)
    } else if (cutIndex && !cut && hasCrib) {
      showMessage('Cut 5th card!', this.props.cutDeck)
    } else if (!cut) {
      showMessage('Waiting for other player to cut', null) // either index or 5th card
    } else {
      showMessage('click a card to start pegging', null)
    }
  }
  discard () {
    if (!this.state.selected[0] || !this.state.selected[1]) {
      window.alert('select 2 cards!')
      return
    }
    this.props.discard(this.state.selected)
  }
  deal () {
    const deck = shuffle(createDeck())
    const hand1 = []
    const hand2 = []
    for (let i = 0; i < 6; i++) {
      hand1[i] = deck[i]
      hand2[i] = deck[ i + 6 ]
    }
    this.props.incrementRound(this.props.round + 1)
    this.props.updateDeck(deck)
    this.props.getHand('player1', hand1)
    this.props.getHand('player2', hand2)
  }
  toggleSelect (card) {
    this.setState({
      selected: [ card, this.state.selected[0] ]
    })
  }
  tryPlayCard (card) {
    const { cut, playedCards } = this.props
    const { isMyTurn, isWaitingForLead, pegCount } = this.state
    if (!cut || isWaitingForLead || !isMyTurn || isTooHighToPlay(card, pegCount)) {
      return
    }
    const pegPoints = getPegPoints(this.props.playedCards, this.props.hand)
    console.log('>>> pegPoints: ', pegPoints)
    if (pegPoints.value) this.props.getPoints()
    this.props.playPegCard(card, playedCards || [])
  }
  onCardClick (card) {
    if (this.props.hand.length > 4) {
      this.toggleSelect(card)
    } else {
      this.tryPlayCard(card)
    }
  }
  render () {
    return (
      <div id='player-container'>
        <h2>Player {this.props.num} {this.props.isCurrentPlayer ? '(This is You)' : ''}</h2>
        <div id='player-hand' hidden={!this.props.isCurrentPlayer}>
          Your Hand:
          <div>
            <ScoreBoard cards={this.props.myHandWithCut} />
            Peg Count: {this.state.pegCount}
            <br />
            {this.state.myUnplayed.map((card) => (
              <Card
                onClick={() => this.onCardClick(card)}
                isSelected={includes(this.state.selected, card)}
                card={card}
                key={card} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { playedCards, cut, cutIndex, crib, round } = state
  const { isPlayer1, isPlayer2 } = state.meta

  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  return {
    playedCards,
    isCurrentPlayer,
    cut,
    cutIndex,
    crib,
    round,
    myHandWithCut: (ownProps.hand || []).concat(ownProps.cut || []),
    hasFirstCrib: isPlayer1,
    opponentHasFirstCrib: isPlayer2
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const playPegCard = (pegCard, played) => {
    dispatch({
      type: `PLAY_CARD`,
      payload: played.concat(pegCard)
    })
  }
  const discard = (discards) => {
    dispatch({
      type: `PLAYER${ownProps.num}_DISCARD`,
      payload: discards
    })
    dispatch({
      type: 'ADD_TO_CRIB',
      payload: discards
    })
  }

  return {
    discard,
    playPegCard,
    incrementRound: (nextRound) => dispatch({type: 'INCREMENT_ROUND', payload: nextRound}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
