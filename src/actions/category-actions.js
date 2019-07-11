import { get, remove } from '../services/io'
import { fromJS } from 'immutable'
import { categoryUrl } from '../config'

export const CATEGORIES_LOADING = 'CATEGORIES_LOADING'
export const CATEGORIES_LOADED = 'CATEGORIES_LOADED'
export const CATEGORIES_ERRORED = 'CATEGORIES_ERRORED'
export const CATEGORY_EDIT = 'CATEGORY_EDIT'
export const CATEGORY_CANCEL_EDIT = 'CATEGORY_CANCEL_EDIT'
export const CATEGORY_SAVING = 'CATEGORY_SAVING'
export const CATEGORY_UPDATE_ERRORED = 'CATEGORY_UPDATE_ERRORED'
export const CATEGORY_NEW = 'CATEGORY_NEW'
export const CATEGORY_DELETE = 'CATEGORY_DELETE'
export const CATEGORY_DELETING = 'CATEGORY_DELETING'

export const categoriesLoaded = data => {
  return {
    type: CATEGORIES_LOADED,
    data
  }  
}

export const categoriesErrored = err => {
  return {
    type: CATEGORIES_ERRORED,
    err
  }
}

export const categoryUpdateErrored = err => {
  return {
    type: CATEGORY_UPDATE_ERRORED,
    err: err
  }
}

export const deleteCategory = id => dispatch => {
  remove(`${categoryUrl}/${id}`).then(() => {
    return dispatch(getCategories())
  }).catch(err => {
    return dispatch(categoryUpdateErrored(err.error))
  })
  return dispatch({ type: CATEGORY_DELETING })
}

export const getCategories = () => dispatch => {
  get(categoryUrl).then(data => {
    return dispatch(categoriesLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(categoriesErrored(err))
  })
  return dispatch({ type: CATEGORIES_LOADING })
}