import { CATEGORIES_LOADED, CATEGORIES_ERRORED } from '../actions/category-actions'
import { List } from 'immutable'

const defaultState = {
  categories: List([])
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case CATEGORIES_LOADED: {
      return { ...state, categories: action.data }
    }

    case CATEGORIES_ERRORED: {
      return { ...state, categories: List([]) }
    }

    default: {
      return state
    }
  }

}