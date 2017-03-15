import React from 'react'
const style = {
  position: 'fixed',
  bottom: '0',
  left: '0',
  height:'30px',
  backgroundColor: 'green',
  color: 'white',
  padding: '0 50px',
  lineHeight: '30px'
}
export default (props) => (
  <div style={style}>{props.foo}</div>
)
