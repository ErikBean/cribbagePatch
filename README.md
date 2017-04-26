# cribbagePatch
realtime cribbage game

Refactor TODO:
1. 
2. Player could figure out myHand/theirHand props just from num and state in selectors
3. Need to display scoreboard runs as not JSON array 
4. 
5. Need better way to deploy; webpack prod config or something
6. 
7. Hide scoreboard before hands counted ?
8. Hide/grey out previously pegged cards after first pegging round ?

Rules TODO / Roadmap:
1. Need a way to tell other player to show opponent's crib. Just wait for opp points to update?
2. 
3. 
5. 
6. Need a way to goto the next round
7. New prompt for P2 dealing the cards, (round other than first)
8. 
9. TUTORIAL MODE (shoutout to matt carnovale)
10. Points does not account for cutting a jack, or the right jack
11. Points should count flushes of 4-5 in hand, or 5 in crib


State@4-22-17:
{
  "crib":[
   "H9",
   "S1",
   "S2",
   "S3"
  ],
  "cut":"C3",
  "cutIndex":"22",
  "deck":[
     "H10",
     "D11",
     "H9",
     "H12",
     "D4",
     "...",
  ],
  "firstCut":"D13",
  "meta":{
     "isPlayer1":true,
     "isPlayer2":false
  },
  "player1Hand":[
     "D11",
     "D4",
     "H10",
     "H12"
  ],
  "player2Hand":[
     "C11",
     "D1",
     "H11",
     "H5"
  ],
  "player1Points":7,
  "player2Points":8,
  "playedCards":[
     "H5",
     "H12",
     "H11",
     "D4",
     "D1",
     "D11",
     "C11",
     "H10"
  ],
  "pastPlayedCardsIndex":0,
  "round":1,
  "secondCut":"H5"
}