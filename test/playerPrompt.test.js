/* eslint-env mocha */
var expect = require('expect.js')
var selectors = require('../src/components/playerSelectors')
var messages = require('../src/components/playerMessages')
describe('#playerPromptSelector', () => {
  const promptSelector = selectors.playerPromptSelector
  it('should return tell player to cut first by defualt', () => {
    expect(promptSelector({}, {})).to.be('Cut for first crib #1')
  })
  describe('when a player has > 6 cards', () => {
    describe('when the local player has not discarded', () => {
      it('should return discard message ', () => {
        const state = {
          meta: {
            isPlayer1: true
          },
          firstCut: 'A1',
          secondCut: 'A2'
        }
        const props = {
          hand: [1, 2, 3, 4, 5, 6],
          num: '1'
        }
        expect(promptSelector(state, props)).to.be(messages.DO_DISCARD)
      })
    })
    describe('when remote player has not discarded (and local player has)', () => {
      it('should show waiting message', () => {
        const state = {
          meta: {
            isPlayer1: true
          },
          firstCut: 'A1',
          secondCut: 'A2',
          crib: [1, 2] // crib length indicates waiting
        }
        const props = {
          hand: [1, 2, 3, 4],
          num: '1'
        }
        expect(promptSelector(state, props)).to.be(messages.WAIT_FOR_DISCARD)
      })
    })
  })
  describe('when remote player has discarded', () => {
    it('should tell the player without the crib to cut the deck', () => {
      const state = {
        meta: {
          isPlayer1: true // player1 has crib or round 1
        },
        firstCut: 'A1',
        secondCut: 'A2',
        round: 1,
        crib: [1, 2, 3, 4] // crib length indicates done waiting
      }
      const props = {
        hand: [1, 2, 3, 4],
        num: '1'
      }
      expect(promptSelector(state, props)).to.be(messages.WAIT_FOR_CUT)
      const otherState = {
        meta: {
          isPlayer2: true // player w/o crib cuts
        },
        firstCut: 'A1',
        secondCut: 'A2',
        round: 1,
        crib: [1, 2, 3, 4]
      }
      const otherProps = {
        hand: [1, 2, 3, 4],
        num: '2'
      }
      expect(promptSelector(otherState, otherProps)).to.be(messages.CUT_DECK)
    })
  })
})
