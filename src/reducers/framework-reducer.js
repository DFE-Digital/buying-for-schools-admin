import { FRAMEWORKS_LOADED, FRAMEWORKS_ERRORED } from '../actions/framework-actions'
import { List } from 'immutable'

const defaultState = {
  frameworks: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FRAMEWORKS_LOADED: {
      return { ...state, frameworks: action.data }
    }

    case FRAMEWORKS_ERRORED: {
      return { ...state, frameworks: List([]) }
    }

    default: {
      return state
    }
  }

}