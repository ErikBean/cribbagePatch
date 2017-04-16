import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createDeck, shuffle } from '../deck'
import { CUT_FOR_FIRST_CRIB_2 } from './playerMessages'

import Card from './card'

class Deck extends Component {
  constructor (props) {
    super(props)
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.firstCut && !nextProps.secondCut && !nextProps.hasFirstCut){
      this.props.showMessage(CUT_FOR_FIRST_CRIB_2, this.props.doSecondCut)
    }
    if (nextProps.firstCut && nextProps.secondCut && this.props.hasFirstCut && !this.props.playerAssigned) {
      const myCut = nextProps.firstCut
      const theirCut = nextProps.secondCut
      this.props.assignPlayer(myCut, theirCut)
    }
  }

  render () {
    return (
      <div>
        <div hidden={this.props.round > 0}>
          <Card card={this.props.firstCut} />
          <Card card={this.props.secondCut} />
        </div>
        <div hidden={!this.props.cut}>
          <Card card={this.props.cut} isOnDeck />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  const { deck, cut, firstCut, secondCut, round } = state
  return {
    firstCut,
    secondCut,
    deck,
    cut,
    round
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    cutForFirstCrib: (isFirst, cut) => dispatch({
      type: isFirst ? `FIRST_CUT` : 'SECOND_CUT',
      payload: cut
    }),
    updateDeck: (deck) => dispatch({type: 'UPDATE_DECK', payload: deck})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deck)

