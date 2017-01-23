import { valueOf, getSuit } from './deck'
import { uniq, difference } from 'lodash'

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

function isArraySorted (array) {
  for(let i=1; i < array.length; i++){
    const thisIndex = array[i]
    const prevIndex = array[i - 1]
    if(thisIndex >= prevIndex){
      return true
    }
  }
  return false
}

export function getFifteens (hand) {
  const fifteens = {1:[], 2:[], 3:[], 4:[], 5:[]} // index = number of cards in combos
  
  const isOutsideMatrix = (...cards) => {
    // Skip over elements outside traingular matrix (dimensions of matrix = cards.length)
    // Indices must be in order (A > B > C > D) to be strictly trianglular 
    const indices = cards.map((c) => hand.indexOf(c))
    return isArraySorted(indices)
  }
  // Compare hand to itelf on 5 axes, to determine all 5-card combos (five-dimensional matrix)
  // Since matrix is symetric and addition is commutitive, only compute trianglular matrix
  function calcFifteens(otherCards){
    if(otherCards.length >= 5) return
    for(let cardX of hand){
      if(isOutsideMatrix(cardX, ...otherCards)) continue // keep matrix sparse
      if(isFifteen(cardX, ...otherCards)) fifteens[otherCards.length + 1].push([cardX, ...otherCards])
      calcFifteens([cardX, ...otherCards])
    }
  }
  
  for(let card of hand){
    calcFifteens([card])
  }
  return fifteens
}

export function getPairs (hand) {
  const values = hand.map(valueOf).sort()
  const pairs = {}
  //if number occurs twice in a row, add to pairs object
  for (let i = 1;i < values.length; i++){
    if(values[i] === values[i - 1]){
      pairs[values[i]] ? pairs[values[i]]++ : pairs[values[i]] = 1
    }
  }
  return pairs
}

export function getRuns (hand) {
  return 0
}