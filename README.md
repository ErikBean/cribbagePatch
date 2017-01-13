# cribbagePatch
real time cribbage game

TODO:

1. Init deck with 52 cards
2. choose crib - each player chooses random index for first crib
3. client machine with lower number randomizes deck Array, and 
remove 6 cards from top into hand array for each player, push all this to gun
5. Each player selects 2 cards for crib
6. player w/o crib selects slot in array to cut the deck, move card to game.cut
7. Compute score of hands
8. Player w/o crib has to select card to lead, copy this from hand to playedCards
