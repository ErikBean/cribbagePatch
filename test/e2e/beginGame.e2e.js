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
        
        browser.waitForVisible(selectors.firstCut, 100000, true)
        browser.waitForVisible(selectors.secondCut, 100000, true)
        expect(browser.select('alice').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_1)
        expect(browser.select('bob').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_1)

        browser.select('alice').click(selectors.confirm)
        browser.select('bob').waitForVisible(selectors.firstCut, 1000000)
        expect(browser.select('bob').getText(selectors.prompt)).to.be.equal(messages.CUT_FOR_FIRST_CRIB_2)
        
        browser.select('bob').click(selectors.confirm)
        browser.select('alice').waitForVisible(selectors.secondCut)
        
        expect(browser.select('bob').getText(selectors.prompt)).not.to.be.equal(messages.CUT_FOR_FIRST_CRIB_2)
        // see which of alice vs bob have lower card
        // either alice or bob should see 'Deal the cards!'
    });

});