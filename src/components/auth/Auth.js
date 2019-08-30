import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import LoginForm from './LoginForm'
import { login, logout } from '../../actions/auth-actions'
import Nav from '../Nav'
import './auth.css'

const mapStateToProps = (state) => {
  return {
    errors: state.authReducer.errors,
    token: state.authReducer.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, pass) => dispatch(login(user, pass)),
    logout: () => dispatch(logout())
  }
}

export class Auth extends Component {
  login (user, pass) {    
    this.props.login(user, pass)    
  }

  render () {
    if (this.props.token) {
      return (
        <div>
          <span className="govuk-width-container auth"><Link to="/" onClick={this.props.logout} className="auth__logout">Logout</Link></span>
          <Nav />
          { this.props.children }
        </div>
      )
    }

    return <LoginForm login={this.login.bind(this)} errors={this.props.errors} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
