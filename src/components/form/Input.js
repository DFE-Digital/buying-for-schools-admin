import React, { Component } from 'react'

export default class Input extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value || ''
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
  }

  onChange (e) {
    this.setState({ value: e.target.value })
    this.props.onChange(this.props.id, e.target.value)
  }

  render () {
    const classes = ['govuk-form-group']
    classes.push('govuk-form-group--' + this.props.id)
    if (this.props.error) {
      classes.push('govuk-form-group--error')
    }
    return (
      <div className={classes.join(' ')}>
        <fieldset className="govuk-fieldset">
          <label className="govuk-label" htmlFor={this.props.id}>{this.props.label}</label>
          
          <input 
            type="text" 
            name={this.props.id}
            id={this.props.id}
            className="govuk-input"
            value={this.state.value} 
            onChange={this.onChange.bind(this)}
          />
        </fieldset>
      </div>
    )
  }
}

