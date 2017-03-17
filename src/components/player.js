import React, { Component } from 'react'
import { connect } from 'react-redux'
import { difference, last, every, isEmpty, includes } from 'lodash'
import { sumOf, valueMaxTen } from '../points'
import Card from './card'
import ScoreBoard from './scoreBoard'

const isTooHighToPlay = (c, pegCount) => {
  return valueMaxTen(c) > (31 - pegCount)
}

const isMyCrib = (playerNum, round) => {
  // on first crib, playerNum = 1, round = 1
  return (playerNum + round) % 2 === 0
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
  }
  componentWillReceiveProps (nextProps) {
    this.setState(stateFromProps(nextProps))
    if (nextProps.hasFirstCrib && !nextProps.hand.length) {
      this.props.showMessage('You win the first crib! Deal the cards.', this.props.deal)
    } else if (nextProps.opponentHasFirstCrib && !(nextProps.hand || []).length) {
      this.props.showMessage('Opponent has the first crib. Waitng for deal.')
    }
  }
  componentDidUpdate () {
    if (this.state.shouldDiscard) {
      this.props.showMessage('please discard 2 cards', () => {
        if (!this.state.selected[0] || !this.state.selected[1]) {
          window.alert('select 2 cards!')
        }
        this.props.discard(this.state.selected)
      })
    }
  }
  toggleSelect (card) {
    this.setState({
      selected: [ card, this.state.selected[0] ]
    })
  }
  onCardClick (card) {
    if (this.props.hand.length > 4) {
      this.toggleSelect(card)
    } else {
      this.tryPlayCard(card)
    }
  }
  tryPlayCard (card) {
    const { cut, playedCards } = this.props
    const { isMyTurn, isWaitingForLead, pegCount } = this.state
    if (!cut || isWaitingForLead || !isMyTurn || isTooHighToPlay(card, pegCount)) {
      return
    }
    this.props.playPegCard(card, playedCards)
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
            <div>
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
      </div>
    )
  }
  }

const mapStateToProps = (state, ownProps) => {
  const { playedCards } = state
  const { isPlayer1, isPlayer2 } = state.meta

  const isCurrentPlayer = (ownProps.num === '1' && isPlayer1) || (ownProps.num === '2' && isPlayer2)
  return {
    playedCards,
    isCurrentPlayer,
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

  return { discard, playPegCard }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
