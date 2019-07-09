import { PROVIDERS_LOADED, PROVIDERS_ERRORED } from '../actions/provider-actions'
import { List } from 'immutable'

const defaultState = {
  providers: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case PROVIDERS_LOADED: {
      return { ...state, providers: action.data }
    }

    case PROVIDERS_ERRORED: {
      return { ...state, providers: List([]) }
    }

    default: {
      return state
    }
  }
}