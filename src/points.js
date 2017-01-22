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
let fifteens = {1:[], 2:[], 3:[], 4:[], 5:[]}
window.fifteens = fifteens

export function getFifteens (hand) {
  const isOutsideMatrix = (...cards) => { //dimensions of matrix = cards.length
    // Skip over elements outside traingular matrix
    // Indices must be in order! A > B > C > D 
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
  // Compare hand to itelf on 5 axes, to determine all 5-card combos (five-dimensional matrix)
  // Since matrix is symetric and addition is commutitive, only compute trianglular matrix
  function calcFifteens(otherCards){
    if(otherCards.length >= 4) return
    for(let cardX of hand){
      if(isOutsideMatrix(cardX, ...otherCards)) continue // keep matrix sparse
      if(isFifteen(cardX, ...otherCards)) fifteens[otherCards.length + 1].push([cardX, ...otherCards])
      calcFifteens([cardX, ...otherCards])
    }
  }
  
  for(let card of hand){
    calcFifteens([card])
  }

}