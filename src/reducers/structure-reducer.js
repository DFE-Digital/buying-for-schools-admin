import { STRUCTURES_LOADED, STRUCTURES_ERRORED, STRUCTURE_UPDATE_ERRORED, STRUCTURE_DRAFT_CHANGED } from '../actions/structure-actions'
import { List } from 'immutable'

const defaultState = {
  structures: null, 
  draftId: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case STRUCTURE_DRAFT_CHANGED: {
      return { ...state, draftId: action.id }
    }

    case STRUCTURES_LOADED: {
      return { ...state, structures: action.data }
    }

    case STRUCTURES_ERRORED: {
      return { ...state, structures: List([]) }
    }

    case STRUCTURE_UPDATE_ERRORED: {
      return { ...state, updateErrors: action.err }
    }

    default: {
      return state
    }
  }
}