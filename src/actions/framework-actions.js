import { get} from '../services/io'
import { fromJS } from 'immutable'
import { frameworkUrl } from '../config'

export const FRAMEWORKS_LOADING = 'FRAMEWORKS_LOADING'
export const FRAMEWORKS_LOADED = 'FRAMEWORKS_LOADED'
export const FRAMEWORKS_ERRORED = 'FRAMEWORKS_ERRORED'
export const FRAMEWORK_EDIT = 'FRAMEWORK_EDIT'
export const FRAMEWORK_CANCEL_EDIT = 'FRAMEWORK_CANCEL_EDIT'
export const FRAMEWORK_SAVING = 'FRAMEWORK_SAVING'
export const FRAMEWORK_UPDATE_ERRORED = 'FRAMEWORK_UPDATE_ERRORED'
export const FRAMEWORK_NEW = 'FRAMEWORK_NEW'
export const FRAMEWORK_DELETE = 'FRAMEWORK_DELETE'
export const FRAMEWORK_DELETING = 'FRAMEWORK_DELETING'



export const frameworksLoaded = data => {
  return {
    type: FRAMEWORKS_LOADED,
    data
  }  
}

export const frameworksErrored = err => {
  return {
    type: FRAMEWORKS_ERRORED,
    err
  }
}

export const getFrameworks = () => dispatch => {
  get(frameworkUrl).then(data => {
    return dispatch(frameworksLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(frameworksErrored(err))
  })
  return dispatch({ type: FRAMEWORKS_LOADING })
}