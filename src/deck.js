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
  return typeof card === 'string' ? parseInt(card.slice(1)) : -1
}