import React, { Component } from 'react'
import { includes } from 'lodash'
import Card from './card'
import ScoreBoard from './scoreBoard'
import { sumOf } from '../points'

export default class Crib extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isHidden: true
    }
    this.isFromMe = this.isFromMe.bind(this)
  }
  isFromMe (card) {
    const fromP1 = (this.props.isPlayer1 && includes(this.props.player1Hand, card))
    const fromP2 = (this.props.isPlayer2 && includes(this.props.player2Hand, card))
    return fromP1 || fromP2
  }
  render () {
    const offsetStyle = (card) => ({
      position: 'relative',
      display: 'inline-block',
      top: this.isFromMe(card) ? '50px' : '',
      bottom: this.isFromMe(card) ? '' : '50px'
    })
    const fontStyle = {// TODO: Add this to text
      color: 'blue',
      fontFamily: 'sans-serif',
      fontSize: '72px',
      padding: '50px',
      fontweight: 'bold'
    }
    return (
      <div hidden={this.state.isHidden}>
        <ScoreBoard cards={this.props.pegCards} />
        {this.props.playedCards.map((card) => {
          return (
            <span key={card} style={offsetStyle(card)}>
              <Card card={card} pegCount={sumOf(this.props.playedCards)}>
                <span style={fontStyle}>{sumOf(this.props.playedCards)}</span>
              </Card>
            </span>
          )
        })}
      </div>
    )
  }
}

