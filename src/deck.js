export function createDeck () {
  let suits = ['H', 'D', 'C', 'S']
  let nested = Array.from(suits, (s) => Array.from({length: 13}, (v, i) => `${s}${++i}`))
  let flattened = nested.reduce((a, c) => a.concat(c), [])
  return flattened
}

export function shuffle (array) {
  let i = 0, j = 0, temp = null
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export function valueOf (card) {
  return typeof card === 'string' ? parseInt(card.slice(1)) : console.error(`cannot find value of ${card}`)
}

export function getNumberOrFace (card) {
  const number = valueOf(card)
  switch (number) {
    case 1:
      return 'ace'
      break
    case 11:
      return 'jack'
      break
    case 12:
      return 'queen'
      break
    case 13:
      return 'king'
    default:
      return number
  }
}

export function getSuit(card){
  switch (card[0]) {
    case 'H':
      return 'hearts'
    case 'D':
      return 'diamonds'
    case 'S':
      return 'spades'
    case 'C':
      return 'clubs'
    default:
      return 'XXXX'
  }
}