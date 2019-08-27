import { get, put, post, remove } from '../services/io'
import { fromJS } from 'immutable'
import { providerUrl } from '../config'
import { DIALOG_SHOW } from './dialog-actions'

export const PROVIDERS_LOADING = 'PROVIDERS_LOADING'
export const PROVIDERS_LOADED = 'PROVIDERS_LOADED'
export const PROVIDERS_ERRORED = 'PROVIDERS_ERRORED'
export const PROVIDER_SAVING = 'PROVIDER_SAVING'
export const PROVIDER_UPDATE_ERRORED = 'PROVIDER_UPDATE_ERRORED'
export const PROVIDER_DELETING = 'PROVIDER_DELETING'

export const providersLoaded = data => {
  return {
    type: PROVIDERS_LOADED,
    data
  }
}

export const providersErrored = err => {
  return {
    type: PROVIDERS_ERRORED,
    err
  }
}

export const providerUpdateErrored = err => {
  return {
    type: PROVIDER_UPDATE_ERRORED,
    err: err
  }
}

export const getProviders = () => dispatch => {
  return get(providerUrl).then(data => {
    return dispatch(providersLoaded(fromJS(data)))
  }).catch(err => {
    return dispatch(providersErrored(err))
  })
}

export const saveNewProvider = (json, parent) => dispatch => {
  dispatch({ type: PROVIDER_SAVING })
  return post(providerUrl, json).then(data => {
    dispatch(providerUpdateErrored([]))
    dispatch(getProviders())
    return data.data
  }).catch(err => {
    return dispatch(providerUpdateErrored(err.error))
  })
}

export const updateProvider = json => dispatch => {
  dispatch({ type: PROVIDER_SAVING })
  return put(`${providerUrl}/${json._id}`, json).then(data => {
    dispatch(providerUpdateErrored([]))
    dispatch(getProviders())
    return data.data
  }).catch(err => {
    return dispatch(providerUpdateErrored(err.error))
  })
}

export const confirmDeleteProvider = provider => dispatch => {
  dispatch({
    type: DIALOG_SHOW,
    data: {
      title: 'Delete provider',
      msg: [`Are you sure you want to delete provider: \'${provider.get('title')}\'?`, 'This cannot be undone!'],
      buttons: [
        {
          text: 'Yes, delete',
          color: 'red',
          action: deleteProvider(provider.get('_id'))
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

export const deleteProvider = id => dispatch => {
  remove(`${providerUrl}/${id}`).then(() => {
    return dispatch(getProviders())
  }).catch(err => {
    return dispatch(providerUpdateErrored(err.error))
  })
  return dispatch({ type: PROVIDER_DELETING })
}
