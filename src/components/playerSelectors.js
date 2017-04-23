import { createSelector } from 'reselect'
import { difference, last, every, isEmpty, includes, isNull } from 'lodash'
import { sumOf, isTooHighToPlay, calcPegPoints, totalHandPoints } from '../points'
import * as messages from './playerMessages'

const isP1Selector = (state, props, meta = state.meta || {}) => meta.isPlayer1 && props.num === '1'
const isP2Selector = (state, props, meta = state.meta || {}) => meta.isPlayer2 && props.num === '2'
const myHandSelector = (state, props) => props.hand
const theirHandSelector = (state, props) => props.theirHand
const playerNumSelector = (state, props) => props.num
const myHandWithCutSelector = (state, props) => (props.hand || []).concat(props.cut || [])
const actionsSelector = (state, props) => props.actions
const isCribHiddenSelector = (state, props) => props.isCribHidden

const firstCutSelector = (state) => state.firstCut
const secondCutSelector = (state) => state.secondCut
const roundSelector = (state, props) => state.round
const playedCardsSelector = (state) => state.playedCards || []
const cribSelector = (state) => state.crib
const cutSelector = (state) => state.cut
const cutIndexSelector = (state) => state.cutIndex
const pastPlayedCardsIndexSelector = (state) => state.pastPlayedCardsIndex

const needsFirstCutSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut) => !firstCut && !secondCut
)
const needsSecondCutSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut) => firstCut && !secondCut
)

const isCurrentPlayerSelector = createSelector(
  [isP1Selector, isP2Selector],
  (isP1 = false, isP2 = false) => isP1 || isP2
)
const isWaitingForLead = createSelector(
  [playedCardsSelector, isP1Selector],
  (played = [], isP1 = false) => isEmpty(played) && isP1
)
const pegCountSelector = createSelector(
  [playedCardsSelector, pastPlayedCardsIndexSelector],
  (played = [], index) => sumOf((played || []).slice((index || 0)))
)

const myUnplayedSelector = createSelector(
  [myHandSelector, playedCardsSelector],
  (myHand = [], played = []) => difference(myHand, played)
)
const theirUnplayedSelector = createSelector(
  [theirHandSelector, playedCardsSelector],
  (theirHand = [], played = []) => difference(theirHand, played)
)
const didPlayLastSelector = createSelector(
  [myHandSelector, playedCardsSelector],
  (myHand = [], played = []) => includes(myHand, last(played))
)
const hasAGoSelector = createSelector(
  [theirUnplayedSelector, pegCountSelector, didPlayLastSelector],
  (theirUnplayed = [], pegCount = 0, didPlayLast = false) => {
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
  [myUnplayedSelector, pegCountSelector, hasAGoSelector, playedCardsSelector, pastPlayedCardsIndexSelector],
  (myUnplayed = [], pegCount, hasAGo = false, playedCards, pastPlayedCardsIndex = 0) => {
    const hasPlayedCardsThisRound = (playedCards || []).length !== pastPlayedCardsIndex
    const cannotPlay = every(myUnplayed, (c) => isTooHighToPlay(c, pegCount))
    return hasPlayedCardsThisRound && cannotPlay && hasAGo // player with go responsible for restarting pegging
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
  [roundSelector, playerNumSelector],
  (round = 0, playerNum = '1') => {
    if (!round && playerNum === '1') return true
    if (!round && playerNum === '2') return false
    return (parseInt(playerNum) + round) % 2 === 0
  }
)
const needsCutSelector = createSelector(
  [isMyCribSelector, cutIndexSelector],
  (isMyCrib, cutIndex) => {
    return !cutIndex && !isMyCrib
  }
)
const needsFifthSelector = createSelector(
  [cutIndexSelector, cutSelector, isMyCribSelector],
  (cutIndex, cut, isMyCrib) => !!(cutIndex) && !cut && isMyCrib
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
    if (needsFirstCut) return messages.CUT_FOR_FIRST_CRIB_1
    else if (needsSecondCut) return messages.CUT_FOR_FIRST_CRIB_2
    else if (isMyCrib && !hasHand) return messages.DEAL_FIRST_ROUND
    else if (!isMyCrib && !hasHand) return messages.WAIT_FOR_DEAL_FIRST_ROUND
    else return ''
  }
)

const cutDeckPromptSelector = createSelector(
  [shouldDiscardSelector, waitingForCribSelector, needsCutSelector, needsFifthSelector, waitForFifthSelector],
  (shouldDiscard, waitingForCrib, needsCut, needsFifth, waitForFifth) => {
    if (shouldDiscard) return messages.DO_DISCARD
    else if (waitingForCrib) return messages.WAIT_FOR_DISCARD
    else if (needsCut) return messages.CUT_DECK
    else if (needsFifth) return messages.CUT_FIFTH_CARD
    else if (waitForFifth) return messages.WAIT_FOR_CUT
    else return ''
  }
)


const isDonePeggingSelector = createSelector(
  [pastPlayedCardsIndexSelector, playedCardsSelector],
  (pastPlayedCardsIndex, playedCards) => (pastPlayedCardsIndex === 0 && (playedCards || []).length === 8)
)
const playPegCardPromptSelector = createSelector(
  [isMyTurnSelector, isDonePeggingSelector],
  (isMyTurn, isDonePegging) => {
    if(isDonePegging) return ''
    return isMyTurn ? 'Click a card to play' : 'Waiting for opponent to play a card'
  }
)

const pegPointsPromptSelector = createSelector(
  [noCardsPlayedSelector, isMyCribSelector, playedCardsSelector, myHandSelector, hasAGoSelector, pegCountSelector, isDonePeggingSelector],
  (noCardsPlayed, isMyCrib, playedCards, myHand, hasAGo, pegCount, isDonePegging) => {
    const {runsPoints, fifteenPoints, pairsPoints} = calcPegPoints(playedCards, myHand)
    if(isDonePegging) return ''
    if (noCardsPlayed) {
      if (isMyCrib) return messages.WAIT_FOR_LEAD_PEGGING
      return messages.LEAD_PEGGING
    } else if (runsPoints || fifteenPoints || pairsPoints || hasAGo) {
      let joinMessages = []
      if (fifteenPoints) {
        joinMessages.push('fifteen for two')
      }
      switch (pairsPoints) {
        case 2:
          joinMessages.push('a pair for two')
          break
        case 6:
          joinMessages.push('three-of-a-kind for six')
          break
        case 12:
          joinMessages.push('four-of-a-kind for tweleve')
          break
      }
      if (runsPoints) {
        joinMessages.push(`a run of ${runsPoints}`)
      }
      if (hasAGo) {
        pegCount === 31 ? joinMessages.push(messages.HAS_DOUBLE_GO) : joinMessages.push(messages.HAS_NORMAL_GO)
      }
      return `You got ${joinMessages.join(' and ')}!`
    } else return ''
  }
)

const handInfoSelector = createSelector(
  [myHandWithCutSelector, roundSelector],
  (hand,round)=>JSON.stringify({round, hand})
)
const wasHandCountedSelector = createSelector(
  [handInfoSelector],
  (handInfo) => {
    return handInfo === window.localStorage.getItem('cribbagePatchLastHand')
  }
)

const handPointsSelector = createSelector(
  [myHandWithCutSelector],
  (myHand) => totalHandPoints(myHand)
)

const handPointsPromptSelector = createSelector(
  [handPointsSelector, isDonePeggingSelector, wasHandCountedSelector],
  (handPoints, isDonePegging, wasHandCounted) =>  {
    if(isDonePegging && !wasHandCounted){
      return `${messages.HAND_POINTS}: ${handPoints}. Take points:`
    } else return ''
  }
)

const countCribPromptSelector = createSelector(
  [isMyCribSelector, wasHandCountedSelector],
  (isMyCrib, wasHandCounted) => {
    if(isMyCrib && wasHandCounted){
      return messages.COUNT_CRIB
    } else if(wasHandCounted){
      return messages.WAIT_FOR_COUNT_CRIB
    } else return ''
  }
)


const countHandActionSelector = createSelector(
  [actionsSelector, playerNumSelector, handPointsSelector, handInfoSelector],
  (actions, playerNum, handPoints, handInfo)=> {
    return () => {
      window.localStorage.setItem('cribbagePatchLastHand', handInfo)
      actions.countHand(playerNum, handPoints)
    }
  }
)

const playerPromptSelector = createSelector(
  [startGamePromptSelector, cutDeckPromptSelector, pegPointsPromptSelector, playPegCardPromptSelector, handPointsPromptSelector, countCribPromptSelector],
  (startGamePrompt, cutDeckPrompt, pegPointsPrompt, playPegCardPrompt, handPointsPrompt, countCribPrompt) => {
    return startGamePrompt ||
      cutDeckPrompt ||
      pegPointsPrompt ||
      playPegCardPrompt ||
      handPointsPrompt ||
      countCribPrompt ||
      // TODO: put messages / prompt to deal new hand here
      'I dont know what to say'
  }
)


const playerActionSelector = createSelector(
  [playerPromptSelector, actionsSelector, playerNumSelector, countHandActionSelector, wasHandCountedSelector],
  (prompt, actions, playerNum, countHandAction, wasHandCounted) => {
    switch (prompt) {
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
      case messages.COUNT_CRIB:
        return actions.flipCrib
      default:
        break
    }
    const hasNormalGo = prompt.indexOf(messages.HAS_NORMAL_GO) !== -1
    const hasDoubleGo = prompt.indexOf(messages.HAS_NORMAL_GO) !== -1
    if (hasNormalGo) {
      return () => actions.advanceRound(1, parseInt(playerNum))
    } else if (hasDoubleGo){
      return () => actions.advanceRound(2, parseInt(playerNum))
    }
    const isShowingPoints = prompt.indexOf(messages.HAND_POINTS) !== -1
    if(isShowingPoints){
      return wasHandCounted ? null : countHandAction
    }
    return null
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
