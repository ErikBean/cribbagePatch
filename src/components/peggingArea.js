import React, { Component } from 'react'
import { includes, last, intersection } from 'lodash'
import Card from './card'
import PeggingScoreBoard from './peggingScoreBoard'
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
    backgroundColor: 'brown'
  }
  const isLast = (card) => card === last(props.playedCards)
  const pegCount = sumOf(props.playedCards)
  const cardsPlayedByP1 = intersection(props.playedCards, props.player1Hand)
  const cardsPlayedByP2 = intersection(props.playedCards, props.player2Hand)
  const renderPegCard = (card) => (
    <div key={card} style={cardContainer}>
      <Card card={card}>
        <div style={fontStyle} hidden={!isLast(card)}>
          {pegCount}
        </div>
      </Card>
    </div>
  )
  const renderP1 = <div>{cardsPlayedByP1.map(renderPegCard)}</div>
  const renderP2 = <div>{cardsPlayedByP2.map(renderPegCard)}</div>
  return (
    <div style={tableStyle} id='brown'>
      <div>{props.invert ? renderP1 : renderP2}</div>
      {props.children}
      <div>{props.invert ? renderP2 : renderP1}</div>
    </div>
  )
}

