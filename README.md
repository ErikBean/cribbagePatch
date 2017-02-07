# cribbagePatch
real time cribbage game

Refactor TODO:
0. BUG: peg card starts inf loop cycle
1. Points does not account for cutting a jack, or the right jack
2. hand.length is not good enough for hiding things after pegging done
3. can look in localStorage on page load to assign players, too
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
