import React, { Component } from 'react'

import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      values: { user: '', pass: ''}
    }
  }

  onChange (id, value) {
    const newValues = { ...this.state.values }
    newValues[id] = value
    this.setState({ values: newValues})
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.login(this.state.values.user, this.state.values.pass)
  }

  render() {
    const hasErrors = Array.isArray(this.props.errors)
    const errorIds = hasErrors ? this.props.errors.map(e => e.id) : []
    const errors = hasErrors ? this.props.errors : []

    return (
      <div className="dashboard govuk-width-container">
        <h1>Log in</h1>
        <form className="frameworkeditor__framework">
          <ErrorSummary errors={this.props.errors} />

          <Input 
            id="user"
            value={this.state.values.user}
            label="User"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('user')}
            />
          <Input 
            id="pass"
            value={this.state.values.pass}
            type="password"
            label="Password"
            onChange={this.onChange.bind(this)}
            error={errorIds.includes('pass')}
            />

          <input 
            type="submit" 
            value="Submit" 
            className="button" 
            onClick={this.onSubmit.bind(this)} 
            />
        </form>
      </div>
    )
  }
}

export default Login