import { valueOf } from './deck'
import { uniq, includes, last, countBy } from 'lodash'
import R from 'ramda'

export function valueMaxTen (card) {
  return valueOf(card) > 10 ? 10 : valueOf(card)
}
export const isTooHighToPlay = (c, pegCount) => {
  return valueMaxTen(c) > (31 - pegCount)
}

export function calcPegPoints (playedCards, hand) {
  const isLastCardPlayedByMe = includes(hand, last(playedCards))
  if (!isLastCardPlayedByMe) return { pairsPoints: 0, fifteenPoints: 0, runsPoints: 0 }
  const fifteenPoints = sumOf(playedCards) === 15 ? 2 : 0

  let pairsPoints = 0
  const last4 = playedCards.slice(-4).map(valueOf) // can't be more than 4 of a kind
  let pointVal = 0
  let temp = last4.pop()
  while (last4.length) {
    pointVal += 2
    if (temp === last4.pop()) {
      pairsPoints += pointVal
    } else {
      break
    }
  }

  let runsPoints = 0
  if (playedCards.length >= 3) {
    runsPoints = getPeggingRun(playedCards)
  }
  return {
    pairsPoints,
    fifteenPoints,
    runsPoints
  }
}
function getPeggingRun (playedCards) {
  let runsPoints
  let startIndex = -3
  let currentRun = null
  while (!currentRun || currentRun.length < playedCards.length) { // keep slicing backwards from end
    currentRun = playedCards.slice(startIndex).map(valueOf).sort((a, b) => a > b)
    runsPoints = 1 // first card in the run
    let prevVal = currentRun[0]
    for (let i = 1; i < currentRun.length; i++) {
      const currentVal = currentRun[i]
      if (currentVal === (prevVal + 1)) {
        prevVal = currentVal
        runsPoints++
      } else {
        break
      }
    }
    startIndex--
  }
  if (runsPoints < 3) runsPoints = 0
  return runsPoints
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

export function sumOf (cards) {
  return (cards || []).map(valueMaxTen).reduce((curr, acc) => curr + acc, 0)
}

export function isFifteen (...cards) {
  let sum = cards.map((card) => valueMaxTen(card)).reduce((acc, curr) => (acc + curr), 0)
  return sum === 15
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

/**
 * Find runs, double runs, triple runs, and double-double
 * Any cards not in run will not be in returned run array
 * @param  {[Card]} hand Array of 5 cards, e.g. ["D12", "S1", ...]
 * @return {[Card]} run     any type of run (double, triple, double-double)
 *                          e.g. ['C1','D2','S3'] or ['D1','C1','D2','C3','D3']
 */
export function getRuns (hand) {
  const stableValueOf = (cardA, cardB) => {
    const [ suitA, suitB ] = [ cardA, cardB ].map((c) => c ? c[0] : -1)
    const [ valueA, valueB ] = [ cardA, cardB ].map(valueOf)
    if (valueA === valueB) {
      return suitA > suitB
    } else {
      return valueA > valueB
    }
  }
  const isSameOrConsecutive = (a, b) => {
    if (!a || !b) return false
    return valueOf(a) === valueOf(b) || (valueOf(a) + 1) === valueOf(b)
  }
  const sortedHand = Array.from(hand).sort(stableValueOf)
  const [first, prev, mid, next, last] = sortedHand
  let run = [mid]
  if (isSameOrConsecutive(prev, mid)) {
    run = [prev, ...run]
    if (isSameOrConsecutive(first, prev)) {
      run = [first, ...run]
    }
  }
  if (isSameOrConsecutive(mid, next)) {
    run = [...run, next]
    if (isSameOrConsecutive(next, last)) {
      run = [...run, last]
    }
  }

  if (uniq(run.map(valueOf)).length < 3) return [] // no runs
  return run
}

export function calcHandPoints (hand) {
  const fifteens = getFifteens(hand)
  const pairs = getPairs(hand)
  const run = getRuns(hand)
  return {fifteens, pairs, run}
}

export function totalHandPoints(hand) {
  if(!hand.length) return 0
  const fifteens = getFifteens(hand)
  const pairs = getPairs(hand)
  const run = getRuns(hand).map(valueOf) // don't care what suits are
  
  const numPairs = sumValues(pairs)
  const numFifteens = sumLengths(fifteens)
  const numDuplicateRuns = R.sum(R.groupWith(R.equals, run).map(a=>a.length).filter((len) => len > 1))
  const multiplier = numDuplicateRuns + 1
  console.log('>>> Here: ', run, multiplier)
  const pointsForPairs = (numPairs * 2) || 0
  const pointsForFifteens = (numFifteens * 2) || 0
  const pointsForRuns = (R.uniq(run).length * multiplier) || 0
  console.log('>>> handy points: ', {pointsForPairs, pointsForRuns, pointsForFifteens})
  return pointsForFifteens + pointsForPairs + pointsForRuns
}

// Sum the length of all arrays in obj
export function sumLengths (obj) {
  return Object.keys(obj).map((k) => {
    return obj[k].length
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

// Sum all values in obj
export function sumValues (obj) {
  return Object.keys(obj).map((k) => {
    return obj[k]
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}
