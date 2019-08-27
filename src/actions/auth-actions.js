import { post, setToken } from '../services/io'
import { auth as url } from '../config'

export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_FAILED = 'AUTH_FAILED'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_RESET = 'AUTH_RESET'

export const login = (user, pass) => dispatch => {
  dispatch({ type: AUTH_RESET })
  return post(url, { user, pass }).then(data => {
    setToken(data.data.token)
    return dispatch({ type: AUTH_SUCCESS, token: data.data.token })
  }).catch(errdata => {
    setToken(null)
    return dispatch({ 
      type: AUTH_FAILED,
      errors: [ 
        { id: 'user', msg: `User: ${errdata.error.data.message}` }, 
        { id: 'pass', msg: `Password: ${errdata.error.data.message}` }
      ]
    })
  })
}

export const logout = () => dispatch => {
  setToken(null)
  return dispatch({ type: AUTH_LOGOUT, token: null })
}