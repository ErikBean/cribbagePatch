import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty, includes, size, last } from 'lodash'
import { sumOf, valueMaxTen, calcPegPoints, isTooHighToPlay } from '../points'
import { createDeck, shuffle } from '../deck'
import {
  isCurrentPlayerSelector,
  isMyTurnSelector,
  isWaitingForLead,
  myHandWithCutSelector,
  myUnplayedSelector,
  shouldPeggingRestartSelector,
  pegCountSelector,
  playedCardsSelector,
  playerActionSelector,
  playerPromptSelector
} from './playerSelectors'
import {
  CUT_FOR_FIRST_CRIB_1,
  CUT_FOR_FIRST_CRIB_2,
  WAIT_FOR_FIRST_CRIB_2,
  DEAL_FIRST_ROUND,
  WAIT_FOR_DEAL_FIRST_ROUND,
  DO_DISCARD,
  WAIT_FOR_DISCARD,
  CUT_DECK,
  CUT_FIFTH_CARD,
  WAIT_FOR_CUT,
  LEAD_PEGGING,
  WAIT_FOR_LEAD_PEGGING
} from './playerMessages'
import Card from './card'
import ScoreBoard from './scoreBoard'

class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: [null, null],
    }
    this.tryPlayCard = this.tryPlayCard.bind(this)
    this.onCardClick = this.onCardClick.bind(this)
    this.toggleSelect = this.toggleSelect.bind(this)
    this.getNextAction = this.getNextAction.bind(this)
  }
  componentWillMount(){
    this.props.showMessage(this.props.prompt, this.props.nextAction)
  }
  componentWillReceiveProps (nextProps) {
    if(nextProps.isCurrentPlayer){ // race condition with non-current player setting message
      this.props.showMessage(nextProps.prompt, nextProps.nextAction)
    }
  }
  componentDidUpdate(){
    if(this.props.isRoundDone) {
      this.props.restartPegging(this.props.playedCards.length)
    }
  }
  getNextAction (prompt) {
    switch(prompt){ // TODO: move first 2 someplace else? Player not assigned yet 
      case CUT_FOR_FIRST_CRIB_1:
        return this.props.doFirstCut
      case CUT_FOR_FIRST_CRIB_2:
        return this.props.doSecondCut
      case DEAL_FIRST_ROUND:
        return this.props.deal
      case DO_DISCARD:
        return this.props.discard
      case CUT_DECK:
        return this.props.selectCutIndex
      case CUT_FIFTH_CARD:
        return this.props.cutDeck
      default:
        return null
    }
  }
  toggleSelect (card) {
    this.setState({
      selected: [ card, this.state.selected[0] ]
    })
  }
  tryPlayCard (card) { // lift this up? 
    const { cut, playedCards, isWaitingForLead, pegCount, isMyTurn } = this.props
    if (!cut || isWaitingForLead || !isMyTurn || isTooHighToPlay(card, pegCount)) {
      return
    }
    // wouldnt need to do this if just did it based off props.... 
    const allCardsThisRound = [...this.props.playedCards, card] // prempt store update. TODO: Need to slice on RESTART
    const {runsPoints, fifteenPoints, pairsPoints} = calcPegPoints(allCardsThisRound, this.props.hand)
    if (runsPoints || fifteenPoints || pairsPoints) {
      const pegPointsForLastCard = runsPoints + fifteenPoints + pairsPoints
      this.props.getPoints(pegPointsForLastCard)
    }
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
          <br />
          {this.props.myUnplayed.map((card) => (
            <Card
              onClick={() => this.onCardClick(card)}
              isSelected={includes(this.state.selected, card)}
              card={card}
              key={card} />
          ))}
          <ScoreBoard cards={this.props.myHandWithCut} />
          <br />
          <br />
          <br />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isRoundDone: shouldPeggingRestartSelector(state, ownProps),
    myUnplayed: myUnplayedSelector(state, ownProps),
    pegCount: pegCountSelector(state),
    isWaitingForLead: isWaitingForLead(state, ownProps),
    isMyTurn: isMyTurnSelector(state, ownProps),
    playedCards: playedCardsSelector(state),
    isCurrentPlayer: isCurrentPlayerSelector(state, ownProps),
    myHandWithCut: myHandWithCutSelector(null, ownProps),
    nextAction: playerActionSelector(state, ownProps),
    prompt: playerPromptSelector(state, ownProps)
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
    }),
    getPoints: (points) => dispatch({type: `PLAYER${ownProps.num}_POINTS`, payload: points}),
    restartPegging: (numCardsPlayed) => dispatch({type: 'MARK_CARDS_PEGGED', payload: numCardsPlayed})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
