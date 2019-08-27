import { get, put, post, remove } from '../services/io'
import { fromJS } from 'immutable'
import { categoryUrl } from '../config'
import { DIALOG_SHOW } from './dialog-actions'

export const CATEGORIES_LOADING = 'CATEGORIES_LOADING'
export const CATEGORIES_LOADED = 'CATEGORIES_LOADED'
export const CATEGORIES_ERRORED = 'CATEGORIES_ERRORED'
export const CATEGORY_SAVING = 'CATEGORY_SAVING'
export const CATEGORY_UPDATE_ERRORED = 'CATEGORY_UPDATE_ERRORED'
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

export const getCategories = () => dispatch => {
  return get(categoryUrl).then(data => {
    return dispatch(categoriesLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(categoriesErrored(err))
  })
}

export const saveNewCategory = (json, parent) => dispatch => {
  dispatch({ type: CATEGORY_SAVING })
  return post(categoryUrl, json).then(data => {
    dispatch(categoryUpdateErrored([]))
    dispatch(getCategories())
    return data.data
  }).catch(err => {
    return dispatch(categoryUpdateErrored(err.error))
  })
}

export const updateCategory = json => dispatch => {
  dispatch({ type: CATEGORY_SAVING })
  return put(`${categoryUrl}/${json._id}`, json).then(data => {
    dispatch(categoryUpdateErrored([]))
    dispatch(getCategories())
    return data.data
  }).catch(err => {
    return dispatch(categoryUpdateErrored(err.error))
  })
}

export const confirmDeleteCategory = category => dispatch => {
  dispatch({
    type: DIALOG_SHOW,
    data: {
      title: 'Delete category',
      msg: [`Are you sure you want to delete category: \'${category.get('title')}\'?`, 'This cannot be undone!'],
      buttons: [
        {
          text: 'Yes, delete',
          color: 'red',
          action: deleteCategory(category.get('_id'))
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

export const deleteCategory = id => dispatch => {
  remove(`${categoryUrl}/${id}`).then(() => {
    return dispatch(getCategories())
  }).catch(err => {
    return dispatch(categoryUpdateErrored(err.error))
  })
  return dispatch({ type: CATEGORY_DELETING })
}
