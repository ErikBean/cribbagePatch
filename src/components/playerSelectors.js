import { createSelector } from 'reselect'
import { difference, last, every, isEmpty, includes, isNull } from 'lodash'
import { sumOf, isTooHighToPlay, calcPegPoints } from '../points'
import * as messages from './playerMessages'

const isP1Selector = (state, props, meta = state.meta || {}) => meta.isPlayer1 && props.num === '1'
const isP2Selector = (state, props, meta = state.meta || {}) => meta.isPlayer2 && props.num === '2'
const myHandSelector = (state, props) => props.hand
const theirHandSelector = (state, props) => props.theirHand
const playerNumSelector = (state, props) => props.num
const myHandWithCutSelector = (state, props) => (props.hand || []).concat(props.cut || [])
const actionsSelector = (state, props) => props.actions

const firstCutSelector = (state) => state.firstCut
const secondCutSelector = (state) => state.secondCut
const roundSelector = (state, props) => state.round
const playedCardsSelector = (state) => state.playedCards
const cribSelector = (state) => state.crib
const cutSelector = (state) => state.cut
const cutIndexSelector = (state) => state.cutIndex


const needsFirstCutSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut)=>!firstCut && !secondCut
)
const needsSecondCutSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut)=>firstCut && !secondCut
)
const visiblePegCardsSelector = createSelector(
  [playedCardsSelector],
  (played = []) => {
    if(isNull(played)) return []
    const isFirstRound = played.indexOf('RESTART') !== -1
    return isFirstRound ? played : played.slice(played.lastIndexOf('RESTART') + 1)
  }
)

const hasFirstCribSelector = createSelector(
  [isP1Selector, roundSelector],
  (isP1, round) => round<2 && isP1
)
const opponentHasFirstCribSelector = createSelector(
  [isP2Selector, roundSelector],
  (isP2, round) => round<2 && isP2
)
const isCurrentPlayerSelector = createSelector(
  [isP1Selector, isP2Selector],
  (isP1=false, isP2=false) => isP1 || isP2
)
const isWaitingForLead = createSelector(
  [playedCardsSelector, isP1Selector],
  (played=[], isP1=false) => isEmpty(played) && isP1
)
const pegCountSelector = createSelector(
  [playedCardsSelector],
  (played=[]) => sumOf(played)
)

const myUnplayedSelector = createSelector(
  [myHandSelector, visiblePegCardsSelector],
  (myHand=[], played=[]) => difference(myHand, played)
)
const theirUnplayedSelector = createSelector(
  [theirHandSelector, playedCardsSelector],
  (theirHand=[], played=[]) => difference(theirHand, played)
)
const didPlayLastSelector = createSelector(
  [myHandSelector, playedCardsSelector],
  (myHand=[], played=[]) => includes(myHand, last(played))
)
const hasAGoSelector = createSelector(
  [theirUnplayedSelector, pegCountSelector, didPlayLastSelector],
  (theirUnplayed=[], pegCount=0, didPlayLast=false) => {
    const opponentCannotPlay = every(theirUnplayed, (c) => isTooHighToPlay(c, pegCount))
    return opponentCannotPlay && didPlayLast
  }
)
const isMyTurnSelector = createSelector(
  [didPlayLastSelector, hasAGoSelector],
  (didPlayLast, hasAGo) => !didPlayLast || hasAGo
)
const shouldDiscardSelector = createSelector(
  [myHandSelector],
  (myHand) => (myHand || []).length > 4
)
const shouldPeggingRestartSelector = createSelector(
  [myUnplayedSelector, pegCountSelector, hasAGoSelector],
  (myUnplayed=[], pegCount, hasAGo=false) => {
    const cannotPlay = every(myUnplayed, (c) => isTooHighToPlay(c, pegCount))
    return cannotPlay && hasAGo
  }
)
const waitingForCribSelector = createSelector(
  [cribSelector],
  (crib) => (crib || []).length < 4
)
const hasHandSelector = createSelector(
  [myHandSelector],
  (hand) => (hand || []).length > 0
)
const isMyCribSelector = createSelector(
  [roundSelector,playerNumSelector],
  (round=0, playerNum='1') => {
    if(!round && playerNum === '1') return true
    if(!round && playerNum === '2') return false
    return (parseInt(playerNum) + round) % 2 === 0
  }
)
const needsCutSelector = createSelector(
  [isMyCribSelector, cutIndexSelector],
  (isMyCrib, cutIndex)=> {
    return !cutIndex && !isMyCrib
  }
)
const needsFifthSelector = createSelector(
  [cutIndexSelector, cutSelector, isMyCribSelector],
  (cutIndex, cut, isMyCrib)=> !!(cutIndex) && !cut && isMyCrib
)
const waitForFifthSelector = createSelector(
  [cutSelector],
  (cut) => !cut
)
const noCardsPlayedSelector = createSelector(
  [playedCardsSelector],
  (played) => (played || []).length === 0
)

const startGamePromptSelector = createSelector(
  [needsFirstCutSelector, needsSecondCutSelector, isMyCribSelector, hasHandSelector],
  (needsFirstCut, needsSecondCut, isMyCrib, hasHand) => {
    if(needsFirstCut) return messages.CUT_FOR_FIRST_CRIB_1
    else if(needsSecondCut) return messages.CUT_FOR_FIRST_CRIB_2
    else if(isMyCrib && !hasHand) return messages.DEAL_FIRST_ROUND
    else if(!isMyCrib && !hasHand) return messages.WAIT_FOR_DEAL_FIRST_ROUND
    else return ''
  }
)

const prePegPromptSelector = createSelector(
  [shouldDiscardSelector, waitingForCribSelector, needsCutSelector, needsFifthSelector, waitForFifthSelector],
  (shouldDiscard, waitingForCrib, needsCut, needsFifth, waitForFifth) => {
    if(shouldDiscard) return messages.DO_DISCARD
    else if(waitingForCrib) return messages.WAIT_FOR_DISCARD
    else if(needsCut) return messages.CUT_DECK
    else if(needsFifth) return messages.CUT_FIFTH_CARD
    else if(waitForFifth) return messages.WAIT_FOR_CUT
    else return ''
  }
)

const peggingPromptSelector = createSelector(
  [noCardsPlayedSelector, isMyCribSelector, playedCardsSelector, myHandSelector],
  (noCardsPlayed, isMyCrib, playedCards, myHand) => {
    const {runsPoints, fifteenPoints, pairsPoints} = calcPegPoints(playedCards, myHand)
    if(noCardsPlayed){
      if(isMyCrib) return messages.WAIT_FOR_LEAD_PEGGING
      return messages.LEAD_PEGGING
    } else if(runsPoints || fifteenPoints || pairsPoints){
      let messages = []
      if (fifteenPoints) {
        messages.push('fifteen for two')
      }
      switch (pairsPoints) {
        case 2:
          messages.push('a pair for two')
          break
        case 6:
          messages.push('three-of-a-kind for six')
          break
        case 12:
          messages.push('four-of-a-kind for tweleve')
          break
      }
      if(runsPoints){
        messages.push(`a run of ${runsPoints}`)
      }
      return `You got ${messages.join(' and ')}!`
    } else return ''
  }
)
const playerPromptSelector = createSelector(
  [startGamePromptSelector, prePegPromptSelector, peggingPromptSelector],
  (startGamePrompt, prePegPrompt, peggingPrompt) => {
    return startGamePrompt || prePegPrompt || peggingPrompt || 'I dont know what to say'
  }
)

const playerActionSelector = createSelector(
  [playerPromptSelector, actionsSelector],
  (prompt, actions) =>{
    switch(prompt){ // TODO: move first 2 someplace else? Player not assigned yet 
      case messages.CUT_FOR_FIRST_CRIB_1:
        return actions.doFirstCut
      case messages.CUT_FOR_FIRST_CRIB_2:
        return actions.doSecondCut
      case messages.DEAL_FIRST_ROUND:
        return actions.deal
      case messages.DO_DISCARD:
        return actions.discard
      case messages.CUT_DECK:
        return actions.selectCutIndex
      case messages.CUT_FIFTH_CARD:
        return actions.cutDeck
      default:
        return null
    }
  }
)

export {
  isCurrentPlayerSelector,
  isMyTurnSelector,
  isWaitingForLead,
  myHandWithCutSelector,
  myUnplayedSelector,
  shouldPeggingRestartSelector,
  pegCountSelector,
  playedCardsSelector,
  playerActionSelector,
  playerPromptSelector
}