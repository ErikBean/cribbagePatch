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
9. 
10. Points does not account for cutting a jack, or the right jack
11. Points should count flushes of 4-5 in hand, or 5 in crib


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