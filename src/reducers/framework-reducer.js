import { FRAMEWORKS_LOADED, FRAMEWORKS_ERRORED, FRAMEWORK_UPDATE_ERRORED } from '../actions/framework-actions'
import { List } from 'immutable'
import { getFrameworkInfo } from '../services/framework'

const defaultState = {
  frameworks: null
}



export default (state = defaultState, action) => {
  switch (action.type) {
    case FRAMEWORKS_LOADED: {
      const frameworks = action.data.map(f => getFrameworkInfo(f))
      return { ...state, frameworks }
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