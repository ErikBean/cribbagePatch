import React, { Component } from 'react'
import Card from './card'
import ScoreBoard from './scoreBoard'

export default (props) => {
  return (
      <div style={{display: props.isHidden ? 'none' : 'inline-block', marginLeft: '100px'}} >
        {/* <ScoreBoard cards={props.cards} /> */}
        THE CRIB: <br/>
        {props.visibleCards.map((card) => <Card key={card} card={card} />)}
      </div>
  )
}

