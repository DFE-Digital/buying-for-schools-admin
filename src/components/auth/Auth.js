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

export class DiagramResult extends Component {
  componentDidMount () {

  }

  componentDidUpdate (prevProps) {

  }

  login (user, pass) {
    this.props.login(user, pass)    
  }

  render () {
    
    if (this.props.token) {
      return (
        <div>
          <Link to="/" onClick={this.props.logout} className="auth__logout govuk-width-container">Logout</Link>
          <Nav />
          { this.props.children }
        </div>
      )
    }

    return <LoginForm login={this.login.bind(this)} errors={this.props.errors} />
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagramResult)
