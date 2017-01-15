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
    beginGameCut: '3H',
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
Refactor TODO:
Cards should be a set in gun, not a string. That way we can .map() 
I should never have to do JSON.parse() or .stringify() 
add redux devtools


Rules TODO:

1. DONE! Init deck with 52 cards
2. DONE! choose crib - each player chooses random index for first crib
3. client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. Each player selects 2 cards for crib
6. player w/o crib selects slot in array to beginGameCut the deck, move card to game.beginGameCut
7. Compute score of hands
8. Player w/o crib has to select card to lead, copy this from hand to playedCards
