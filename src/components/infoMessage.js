import React from 'react'
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
const buttonStyle = {
  backgroundColor: 'blue',
  borderRadius: '99px',
  padding: '0 20px',
  marginLeft: '20px'
}
export default (props) => (
  <div style={bannerStyle}>
    {props.text}
    {props.text === 'Cut the Deck!' ? props.children : null}
    <span hidden={!props.onConfirm} style={buttonStyle} onClick={props.onConfirm}>
      OK
    </span>
  </div>
)
