# cribbagePatch
realtime cribbage game

Refactor TODO:
1. Hide scoreboard before hands counted
2. BUG: refreshing page allows hand to be counted twice
3. Need to display scoreboard runs as not JSON array 
4. Fifteens could be computed faster by converting hand to integers FIRST! 
5. 
6. 
7. 
8.  

Rules TODO / Roadmap:
1. Hide/grey out previously pegged cards after first pegging round
2. DONE! Show both hands after pegging over
3. Show total hand points, and add to score DONE!
5. Reveal the crib, and show the score
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