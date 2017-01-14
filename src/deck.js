export function createDeck () {
  return Array.from(['H', 'D', 'C', 'S'], (s) => Array.from({length: 13}, (v, i) => `${s}${++i}`)).reduce((a, c) => a.concat(c), [])
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