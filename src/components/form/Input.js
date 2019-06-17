import React, { Component } from 'react'
import './input.css'

export default class Input extends Component {

  onChange (e) {
    this.props.onChange(this.props.id, e.target.value)
  }

  render () {
    const classes = ['forminput']
    classes.push('forminput--' + this.props.id)
    return (
      <div className={classes.join(' ')}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input 
          type="text" 
          name={this.props.id}
          id={this.props.id}
          defaultValue={this.props.value} 
          onChange={this.onChange.bind(this)}
        />
      </div>
    )
  }
}