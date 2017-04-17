import React, { Component } from 'react'

class OkButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      wasClicked: false
    }
    this.onClick = this.onClick.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.clickAction !== this.props.clickAction) {
      this.setState({wasClicked: false})
    }
  }
  onClick () {
    if(this.state.wasClicked) return
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
    return (
      <span hidden={!this.props.clickAction} style={buttonStyle} onClick={this.onClick}>
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
export default (props) => (
  <div style={bannerStyle}>
    {props.text}
    {props.text === 'Cut the Deck!' ? props.children : null}
    <OkButton clickAction={props.onConfirm} />
  </div>
)
