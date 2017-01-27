import React from 'react'
import { connect } from 'react-redux'
import { difference } from 'lodash'
import { createDeck, shuffle, valueOf } from './deck'
import { getFifteens, getRuns, getPairs } from './points'
import Hand from './hand'
import Card from './card'
import ScoreBoard from './scoreBoard'

const Crib = (props) => (
  <div>
    <ScoreBoard cards={props.cards} />

    {props.cards.map((card) => <Card key={card} card={card} />)}
  </div>
)

const mapStateToProps = (state, ownProps) => {
  console.log('>>> Here: ', state)
  const p1Discards = state.players.player1.discards || []
  const p2Discards = state.players.player2.discards || []
  const cards = p1Discards.concat(p2Discards)
  return {
    cards
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Crib)
