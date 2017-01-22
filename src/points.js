import { valueOf, getSuit } from './deck'

export default function getPoints(hand){
  //game logic ....
  const values = hand.map(valueOf)
  const suits = hand.map(getSuit)
  const fifteens = getFifteens(values)
}

export function isFifteen(card, otherCard) {
  return (valueOf(card) + valueOf(otherCard)) === 15
}