# cribbagePatch
real time cribbage game

Redux should look something like... 
```javascript
{
  meta: {
    firstCut: 'H1'
    secondCut: 'H2'
  }
  cards: {
    H1: new Symbol('H1')
    H2: new Symbol('H2')
  },
  game:{
    deck: ['H5', 'C2', '...'], // TODO
    playedCards: ['H1', 'C13', '...'],
  },
  player1:{
    beginGameCut: '3H',
    hand: ['C10', 'D12', '...' ], // should I remove things from here before the end of the round? 
    crib: []
    totalPoints: 43
  },
  player2: 'Same  structure as player1'
}
```
Refactor TODO:
1. Points does not account for cutting a jack, or the right jack
2. 
3. 
4. Fifteens could be computed faster by converting hand to integers FIRST! 

Rules TODO:

1. DONE! Init deck with 52 cards
2. DONE! choose crib - each player chooses random index for first crib
3. DONE! client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. DONE! Each player selects 2 cards for crib
6. DONE! player w/o crib selects slot in array to beginGameCut the deck, move card to game.beginGameCut
7. DONE! Compute score of hands
8. Player w/o crib has to select card to lead, copy this from hand to playedCards
