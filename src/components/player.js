import React, { Component } from 'react'
import { connect } from 'react-redux'
import { includes } from 'lodash'
import { calcPegPoints, isTooHighToPlay } from '../points'
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
  }
  componentWillMount () {
    const wrappedAction = this.props.nextAction ? () => this.props.nextAction(this.props.num, this.state.selected) : null
    this.props.actions.showMessage(this.props.prompt, wrappedAction)
  }
  componentWillReceiveProps (nextProps) {
    const hasNewPrompt = nextProps.prompt !== this.props.prompt
    const wrappedAction = nextProps.nextAction ? () => this.props.nextAction(this.props.num, this.state.selected) : null
    if (nextProps.isCurrentPlayer && hasNewPrompt) {
      console.log('>>> SM2! ', this.props.num)
      this.props.actions.showMessage(nextProps.prompt, wrappedAction)
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
    const allCardsThisRound = this.props.playedCards.slice(this.props.pastPlayedCardsIndex).concat(card) // prempt store update.
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
    prompt: playerPromptSelector(state, ownProps),
    pastPlayedCardsIndex: state.meta.pastPlayedCardsIndex
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  const playPegCard = (pegCard, played) => {
    dispatch({
      type: `PLAY_CARD`,
      payload: played.concat(pegCard)
    })
  }
  return {
    playPegCard,
    getPoints: (points) => dispatch({type: `PLAYER${ownProps.num}_POINTS`, payload: points})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
