import { QUESTION_LOADED, QUESTIONS_ERRORED, QUESTIONS_LOADED, QUESTION_EDIT, QUESTION_CANCEL_EDIT, QUESTION_UPDATE_ERRORED, QUESTION_NEW } from '../actions/question-actions'
import { List } from 'immutable'

const defaultState = {
  questions: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case QUESTION_LOADED: {
      const index = state.questions.findIndex(q => q.get('id') === action.data.get('_id'))
      if (index !== null) {
        return { ...state, questions: state.questions.update(index, action.data) }
      }
      return { ...state, questions: state.questions.push(action.data) }
    }

    case QUESTIONS_LOADED: {
      return { ...state, questions: action.data }
    }

    case QUESTIONS_ERRORED: {
      return { ...state, questions: List([]) }
    }

    case QUESTION_EDIT: {
      return { ...state, editing: action, updateErrors: {} } 
    }

    case QUESTION_NEW: {
      return { ...state, editing: action, updateErrors: {} }  
    }

    case QUESTION_CANCEL_EDIT: {
      return { ...state, editing: null }
    }

    case QUESTION_UPDATE_ERRORED: {
      return { ...state, updateErrors: action.err }
    }

    default: {
      return state
    }
  }
}