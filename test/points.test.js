/* eslint-env mocha */
var expect = require('expect.js')
var points = require('../src/points')
describe('#calcPegPoints', () => {
  describe('when counting pairs', () => {
    it('should count single pairs', () => {
      const hand = ['A1'] // only care that I played last card
      const played = ['B1', 'A1']
      const peg = points.calcPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(2)
    })
    it('should count 3-of-a-kind as six points', () => {
      const hand = ['C1']
      const played = ['B1', 'A1', 'C1']
      const peg = points.calcPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(6)
    })
    it('should count 4-of-a-kind as twelve points', () => {
      const hand = ['D1']
      const played = ['B1', 'A1', 'C1', 'D1']
      const peg = points.calcPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(12)
    })
  })
  it('should count fifteens', () => {
    const hand = ['A13']
    const played = ['A5', 'A13']
    const peg = points.calcPegPoints(played, hand)
    expect(peg.fifteenPoints).to.be(2)
  })
  describe('when calculating runs', () => {
    const hand = ['F6']
    let played, peg
    it('should count runs (in order)', () => {
      played = ['A13', 'B2', 'C3', 'D4', 'E5', 'F6']
      peg = points.calcPegPoints(played, hand)
      expect(peg.runsPoints).to.be(5)
      const reverse = points.calcPegPoints(played.reverse(), hand)
      expect(reverse.runsPoints).to.be(0) // last card king = not a run

      played = ['D4', 'E5', 'F6']
      peg = points.calcPegPoints(played, hand)
      expect(peg.runsPoints).to.be(3)
    })
    it.only('should count runs (out of order)', () => {
      const hand = ['F6']
      const played = ['A13', 'B4', 'C5', 'D3', 'E2', 'F6']
      const peg = points.calcPegPoints(played, hand)
      expect(peg.runsPoints).to.be(5)
    })
    it('should not count double runs (must be strictly consecutive)', () => {
      const hand = ["S3", "S4", "S5", "S6"]
      const played = ["H6", "S6", "H5", "S4", "H4", "S5"]
      const peg = points.calcPegPoints(played, hand)
      expect(peg.runsPoints).to.be(0)
      expect(peg.pairsPoints).to.be(0)
    })
  })
})

describe('#getFifteens', () => {
  it('should count single 2 card combos', () => {
    const hand = ['B13', 'C5']
    expect(points.getFifteens(hand)['2']).to.have.length(1)
    expect(points.getFifteens(hand)['2'][0]).to.contain(hand[0]) // order doesn't metter
    expect(points.getFifteens(hand)['2'][0]).to.contain(hand[1])
  })
  it('should count multiple 2 card combos', () => {
    let hand = ['B5', 'C5', 'D5', 'E5', 'B11'] // 29 hand!
    expect(points.getFifteens(hand)['2']).to.have.length(4)
    expect(points.getFifteens(hand)['2'][0]).to.contain('B11')
    expect(points.getFifteens(hand)['2'][1]).to.contain('B11')
    expect(points.getFifteens(hand)['2'][2]).to.contain('B11')
    expect(points.getFifteens(hand)['2'][3]).to.contain('B11')

    hand = ['B7', 'C7', 'D7', 'E8', 'B8']
    expect(points.getFifteens(hand)['2']).to.have.length(6)
  })
  it('should count single 3 card combos', () => {
    const hand = ['D3', 'B11', 'C2']
    expect(points.getFifteens(hand)['3']).to.have.length(1)
    expect(points.getFifteens(hand)['3'][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
  it('should count multiple 3 card combos', () => {
    let hand = ['B4', 'C5', 'D5', 'E5', 'B6'] // 45556
    expect(points.getFifteens(hand)['3']).to.have.length(4)
    expect(points.getFifteens(hand)['3']).to.eql([ // order is arbitrary and subject to change
       [ 'B6', 'C5', 'B4' ],
       [ 'B6', 'D5', 'B4' ],
       [ 'B6', 'E5', 'B4' ],
       [ 'E5', 'D5', 'C5' ]
    ])
    hand = ['B5', 'C5', 'D5', 'E5', 'B11']
    expect(points.getFifteens(hand)['3']).to.have.length(4)
    expect(points.getFifteens(hand)['3']).to.eql([ // order is arbitrary and subject to change
       [ 'D5', 'C5', 'B5' ],
       [ 'E5', 'C5', 'B5' ],
       [ 'E5', 'D5', 'B5' ],
       [ 'E5', 'D5', 'C5' ]
    ])
  })
  it('should count single 4 card combos', () => {
    const hand = ['A2', 'B2', 'C1', 'D10']
    expect(points.getFifteens(hand)['4']).to.have.length(1)
    expect(points.getFifteens(hand)['4'][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
  it('should count multiple 4 card combos', () => {
    let hand = ['B3', 'C3', 'D4', 'E5', 'B5'] // 33455
    expect(points.getFifteens(hand)['4']).to.have.length(2)
    expect(points.getFifteens(hand)['4']).to.eql([ // order is arbitrary and subject to change
      [ 'E5', 'D4', 'C3', 'B3' ],
      [ 'B5', 'D4', 'C3', 'B3' ]
    ])
  })
  it('should count single 5 card combos', () => {
    const hand = ['A1', 'D2', 'E10', 'B1', 'C1']
    expect(points.getFifteens(hand)['5']).to.have.length(1)
    expect(points.getFifteens(hand)['5'][0].sort()).to.eql(hand.sort()) // order doesn't matter
  })
})

describe('#getRuns', () => {
  it('should count single runs, however many they contain', () => {
    let hand = ['A1', 'D2', 'E3', 'B5', 'C6']
    expect(points.getRuns(hand)).to.eql(hand.slice(0, 3))
    hand = ['A4', 'D5', 'E6', 'B7', 'C13']
    expect(points.getRuns(hand)).to.eql(hand.slice(0, 4))
    hand = ['A4', 'D5', 'E6', 'B7', 'C8']
    expect(points.getRuns(hand)).to.eql(hand)
  })
  it('should count double runs', () => {
    const hand = ['A10', 'D11', 'E11', 'A12', 'C6']
    expect(points.getRuns(hand)).to.eql(['A10', 'D11', 'E11', 'A12'])
  })
  it('should count double runs (with five cards)', () => {
    const hand = ['A3', 'C2', 'A1', 'A4', 'B2']
    expect(points.getRuns(hand)).to.eql(['A1', 'B2', 'C2', 'A3', 'A4'])
  })
  it('should count triple runs', () => {
    const hand = ['A13', 'B13', 'C13', 'A11', 'B12']
    expect(points.getRuns(hand)).to.eql(['A11', 'B12', 'A13', 'B13', 'C13'])
  })
  it('should count double-double runs', () => {
    const hand = ['A6', 'B4', 'A5', 'A4', 'B6']
    expect(points.getRuns(hand)).to.eql(['A4', 'B4', 'A5', 'A6', 'B6'])
  })
  it('should not count runs with less than three cards', () => {
    let hand = ['A1', 'A2', 'B2', 'C2', 'D2']
    expect(points.getRuns(hand)).to.eql([])
    hand = ['A1', 'A2', 'B4', 'C5', 'D7']
    expect(points.getRuns(hand)).to.eql([])
    hand = ['B2', 'A2', 'C3', 'D3', 'D5']
    expect(points.getRuns(hand)).to.eql([])
  })
})
