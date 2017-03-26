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
