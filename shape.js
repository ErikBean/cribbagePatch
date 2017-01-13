
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
