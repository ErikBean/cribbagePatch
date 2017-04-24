import React from 'react'
import { getNumberOrFace, getSuit } from '../deck'

const Card = (props) => {
  if (!props.card) return (<span>???</span>)
  const value = getNumberOrFace(props.card)
  const suit = getSuit(props.card)
  const style = {
    display: 'inline-block',
    border: props.isSelected ? '3px solid red' : '3px solid transparent',
    height: '200px',
    width: '140px',
    boxShadow: props.isOnDeck ? '10px 10px 10px black' : 'none',
    background: `url(../styles/svg-cards/${value}_of_${suit}.svg) no-repeat`,
    backgroundSize: 'contain'
  }

  return (
    <div style={style} onClick={props.onClick} data-qa={`card-${props.card}`}>
      {props.children}
    </div>
  )
}
export default Card
