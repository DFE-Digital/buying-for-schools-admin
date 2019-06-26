import React, { Component } from 'react'

export default class Select extends Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      value: props.value,
      disabled: !!props.disabled
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
    if (prevProps.disabled !== this.props.disabled) {
      this.setState({ disabled: this.props.disabled })
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
    if (this.props.disabled) {
      classes.push('govuk-form-group--disabled') 
    }
    return (
      <div className={classes.join(' ')}>
        <fieldset className="govuk-fieldset">
          <label className="govuk-label" htmlFor={this.props.id}>{this.props.label}</label>
          
          <select
            name={this.props.id}
            id={this.props.id}
            className="govuk-select" 
            onChange={this.onChange.bind(this)} 
            value={this.state.value}
            disabled={this.state.disabled}
          >
            { this.props.options.map((f, k) => (
              <option value={f.value} key={`${f.value}-${k}`}>{f.label}</option>
            ))}
          </select>
        </fieldset>
      </div>
    )
  }
}

