import React, { Component } from 'react'
import Card from './card'
import ScoreBoard from './scoreBoard'

export default (props) => {
  return (
      <div style={{display: 'inline-block', marginLeft: '100px'}} hidden={props.isHidden}>
        {/* <ScoreBoard cards={props.cards} /> */}
        THE CRIB: <br/>
        {props.visibleCards.map((card) => <Card key={card} card={card} />)}
      </div>
  )
}

