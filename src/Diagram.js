import React, { Component } from 'react'
import Question from './Question'
import './Diagram.css'

class Diagram extends Component {
  render () {
    if (!this.props.hierarchy) {
      return (<h2>Loading</h2>)
    }

    const keyref = this.props.hierarchy.ref
    
    return (
      <div>
        <Question hierarchy={this.props.hierarchy} />
       
      </div>
    )
  }
}

export default Diagram
