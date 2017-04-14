# cribbagePatch
real time cribbage game

Refactor TODO:
1. Hide scoreboard before hands counted
2. Hide cuts after first crib determination 
3. Need to display scoreboard runs as not JSON array 
4. Fifteens could be computed faster by converting hand to integers FIRST! 
5. BUG: doing first cut doesn't grey out button for second cut
6. 
Rules TODO:

1. DONE! Init deck with 52 cards
2. DONE! choose crib - each player chooses random index for first crib
3. DONE! client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. DONE! Each player selects 2 cards for crib
6. DONE! player w/o crib selects slot in array to beginGameCut the deck, move card to game.beginGameCut
7. DONE! Compute score of hands
8. DONE! Player w/o crib has to select card to lead, copy this from hand to playedCards
9. DONE! Player w/o crib needs to start the pegging
10. Need to know if local player says its a go, not just opponent. ( If I say it's a go && they say it's a go, we know to start over pegging )
11. Points does not account for cutting a jack, or the right jack


State@3-13-17:
{
   "crib":[
      "C1",
      "D1",
      "H2",
      "H3"
   ],
   "cut":"D11",
   "cutIndex":"14",
   "deck":[
      "C5",
      "H3",
      "C10",
      "H2",
      "S11",
      "D5",
      "...etc."
   ],
   "firstCut":"D1",
   "meta":{
      "isPlayer1":false,
      "isPlayer2":true,
      "firstCut":null,
      "secondCut":null,
      "isMyCrib":false
   },
   "player1Hand":[
      "C10",
      "C5",
      "D5",
      "S11"
   ],
   "player2Hand":[
      "C11",
      "C12",
      "D12",
      "H5"
   ],
   "playedCards":[

   ],
   "round":0,
   "secondCut":"S4"
}