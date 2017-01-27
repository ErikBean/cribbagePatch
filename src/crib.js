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

export default Crib
