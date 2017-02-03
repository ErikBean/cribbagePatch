import { valueOf, getSuit } from './deck'
import { uniq, size, toPairs, times } from 'lodash'

function valueMaxTen (card) {
  return valueOf(card) > 10 ? 10 : valueOf(card)
}

export function isFifteen (...cards) {
  let sum = cards.map((card) => valueMaxTen(card)).reduce((acc, curr) => (acc + curr), 0)
  return sum === 15
}

function isArraySorted (array) {
  for (let i = 1; i < array.length; i++) {
    const thisIndex = array[i]
    const prevIndex = array[i - 1]
    if (thisIndex >= prevIndex) {
      return true
    }
  }
  return false
}

export function getFifteens (hand) {
  const fifteens = {1: [], 2: [], 3: [], 4: [], 5: []} // index = number of cards in combos

  const isOutsideMatrix = (...cards) => {
    // Skip over elements outside traingular matrix (dimensions of matrix = cards.length)
    // Indices must be in order (A > B > C > D) to be strictly trianglular
    const indices = cards.map((c) => hand.indexOf(c))
    return isArraySorted(indices)
  }
  // Compare hand to itelf on 5 axes, to determine all 5-card combos (five-dimensional matrix)
  // Since matrix is symetric and addition is commutitive, only compute trianglular matrix
  function calcFifteens (otherCards) {
    if (otherCards.length >= 5) return
    for (let cardX of hand) {
      if (isOutsideMatrix(cardX, ...otherCards)) continue // keep matrix sparse
      if (isFifteen(cardX, ...otherCards)) fifteens[otherCards.length + 1].push([cardX, ...otherCards])
      calcFifteens([cardX, ...otherCards])
    }
  }

  for (let card of hand) {
    calcFifteens([card])
  }
  return fifteens
}

export function getPairs (hand) {
  const values = hand.map(valueOf).sort()
  const pairs = {}
  // if number occurs twice in a row, add to pairs object
  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) {
      pairs[values[i]] ? pairs[values[i]]++ : pairs[values[i]] = 1
    }
  }
  for (let n in pairs) {
    const hasThreeOfAKind = pairs[n] === 2
    const hasFourOfAKind = pairs[n] === 3
    if (hasThreeOfAKind) {
      pairs[n] = 3
    } else if (hasFourOfAKind) {
      pairs[n] = 6 
    }
  }
  return pairs
}

export function getRuns (hand) {
  const values = uniq(hand.map(valueOf).sort((a, b) => a > b))
  const run = []
  for (let i = 1; i < values.length; i++) {
    const thisVal = values[i]
    const lastVal = values[i - 1]
    if (thisVal === (lastVal + 1)) {
      run.length ? run.push(thisVal) : run.push(lastVal, thisVal)
    }
  }
  if (run.length < 3) return [] // no runs
  const pairs = toPairs(getPairs(hand))
  if (!pairs.length) return [ run ] // no double run, because no pairs
  // compute doubles:
  let multiRuns = []
  for (let [value, numPairs] of pairs) {
    if (run.includes(parseInt(value))) {
      switch(numPairs){
        case 1:
          multiRuns = multiRuns.concat(times(2, () => run)) // double run
        case 3:
          multiRuns = multiRuns.concat(times(3, () => run)) // triple run
      }
    }
  }
  return multiRuns
}
