import { createSelector } from 'reselect'
import { difference, last, every, isEmpty, includes, isNull } from 'lodash'
import { sumOf, isTooHighToPlay } from '../points'
import * as messages from './playerMessages'

const isP1Selector = (state, props, meta = state.meta || {}) => meta.isPlayer1 && props.num === '1'
const isP2Selector = (state, props, meta = state.meta || {}) => meta.isPlayer2 && props.num === '2'
const myHandSelector = (state, props) => props.hand
const theirHandSelector = (state, props) => props.theirHand
const playerNumSelector = (state, props) => props.num
const myHandWithCutSelector = (state, props) => (props.hand || []).concat(props.cut || [])
const roundSelector = (state, props) => state.round
const playedCardsSelector = (state) => state.playedCards
const cribSelector = (state) => state.crib
const cutSelector = (state) => state.cut
const cutIndexSelector = (state) => state.cutIndex

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
  (round=0, playerNum=1) => {
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

const playerPromptSelector = createSelector(
  [isCurrentPlayerSelector, hasHandSelector, shouldDiscardSelector, waitingForCribSelector, needsCutSelector, needsFifthSelector, waitForFifthSelector, noCardsPlayedSelector, isMyCribSelector],
  (isCurrentPlayer=false, hasHand=false, shouldDiscard=false, waitingForCrib=false, needsCut=false, needsToCutFifth=false, waitForFifth=false, nonePlayed=false, isMyCrib=false) => {
    // console.log('>>> Here: ', {hasHand, isCurrentPlayer, shouldDiscard, waitingForCrib, needsCut})
    if(!isCurrentPlayer) return 'early return'
    else if(isMyCrib && !hasHand) return messages.DEAL_FIRST_ROUND
    else if(!isMyCrib && !hasHand) return messages.WAIT_FOR_DEAL_FIRST_ROUND
    else if(shouldDiscard) return messages.DO_DISCARD
    else if(waitingForCrib) return messages.WAIT_FOR_DISCARD
    else if(needsCut) return messages.CUT_DECK
    else if(needsToCutFifth) return messages.CUT_FIFTH_CARD
    else if(waitForFifth) return messages.WAIT_FOR_CUT
    else if(nonePlayed){
      if(isMyCrib) return messages.WAIT_FOR_LEAD_PEGGING
      return messages.LEAD_PEGGING
    }
  }
)


export {
  shouldPeggingRestartSelector,
  myUnplayedSelector,
  pegCountSelector,
  isWaitingForLead,
  isMyTurnSelector,
  playedCardsSelector,
  isCurrentPlayerSelector,
  myHandWithCutSelector,
  playerPromptSelector
}