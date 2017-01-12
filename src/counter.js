import React from 'react'
import { connect } from 'react-redux'

const Counter = (props) => (
  <div>
    <button onClick={props.increment}>INCREMENT</button>
    <button onClick={props.decrement}>DECREMENT</button>
    {props.counter}
  </div>
)

const mapStateToProps = (state) => state
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({type: 'INCREMENT'}),
  decrement: () => dispatch({type: 'DECREMENT'})
})
export default connect(mapStateToProps, mapDispatchToProps)(Counter)

