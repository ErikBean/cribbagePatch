import React, { Component } from 'react'
import { size } from 'lodash'

import Card from './card'

export default class Deck extends Component{
  constructor(props){
    super(props)    
    this.state = {
      cutIndex: 0,
    }
    this.changeCutIndex = this.changeCutIndex.bind(this)
  }
  changeCutIndex(e){
    this.setState({
      cutIndex: e.target.value
    })
  }
  render(){
    return (
      <div>
        <span>Cut:</span>
        {!this.props.cut ? <div/> : <Card card={this.props.cut} hidden={!this.props.cut}/>}
        <input type='range' min='0' max='40' onChange={this.changeCutIndex}/>
      </div>
    )
  }
}