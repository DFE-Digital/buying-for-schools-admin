import { get, put, post, remove } from '../services/io'
import { fromJS } from 'immutable'
import { questionUrl } from '../config'
import { DIALOG_SHOW } from './dialog-actions'

export const QUESTIONS_LOADING = 'QUESTIONS_LOADING'
export const QUESTIONS_LOADED = 'QUESTIONS_LOADED'
export const QUESTIONS_ERRORED = 'QUESTIONS_ERRORED'
export const QUESTION_LOADING = 'QUESTION_LOADING'
export const QUESTION_LOADED = 'QUESTION_LOADED'
export const QUESTION_ERRORED = 'QUESTION_ERRORED'
export const QUESTION_EDIT = 'QUESTION_EDIT'
export const QUESTION_CANCEL_EDIT = 'QUESTION_CANCEL_EDIT'
export const QUESTIONS_SAVING = 'QUESTIONS_SAVING'
export const QUESTION_UPDATE_ERRORED = 'QUESTION_UPDATE_ERRORED'
export const QUESTION_NEW = 'QUESTION_NEW'
export const QUESTION_DELETE = 'QUESTION_DELETE'
export const QUESTION_DELETING = 'QUESTION_DELETING'

export const questionsLoaded = data => {
  return {
    type: QUESTIONS_LOADED,
    data
  }
}

export const questionsErrored = err => {
  return {
    type: QUESTIONS_ERRORED,
    err
  }
}

export const questionLoaded = data => {
  return {
    type: QUESTION_LOADED,
    data
  }
}

export const questionErrored = err => {
  return {
    type: QUESTION_ERRORED,
    err
  }
}

export const editQuestion = (questionID, optionIndex = null) => {
  return {
    type: QUESTION_EDIT,
    questionID,
    optionIndex
  }
}

export const cancelEdit = () => {
  return {
    type: QUESTION_CANCEL_EDIT
  }
}

export const questionUpdateErrored = err => {
  return {
    type: QUESTION_UPDATE_ERRORED,
    err: err
  }
}

export const createNewQuestion = (parent = null, parentOptionIndex = null) => {
  return {
    type: QUESTION_NEW,
    questionID: QUESTION_NEW,
    _parent: {
      parent,
      optionIndex: parentOptionIndex
    },
    optionIndex: null
  }
}

export const confirmDeleteQuestion = question => dispatch => {
  dispatch({
    type: DIALOG_SHOW,
    data: {
      title: 'Delete question',
      msg: [`Are you sure you want to delete question: '${question.get('title')}'?`, 'This cannot be undone!'],
      buttons: [
        {
          text: 'Yes, delete',
          color: 'red',
          action: deleteQuestion(question.get('_id'))
        },
        {
          text: 'No',
          color: 'green',
          action: null
        }
      ]
    }
  })
}

export const deleteQuestion = id => dispatch => {
  remove(`${questionUrl}/${id}`).then(() => {
    dispatch(cancelEdit())
    return dispatch(getQuestions())
  }).catch(err => {
    return dispatch(questionUpdateErrored(err.error))
  })
  return dispatch({ type: QUESTION_DELETING })
}

export const saveNewQuestion = (json, parent) => dispatch => {
  dispatch({ type: QUESTIONS_SAVING })
  const url = (parent) ? `${questionUrl}/${parent.parentId}/${parent.optionId}` : questionUrl
  return post(url, json).then(data => {
    dispatch(questionUpdateErrored([]))
    dispatch(getQuestions())
    return data.data
  }).catch(err => {
    return dispatch(questionUpdateErrored(err.error))
  })
}

export const updateQuestion = json => dispatch => {
  dispatch({ type: QUESTIONS_SAVING })
  return put(`${questionUrl}/${json._id}`, json).then(data => {
    dispatch(questionUpdateErrored([]))
    dispatch(getQuestions())
    return data.data
  }).catch(err => {
    return dispatch(questionUpdateErrored(err.error))
  })
}

export const getQuestions = () => dispatch => {
  return get(questionUrl).then(data => {
    return dispatch(questionsLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(questionsErrored(err))
  })
}
