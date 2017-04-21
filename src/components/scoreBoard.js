import React, { Component } from 'react'
import { getFifteens, getRuns, getPairs, sumLengths, sumValues } from '../points'
import { isEmpty } from 'lodash'

export default class ScoreBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.computePoints = this.computePoints.bind(this)
  }
  componentWillReceiveProps (newProps) {
    if (newProps.cards.length) {
      this.computePoints(newProps.cards)
    }
  }
  componentWillMount () {
    if (!isEmpty(this.props.cards)) {
      this.computePoints(this.props.cards)
    }
  }
  computePoints (cards) {
    const fifteens = getFifteens(cards)
    const pairs = getPairs(cards)
    const runs = getRuns(cards)
    this.setState({
      pairs,
      fifteens,
      runs,
      numPairs: sumValues(pairs),
      numFifteens: sumLengths(fifteens)
      // numRuns: runs.length
    })
  }

  render () {
    return (
      <div>
        <ul>
          <li>
            Fifteens: {this.state.numFifteens}
          </li>
          <li>
            pairs: {this.state.numPairs}
          </li>
          <li>
            runs: {JSON.stringify(this.state.runs)}
          </li>
        </ul>
      </div>
    )
  }
}
