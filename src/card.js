import React from 'react'
import { valueOf } from './deck'

function getNumberOrFace (card) {
  const number = valueOf(card)
  switch (number) {
    case 1:
      return 'ace'
      break
    case 11:
      return 'jack'
      break
    case 12:
      return 'queen'
      break
    case 13:
      return 'king'
    default:
      return number
  }
}

function getSuit(card){
  switch (card[0]) {
    case 'H':
      return 'hearts'
    case 'D':
      return 'diamonds'
    case 'S':
      return 'spades'
    case 'C':
      return 'clubs'
    default:
      return 'XXXX'
  }
}

const Card = (props) => {
  const value = getNumberOrFace(props.card)
  const suit = getSuit(props.card)
  return (
    <img src={`../styles/svg-cards/${value}_of_${suit}.svg`} />
  )
}
export default Card
