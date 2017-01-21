import React, { Component } from 'react'
import { valueOf, getNumberOrFace, getSuit } from './deck'

export default class Card extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: false
    }
    this.toggleSelect = this.toggleSelect.bind(this)
  }
  toggleSelect() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    const value = getNumberOrFace(this.props.card)
    const suit = getSuit(this.props.card)
    const style = {
      display: 'inline-block',
      border: this.state.selected ? '3px solid green' : 'none',
      height: '200px',
      width: '150px',
      background: `url(../styles/svg-cards/${value}_of_${suit}.svg) no-repeat`,
      backgroundSize: 'contain'
    }
    return (
      <div onClick={this.toggleSelect} style={style}/>
    )
  }
}
