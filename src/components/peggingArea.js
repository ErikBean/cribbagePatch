import React from 'react'
import { last, intersection } from 'lodash'
import Card from './card'
import { sumOf } from '../points'

export default (props) => {
  const fontStyle = {// TODO: Add this to text
    position: 'absolute',
    padding: '50px 25px',
    fontSize: '72px',
    textAlign: 'center',
    color: 'blue',
    fontweight: 'bold',
    fontFamily: 'sans-serif'
  }
  const cardContainer = {
    display: 'inline-block'
  }
  const tableStyle = {
    display: props.isHidden ? 'none' : 'block',
    backgroundColor: 'brown'
  }
  const currentPegCards = props.playedCards.slice(props.pastPlayedCardsIndex)
  const isLast = (card) => card === last(props.playedCards)
  const pegCount = sumOf(currentPegCards)
  const cardsPlayed = intersection(currentPegCards, props.playerHand)
  const renderPegCard = (card) => (
    <div key={card} style={cardContainer}>
      <Card card={card}>
        <div style={fontStyle} hidden={!isLast(card) || (props.playedCards.length === 8 && props.pastPlayedCardsIndex === 0)}>
          {pegCount}
        </div>
      </Card>
    </div>
  )
  return (
    <div style={tableStyle}>
      <div>{cardsPlayed.map(renderPegCard)}</div>
    </div>
  )
}

