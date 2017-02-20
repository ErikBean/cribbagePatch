import React from 'react'
import { getNumberOrFace, getSuit } from '../deck'

const Card = (props) => {
  if (!props.card) return (<span>???</span>)
  const value = getNumberOrFace(props.card)
  const suit = getSuit(props.card)
  const style = {
    display: 'inline-block',
    border: props.isSelected ? '3px solid red' : 'none',
    height: '200px',
    width: '140px',
    boxShadow: props.isOnDeck ? '10px 10px 10px black' : 'none',
    background: `url(../styles/svg-cards/${value}_of_${suit}.svg) no-repeat`,
    backgroundSize: 'contain'
  }
  return (
    <div onClick={props.clickHandler || Function.prototype} style={style} />
  )
}
export default Card
