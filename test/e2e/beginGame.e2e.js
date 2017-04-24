import expect from 'expect.js'

const selectors = {
  confirm: '[data-qa="confirm-prompt"]',
  prompt: '[data-qa="player-prompt"]',
  firstCut: '[data-qa="first-cut"]',
  secondCut: '[data-qa="second-cut"]',
  card(id){
    return `[data-qa="card-${id}"]`
  }
}

describe('Starting the game', function() {
  beforeEach(() => {
    browser.url('/');
    const initState = function(){
      return window.restart()
    }
    browser.select('alice').execute(initState)
    browser.select('bob').execute(initState)
  })
    it('should not have cards showing to start, and should prompt to cut for first crib', function () {
        browser.select('alice').click(selectors.confirm)
        
        browser.select('bob').waitForVisible(selectors.firstCut, 1000000)
        browser.select('bob').click(selectors.confirm)
        browser.select('alice').waitForVisible(selectors.secondCut)
        
        // see which of alice vs bob have lower card
        // either alice or bob should see 'Deal the cards!'
    });

});