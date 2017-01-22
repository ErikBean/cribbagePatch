import { valueOf, getSuit } from './deck'

export default function getPoints(hand){
  //game logic ....
  const values = hand.map(valueOf)
  const suits = hand.map(getSuit)
  const fifteens = getFifteens(values)
}

function valueMaxTen (card) {
  return valueOf(card) > 10 ? 10 : valueOf(card)
}

export function isFifteen(card, otherCard) {
  return (valueMaxTen(card) + valueMaxTen(otherCard)) === 15
}

window.doubles = []
export function getFifteens (hand) {
  let x2 = []
  window.doubles.push(x2)
  // const triples = []
  for(let cardA of hand){
    for(let cardB of hand){
      // same card:
      if(hand.indexOf(cardA) === hand.indexOf(cardB)) continue 
      // bottom diagonal of matrix, same pairs in reversed order:
      if(hand.indexOf(cardA) > hand.indexOf(cardB)) continue
      
      if(isFifteen(cardA, cardB)) x2.push([cardA, cardB])
    }
  }
}