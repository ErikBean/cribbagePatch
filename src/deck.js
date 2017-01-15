export function createDeck () {
  let suits = ['H', 'D', 'C', 'S']
  let nested = Array.from(suits, (s) => Array.from({length: 13}, (v, i) => `${s}${++i}`))
  let flattened = nested.reduce((a, c) => a.concat(c), [])
  return flattened.reduce(function(acc, cur, i) {
    acc[i] = cur;
    return acc;
  }, {});
}

export function shuffle (obj) {
  let i = 0, j = 0, temp = null
  for (i = Object.keys(obj).length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = obj[i]
    obj[i] = obj[j]
    obj[j] = temp
  }
  return obj
}

export function valueOf (card) {
  return typeof card === 'string' ? parseInt(card.slice(1)) : -1
}