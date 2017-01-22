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
  const isSameCard = (cardA, cardB) => (hand.indexOf(cardA) === hand.indexOf(cardB)) 
  // bottom diagonal of matrix, same pairs in reversed order:
  const isOutsideSparseMatrix = (cardA, cardB) => (hand.indexOf(cardA) > hand.indexOf(cardB))
  for(let cardA of hand){
    for(let cardB of hand){
      if(isSameCard(cardA, cardB)) continue 
      if(isOutsideSparseMatrix(cardA, cardB)) continue
      if(isFifteen(cardA, cardB)) x2.push([cardA, cardB])
      for(let cardC of hand){
        if(isSameCard(cardA, cardC) || isSameCard(cardB, cardC)) continue
        if(isOutsideSparseMatrix(cardA, cardC) || isOutsideSparseMatrix(cardB, cardC)) continue
        if(isFifteen(cardA, cardB, cardC)) x3.push([cardA, cardB, cardC])
      }
    }
  }
}