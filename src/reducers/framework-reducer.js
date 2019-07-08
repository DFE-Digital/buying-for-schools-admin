import { FRAMEWORKS_LOADED, FRAMEWORKS_ERRORED, FRAMEWORK_UPDATE_ERRORED } from '../actions/framework-actions'
import { List } from 'immutable'

const defaultState = {
  frameworks: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FRAMEWORKS_LOADED: {
      return { ...state, frameworks: action.data }
    }

    case FRAMEWORKS_ERRORED: {
      return { ...state, frameworks: List([]) }
    }

    case FRAMEWORK_UPDATE_ERRORED: {
      return { ...state, updateErrors: action.err }
    }

    default: {
      return state
    }
  }

}