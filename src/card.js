import React, { Component } from 'react'
import { valueOf, getNumberOrFace, getSuit } from './deck'

const Card = (props) => {
  const value = getNumberOrFace(props.card)
  const suit = getSuit(props.card)
  const style = {
    display: 'inline-block',
    border: props.isSelected ? '3px solid green' : 'none',
    height: '200px',
    width: '150px',
    background: `url(../styles/svg-cards/${value}_of_${suit}.svg) no-repeat`,
    backgroundSize: 'contain'
  }
  const clickHandler = props.toggleSelect ? props.toggleSelect : () => {}
  return (
    <div onClick={clickHandler} style={style}/>
  )
}
export default Card