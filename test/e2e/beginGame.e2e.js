// import expect from 'expect.js'
import * as messages from '../../src/components/playerMessages'
console.log('>>> EXPECT: : ', expect)
const selectors = {
  confirm: '[data-qa="confirm-prompt"]',
  prompt: '[data-qa="player-prompt"]',
  firstCut: '[data-qa="first-cut"]',
  secondCut: '[data-qa="second-cut"]',
  restartButton: '[data-qa="restart-button"]',
  card(id){
    return `[data-qa="card-${id}"]`
  }
}

describe('Starting the game', function() {
    it('should not have cards showing to start, and should prompt to cut for first crib', function () {
        browser.url('/');
        browser.pause(1000) //wait for page load
        browser.click(selectors.restartButton)
        browser.refresh()
        
         // not good enough for mid-game, because already hidden
        browser.waitForVisible(selectors.firstCut, 100000, true)
        browser.waitForVisible(selectors.secondCut, 100000, true)
        expect(browser.select('alice').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_1)
        expect(browser.select('bob').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_1)

        browser.select('alice').click(selectors.confirm) //alice does first cut
        browser.select('bob').waitForVisible(selectors.firstCut, 1000000)
        expect(browser.select('bob').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_2)
        
        browser.select('bob').click(selectors.confirm) //bob does second cut
        browser.waitForVisible(selectors.secondCut) //both alice and bob need to see both cuts before proceeding
        
        expect(browser.select('bob').getText(selectors.prompt)).not.to.be.equal(messages.CUT_FOR_FIRST_CRIB_2)
        
        //this is not part of this test description: 
        const isPlayer1 = (player) => {
          const firstCut = browser.select(player).getAttribute(selectors.firstCut, 'data-qa-card-value')
          const secondCut = browser.select(player).getAttribute(selectors.secondCut, 'data-qa-card-value')
          const myCut = player === 'alice' ? firstCut : secondCut
          const theirCut = player === 'alice' ? secondCut : firstCut
          if(parseInt(myCut.slice(1)) < parseInt(theirCut.slice(1))){
            return true
          } else if(parseInt(myCut.slice(1)) > parseInt(theirCut.slice(1))) {
            return false
          }
        }
        const player1 = isPlayer1('alice') ? browser.select('alice') : browser.select('bob')
        const player2 = isPlayer1('bob') ? browser.select('alice') : browser.select('bob')
        expect(player1.getText(selectors.prompt)).to.be.equal(messages.DEAL_FIRST_ROUND)
        expect(player2.getText(selectors.prompt)).to.be.equal(messages.WAIT_FOR_DEAL_FIRST_ROUND)        
    });

});