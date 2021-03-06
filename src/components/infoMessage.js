import React, { Component } from 'react'
import { isNull, isUndefined } from 'lodash'
export class OkButton extends Component { // export for testing
  constructor (props) {
    super(props)
    this.state = {
      wasClicked: false
    }
    this.onClick = this.onClick.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.text !== this.props.text) {
      this.setState({wasClicked: false})
    }
  }
  onClick () {
    if (this.state.wasClicked) return
    this.setState({wasClicked: true})
    this.props.clickAction()
  }
  render () {
    const buttonStyle = {
      backgroundColor: this.state.wasClicked ? 'lightgrey' : 'blue',
      borderRadius: '99px',
      padding: '0 20px',
      marginLeft: '20px'
    }
    const hasNoAction = !this.props.clickAction
    return (
      <span hidden={hasNoAction} style={buttonStyle} onClick={this.onClick} data-qa="confirm-prompt">
        OK
      </span>
    )
  }
}
const bannerStyle = {
  position: 'fixed',
  bottom: '0',
  left: '0',
  height: '30px',
  backgroundColor: 'green',
  color: 'white',
  padding: '0 50px',
  lineHeight: '30px',
  cursor: 'pointer',
  zIndex: '100'
}
export default (props) => {
  return (
  <div style={bannerStyle}>
    <span data-qa="player-prompt">
      {props.text}
    </span>
    {props.text === 'Cut the Deck!' ? props.children : null}
    <OkButton text={props.text} clickAction={props.onConfirm || null} />
  </div>
)}
