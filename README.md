# cribbagePatch
real time cribbage game

Redux should look something like... 
```javascript
{
  cards: {
    H1: new Symbol('H1')
    H2: new Symbol('H2')
  },
  game:{
    deck: [deck.H13, deck.D2, '...' ],
    cut: '3H',
    crib: 'localPlayer' || true,
    playedCards: ['H1', 'C13', '...'],
    crib: []
  },
  localPlayer:{
    hand: ['C10', 'D12', '...' ], // should I remove things from here before the end of the round? 
    totalPoints: 43
  },
  remotePlayer: 'Same  structure as local'
}
```
TODO:

1. Init deck with 52 cards
2. choose crib - each player chooses random index for first crib
3. client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. Each player selects 2 cards for crib
6. player w/o crib selects slot in array to cut the deck, move card to game.cut
7. Compute score of hands
8. Player w/o crib has to select card to lead, copy this from hand to playedCards
