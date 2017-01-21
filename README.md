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
    deck: [deck.H13, deck.D2, '...' ], // TODO
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
1. combine PushDeck and PushPlayers
2. Combine 'update remote player' functions 
3. Cards should be a set in gun, not a string. That way we can .map() 
4. The deal method is pretty fucking weird 


Rules TODO:

1. DONE! Init deck with 52 cards
2. DONE! choose crib - each player chooses random index for first crib
3. DONE! client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. Each player selects 2 cards for crib
6. player w/o crib selects slot in array to beginGameCut the deck, move card to game.beginGameCut
7. Compute score of hands
8. Player w/o crib has to select card to lead, copy this from hand to playedCards
