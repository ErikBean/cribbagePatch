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
  // bottom diagonal of matrix, same pairs in reversed order:
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
  
  function calcFifteens(otherCards){
    for(let cardX of hand){
      if(isOutsideMatrix(cardX, ...otherCards)) continue // keep matrix sparse
      if(isFifteen(cardX, ...otherCards)){
        console.log('>>> is Fifteen!: ', [cardX, ...otherCards], JSON.stringify(window.fifteens))
        window.fifteens[otherCards.length + 1].push([cardX, ...otherCards])
      }
      if(otherCards.length >= 4) {
        return
      } else{
        calcFifteens([cardX, ...otherCards])
      }
    }
  }
  
  for(let seedCard of hand){
    calcFifteens([seedCard])
  }
  
  // for(let cardA of hand){
  //   for(let cardB of hand){
  //     if(isOutsideMatrix(cardA, cardB)) continue
  //     if(isFifteen(cardA, cardB)) x2.push([cardA, cardB])
  //     for(let cardC of hand){
  //       if(isOutsideMatrix(cardA, cardB, cardC)) continue
  //       if(isFifteen(cardA, cardB, cardC)) x3.push([cardA, cardB, cardC])
  //     }
  //   }
  // }
}