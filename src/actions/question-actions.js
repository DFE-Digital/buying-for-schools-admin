import { get, put, post, remove } from '../services/io'
import { fromJS } from 'immutable'
import { questionUrl } from '../config'

export const QUESTIONS_LOADING = 'QUESTIONS_LOADING'
export const QUESTIONS_LOADED = 'QUESTIONS_LOADED'
export const QUESTIONS_ERRORED = 'QUESTIONS_ERRORED'
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

export const createNewQuestion = (parentID = null, parentOptionIndex = null) => {
  return {
    type: QUESTION_NEW,
    questionID: QUESTION_NEW,
    _parent: {
      id: parentID,
      optionIndex: parentOptionIndex
    },
    optionIndex: null
  }
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

export const saveNewQuestion = json => dispatch => {
  post(questionUrl, json).then(data => {
    dispatch(cancelEdit())
    return dispatch(getQuestions())
  }).catch(err => {
    return dispatch(questionUpdateErrored(err.error))
  })
  return dispatch({ type: QUESTIONS_SAVING })
}

export const updateQuestion = json => dispatch => {
  put(`${questionUrl}/${json._id}`, json).then(data => {
    dispatch(cancelEdit())
    return dispatch(getQuestions())
  }).catch(err => {
    return dispatch(questionUpdateErrored(err.error))
  })
  return dispatch({ type: QUESTIONS_SAVING })
}

export const getQuestions = () => dispatch => {
  get(questionUrl).then(data => {
    return dispatch(questionsLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(questionsErrored(err))
  })
  return dispatch({ type: QUESTIONS_LOADING })
}
