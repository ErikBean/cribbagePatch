import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isNull } from 'lodash'
import { createDeck, shuffle, valueOf } from '../deck'
import Player from './player'
import Crib from './crib'
import DeckSlider from './deckSlider'
import Card from './card'
import GameInfo from './infoMessage'

function assignPlayerBasedOnCuts (myCut, theirCut, assign) {
  if (valueOf(myCut) < valueOf(theirCut)) {
    assign('player1')
  } else if (valueOf(myCut) > valueOf(theirCut)) {
    assign('player2')
  }
}
class Game extends Component {
  constructor (props) {
    super(props)
    this.doSecondCut = this.doSecondCut.bind(this)
    this.doFirstCut = this.doFirstCut.bind(this)
    this.deal = this.deal.bind(this)
    this.showMessage = this.showMessage.bind(this)
    this.state = {
      message: 'Need to cut for first crib',
      nextAction: this.doFirstCut
    }
  }
  componentWillMount () {
    const stored = {
      firstCut: window.localStorage.getItem('firstCut'),
      secondCut: window.localStorage.getItem('secondCut')
    }
    let myStoredCut = stored.firstCut || stored.secondCut
    let theirCut = (myStoredCut === stored.firstCut) ? this.props.secondCut : this.props.firstCut
    if (myStoredCut && theirCut) {
      assignPlayerBasedOnCuts(myStoredCut, theirCut, this.props.assignPlayer)
    }
  }
  componentWillReceiveProps (newProps) {
    const isNotAssignedPlayer = (!newProps.isPlayer1 && !newProps.isPlayer2)

    if (isNotAssignedPlayer && newProps.firstCut && newProps.secondCut) {
      const myCut = newProps.hasFirstCut ? newProps.firstCut : newProps.secondCut
      const theirCut = newProps.hasFirstCut ? newProps.secondCut : newProps.firstCut
      // Assign players here:
      assignPlayerBasedOnCuts(myCut, theirCut, this.props.assignPlayer)
    }
    if(newProps.firstCut && !newProps.isPlayer1){
      this.setState({nextAction: this.doSecondCut})
    }
  }
  showMessage(message, cb = ()=>{}){
    this.setState({message,nextAction: cb})
  }
  doFirstCut () {
    const deck = shuffle(createDeck())
    this.props.updateDeck(deck)
    const myCut = deck[0]
    this.props.cutForFirstCrib(true, myCut)
    window.localStorage.setItem('firstCut', myCut)
    // then wait for remote player to make second cut
  }
  doSecondCut () {
    const myCut = this.props.deck[1]
    const theirCut = this.props.firstCut
    this.props.cutForFirstCrib(false, myCut)
    window.localStorage.setItem('secondCut', myCut)
    // Assign players here:
    assignPlayerBasedOnCuts(myCut, theirCut, this.props.assignPlayer)
  }
  deal () {
    const deck = shuffle(createDeck())
    const hand1 = []
    const hand2 = []
    for (let i = 0; i < 6; i++) {
      hand1[i] = deck[i]
      hand2[i] = deck[ i + 6 ]
    }
    this.props.incrementRound((this.props.currentRound + 1))
    this.props.updateDeck(deck)
    this.props.getHand('player1', hand1)
    this.props.getHand('player2', hand2)
  }
  render () {
    return (
      <div>
        <GameInfo text={this.state.message} onConfirm={this.state.nextAction}/>
        <div hidden={this.props.doneFirstDeal}>
          <Card card={this.props.firstCut} />
          <Card card={this.props.secondCut} />
        </div>
        <div>
          <Player num='1' cut={this.props.cut} deal={this.deal} hand={this.props.player1Hand} theirHand={this.props.player2Hand} showMessage={this.showMessage}/>
          <Player num='2' cut={this.props.cut} deal={this.deal} hand={this.props.player2Hand} theirHand={this.props.player1Hand} showMessage={this.showMessage}/>
          <Crib visibleCards={this.props.crib || []} cards={(this.props.crib || []).concat(this.props.cut || [])} />
          <DeckSlider
            deck={this.props.deck}
            isHidden={!this.props.crib || this.props.crib.length !== 4}
            isMyCrib={this.props.isMyCrib} />
        </div>
        <br/>
        <div id='played-cards' hidden={!this.props.cut}>
          On the Table:<br/>
          {this.props.playedCards.map((card) => (
            <Card
              card={card}
              key={card} />
          ))}
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { round, deck, cut, crib, player1Hand, player2Hand, playedCards, firstCut, secondCut } = state
  const { isPlayer1, isPlayer2, isMyCrib } = state.meta
  const doneFirstDeal = player1Hand.length > 0 || player2Hand.length > 0
  const hasFirstCut = !isNull(window.localStorage.getItem('firstCut'))
  const hasSecondCut = !isNull(window.localStorage.getItem('secondCut'))
  return {
    currentRound: round,
    firstCut,
    secondCut,
    hasFirstCut,
    hasSecondCut,
    doneFirstDeal,
    isPlayer1,
    isPlayer2,
    player1Hand,
    player2Hand,
    playedCards,
    isMyCrib,
    crib,
    deck,
    cut
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRound: (nextRound) => dispatch({type: 'INCREMENT_ROUND', payload: nextRound}),
    assignPlayer: (player) => dispatch({type: `ASSIGN_PLAYER`, payload: player}),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck}),
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    getHand: (player, hand) => dispatch({
      type: `GET_${player.toUpperCase()}_HAND`,
      payload: hand
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
