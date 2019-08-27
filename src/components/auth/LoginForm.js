import React from 'react'

import Input from '../form/Input'
import ErrorSummary from '../form/ErrorSummary'

const Login = (props) => {
  const values = { user: '', pass: ''}
  const onChange = (id, value) => {
    values[id] = value
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(values)
    props.login(values.user, values.pass)
  }

  const hasErrors = Array.isArray(props.errors)
  const errorIds = hasErrors ? props.errors.map(e => e.id) : []
  const errors = hasErrors ? props.errors : []

  return (
    <div className="dashboard govuk-width-container">
      <h1>Log in</h1>
      <form className="frameworkeditor__framework">
        <ErrorSummary errors={props.errors} />

        <Input 
          id="user"
          value=""
          label="User"
          onChange={onChange}
          error={errorIds.includes('user')}
          />
        <Input 
          id="pass"
          value=""
          label="Password"
          onChange={onChange}
          error={errorIds.includes('pass')}
          />

        <input 
          type="submit" 
          value="Submit" 
          className="button" 
          onClick={onSubmit} 
          />
      </form>
    </div>
  )
}

export default Login