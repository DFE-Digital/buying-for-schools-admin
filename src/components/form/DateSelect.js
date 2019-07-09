import React, { Component } from 'react'

export default class DateSelect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value || '',
      year: '',
      month: '',
      day: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
  }

  onChange (id, e) {
    console.log(id, e.target.value)
    // this.setState({ value: e.target.value })
    // this.props.onChange(this.props.id, e.target.value)
    const n = Number(e.target.value)
    const newState = {}
    newState[id] = e.target.value
    
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


        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset" role="group">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
              <h1 className="govuk-fieldset__heading">{this.props.label}</h1>
            </legend>
            
            <div className="govuk-date-input" id="expiry">
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label className="govuk-label govuk-date-input__label" htmlFor={`${this.props.id}-day`}>Day</label>
                  <input 
                    className="govuk-input govuk-date-input__input govuk-input--width-2" 
                    id={`${this.props.id}-day`} 
                    name={`${this.props.id}-day`} 
                    type="number" 
                    pattern="[0-9]*"
                    value={this.state.day}
                    onChange={e => this.onChange('day', e)}
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label className="govuk-label govuk-date-input__label" htmlFor={`${this.props.id}-month`}>Month</label>
                  <input 
                    className="govuk-input govuk-date-input__input govuk-input--width-2" 
                    id={`${this.props.id}-month`} 
                    name={`${this.props.id}-month`} 
                    type="number" 
                    pattern="[0-9]*"
                    value={this.state.month}
                    onChange={e => this.onChange('month', e)}
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label className="govuk-label govuk-date-input__label" htmlFor={`${this.props.id}-year`}>Year</label>
                  <input
                    className="govuk-input govuk-date-input__input govuk-input--width-4" 
                    id={`${this.props.id}-year`} 
                    name={`${this.props.id}-year`} 
                    type="number" 
                    pattern="[0-9]*" 
                    value={this.state.year}
                    onChange={e => this.onChange('year', e)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    )
  }
}

