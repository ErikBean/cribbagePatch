var expect = require('expect.js')
var points = require('../src/points')
describe('#getPegPoints', () => {
  describe('should count pairs/triples/quads', () => {
    it('should count pairs', () => {
      const hand = ["A1"] // only care that I played last card
      const played = ["B1", "A1"]
      const peg =  points.getPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(2)
    })
    it('should count 3-of-a-kind as six points', () => {
      const hand = ["C1"]
      const played = ["B1", "A1", "C1"]
      const peg =  points.getPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(6)
    })
    it('should count 4-of-a-kind as twelve points', () => {
      const hand = ["D1"]
      const played = ["B1", "A1", "C1", "D1"]
      const peg =  points.getPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(12)
    })
  })
  it('should count fifteens', () => {
    const hand = ["A13"]
    const played = ["A5", "A13"]
    const peg =  points.getPegPoints(played, hand)
    expect(peg.fifteenPoints).to.be(2)
  })
  describe('when calculating runs', () => {
    const hand = ["F6"]
    let played, peg
    it('should count runs (in order)', () => {
      played = ["A13", "B2", "C3", "D4", "E5", "F6"]
      peg = points.getPegPoints(played, hand)
      expect(peg.runsPoints).to.be(5)
      const reverse = points.getPegPoints(played.reverse(), hand)
      expect(reverse.runsPoints).to.be(0) // last card king = not a run
      
      played = ["D4", "E5", "F6"]
      peg = points.getPegPoints(played, hand)
      expect(peg.runsPoints).to.be(3)
    })
    it('should count runs (out of order)', () => {
      const hand = ["F6"]
      const played = ["A13", "B4", "C5", "D3", "E2", "F6"]
      const peg = points.getPegPoints(played, hand)
      expect(peg.runsPoints).to.be(5)
    })
  })
})

describe('#getFifteens', () => {
  it('should count single 2 card combos', () => {
    const hand = ["B13", "C5"]
    expect(points.getFifteens(hand)["2"]).to.have.length(1)
    expect(points.getFifteens(hand)["2"][0]).to.contain(hand[0]) // order doesn't metter
    expect(points.getFifteens(hand)["2"][0]).to.contain(hand[1])
  })
  it('should count multiple 2 card combos', () => {
    let hand = ["B5", "C5", "D5", "E5", "B11"] // 29 hand!
    expect(points.getFifteens(hand)["2"]).to.have.length(4)
    expect(points.getFifteens(hand)["2"][0]).to.contain("B11")
    expect(points.getFifteens(hand)["2"][1]).to.contain("B11")
    expect(points.getFifteens(hand)["2"][2]).to.contain("B11")
    expect(points.getFifteens(hand)["2"][3]).to.contain("B11")
    
    hand = ["B7", "C7", "D7", "E8", "B8"]
    expect(points.getFifteens(hand)["2"]).to.have.length(6)
  })
  it('should count single 3 card combos', () => {
    const hand = ["D3","B11","C2"]
    expect(points.getFifteens(hand)["3"]).to.have.length(1)
    expect(points.getFifteens(hand)["3"][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
  it('should count multiple 3 card combos', () => {
    let hand = ["B4", "C5", "D5", "E5", "B6"] // 45556
    expect(points.getFifteens(hand)["3"]).to.have.length(4)
    expect(points.getFifteens(hand)["3"]).to.eql([ // order is arbitrary and subject to change
       [ 'B6', 'C5', 'B4' ],
       [ 'B6', 'D5', 'B4' ],
       [ 'B6', 'E5', 'B4' ],
       [ 'E5', 'D5', 'C5' ]
     ])
     hand = ["B5", "C5", "D5", "E5", "B11"]
     expect(points.getFifteens(hand)["3"]).to.have.length(4)
     expect(points.getFifteens(hand)["3"]).to.eql([ // order is arbitrary and subject to change
       [ 'D5', 'C5', 'B5' ],
       [ 'E5', 'C5', 'B5' ],
       [ 'E5', 'D5', 'B5' ],
       [ 'E5', 'D5', 'C5' ] 
     ])
  })
  it('should count single 4 card combos', () => {
    const hand = ["A2","B2","C1", "D10"]
    expect(points.getFifteens(hand)["4"]).to.have.length(1)
    expect(points.getFifteens(hand)["4"][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
  it('should count multiple 4 card combos', () => {
    let hand = ["B3", "C3", "D4", "E5", "B5"] // 33455
    expect(points.getFifteens(hand)["4"]).to.have.length(2)
    expect(points.getFifteens(hand)["4"]).to.eql([ // order is arbitrary and subject to change
      [ 'E5', 'D4', 'C3', 'B3' ],
      [ 'B5', 'D4', 'C3', 'B3' ]
    ])
  })
  it('should count single 5 card combos', () => {
    const hand = ["A1", "D2","E10","B1","C1"]
    expect(points.getFifteens(hand)["5"]).to.have.length(1)
    expect(points.getFifteens(hand)["5"][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
})

describe('#getRuns', () => {
  it.only('should count single runs, however many they contain', () => {
    const hand = ["A1", "D2","E3","B5","C6"]
    // console.log('>>> Here: ', points.getRuns(hand))
    expect(points.getRuns(hand)).to.eql(["A1", "D2","E3"])
  })
})