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

export function isFifteen(...cards) {
  let sum = cards.map((card) => valueMaxTen(card)).reduce((acc, curr) => (acc+curr), 0)
  return sum === 15
}

window.doubles = []
window.triples = []

export function getFifteens (hand) {
  let x2 = []
  let x3 = []
  window.doubles.push(x2)
  window.triples.push(x3)
  // bottom diagonal of matrix, same pairs in reversed order:
  const isOutsideSparseMatrix = (cardA, cardB) => ( hand.indexOf(cardA) >= hand.indexOf(cardB) )
  const isOutsideMatrix = (...cards) => {
    // indices must be in order! A > B > C > D 
    const indices = cards.map((c) => hand.indexOf(c))
    for(let i=1; i < indices.length; i++){
      const thisIndex = indices[i]
      const prevIndex = indices[i - 1]
      if(thisIndex >= prevIndex){
        return true
      }
    }
    return false
  }
  
  for(let cardA of hand){
    for(let cardB of hand){
      if(isOutsideMatrix(cardA, cardB)) continue
      if(isFifteen(cardA, cardB)) x2.push([cardA, cardB])
      for(let cardC of hand){
        if(isOutsideMatrix(cardA, cardB, cardC)) continue
        if(isFifteen(cardA, cardB, cardC)) x3.push([cardA, cardB, cardC])
      }
    }
  }
}