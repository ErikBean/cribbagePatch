import React from 'react'
import Card from './card'

const Hand = (props) => (
  <div>
    {props.hand.map((card) =>{
      return <Card card={card} key={card}/>
    })}
  </div>
)
export default Hand