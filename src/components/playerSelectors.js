import { createSelector } from 'reselect'
import { difference, last, every, isEmpty, includes } from 'lodash'
import { sumOf, isTooHighToPlay } from '../points'

const isP1Selector = (state, props) => state.meta.isPlayer1 && props.num === '1'
const isP2Selector = (state, props) => state.meta.isPlayer2 && props.num === '2'
const myHandSelector = (state, props) => props.hand
const theirHandSelector = (state, props) => props.theirHand
const myHandWithCutSelector = (state, props) => (props.hand || []).concat(props.cut || [])
const roundSelector = (state, props) => state.round
const playedCardsSelector = (state) => state.playedCards

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
  [myHandSelector, playedCardsSelector],
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
const shouldPeggingRestartSelector = createSelector(
  [myUnplayedSelector, pegCountSelector, hasAGoSelector],
  (myUnplayed=[], pegCount, hasAGo=false) => {
    const cannotPlay = every(myUnplayed, (c) => isTooHighToPlay(c, pegCount))
    return cannotPlay && hasAGo
  }
)

export {
  shouldPeggingRestartSelector,
  myUnplayedSelector,
  didPlayLastSelector,
  pegCountSelector,
  isWaitingForLead,
  isMyTurnSelector,
  playedCardsSelector,
  isCurrentPlayerSelector,
  myHandWithCutSelector,
  hasFirstCribSelector,
  opponentHasFirstCribSelector
}