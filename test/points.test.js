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
    it('should count three-of-a-kind as six points', () => {
      const hand = ["C1"]
      const played = ["B1", "A1", "C1"]
      const peg =  points.getPegPoints(played, hand)
      expect(peg.pairsPoints).to.be(6)
    })
    it('should count 4-of-a-kind', () => {
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
  it('should count runs (in order)', () => {
    const hand = ["C3"]
    const played = ["A1", "B2", "C3"]
    const peg =  points.getPegPoints(played, hand)
    expect(peg.runsPoints).to.be(3)
  })
})
