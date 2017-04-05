import { valueOf } from './deck'
import { uniq, toPairs, times, last, includes, reverse, first } from 'lodash'

export function valueMaxTen (card) {
  return valueOf(card) > 10 ? 10 : valueOf(card)
}

export function getPegPoints(playedCards, hand) {
  const isLastCardPlayedByMe = includes(hand, last(playedCards))
  if(!isLastCardPlayedByMe) return { pairsPoints: 0, fifteenPoints: 0, runsPoints: 0 }
  const fifteenPoints = sumOf(playedCards) === 15 ? 2 : 0
  
  let pairsPoints = 0;
  const last4 = playedCards.slice(-4).map(valueOf) // can't be more than 4 of a kind
  let pointVal = 0
  let temp = last4.pop()
  while(last4.length){
    pointVal += 2
    if(temp === last4.pop()){
      pairsPoints += pointVal
    } 
  }

  let runsPoints = 0
  if(playedCards.length >= 3){
    let startIndex = -3
    let currentRun = null
    while(!currentRun || currentRun.length < playedCards.length){ // keep slicing backwards from end
      currentRun = playedCards.slice(startIndex).map(valueOf).sort((a, b) => a > b)
      runsPoints = 1 // first card in the run
      let prevVal = currentRun[0]
      for(let i=1; i < currentRun.length; i++){
        const currentVal = currentRun[i]
        if(currentVal === (prevVal + 1)){
          prevVal = currentVal
          runsPoints++
        }
      }
      startIndex--
    }
    if(runsPoints < 3) runsPoints = 0
  }
  return {
    pairsPoints,
    fifteenPoints,
    runsPoints
  }
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

export function sumOf (cards) { // for pegging to 31
  return cards.map(valueMaxTen).reduce((curr, acc) => curr + acc, 0)
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

export function getRuns (hand) {
  const values = uniq(hand.sort((a, b) => valueOf(a) > valueOf(b)))
  const run = []
  for (let i = 1; i < values.length; i++) {
    const thisVal = values[i]
    const lastVal = values[i - 1]
    if (valueOf(thisVal) === valueOf(lastVal + 1)) {
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
      switch (numPairs) {
        case 1:
          multiRuns = multiRuns.concat(times(2, () => run)) // double run
          break
        case 3:
          multiRuns = multiRuns.concat(times(3, () => run)) // triple run
      }
    }
  }
  return multiRuns
}
