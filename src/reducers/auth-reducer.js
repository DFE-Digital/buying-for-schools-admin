import { getCookie } from '../services/utils'
import { cookieName } from '../config'

import { QUESTIONS_ERRORED } from '../actions/question-actions'
import { CATEGORIES_ERRORED } from '../actions/category-actions'
import { PROVIDERS_ERRORED } from '../actions/provider-actions'
import { FRAMEWORKS_ERRORED } from '../actions/framework-actions'
import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_FAILED, AUTH_RESET } from '../actions/auth-actions'

const defaultState = {
  token: getCookie(cookieName),
  errors: []
}

const resetState = {
  token: null, 
  errors: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case AUTH_RESET: {
      return resetState
    }

    case AUTH_SUCCESS: {
      return { token: action.token, errors: [] }
    }

    case AUTH_FAILED: {
      return { token: null, errors: action.errors }
    }

    case QUESTIONS_ERRORED:
    case CATEGORIES_ERRORED:
    case PROVIDERS_ERRORED:
    case FRAMEWORKS_ERRORED: {
      return (action.err === 401 || action.err === 403) ? resetState : state
    }

    case AUTH_LOGOUT: {
      return { ...defaultState }
    }

    default: {
      return state
    }
  }
}
