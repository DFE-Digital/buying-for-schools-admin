import { get, put, post, remove } from '../services/io'
import { fromJS } from 'immutable'
import { structureUrl } from '../config'

export const STRUCTURES_LOADING = 'STRUCTURES_LOADING'
export const STRUCTURES_LOADED = 'STRUCTURES_LOADED'
export const STRUCTURES_ERRORED = 'STRUCTURES_ERRORED'
export const STRUCTURE_SAVING = 'STRUCTURE_SAVING'
export const STRUCTURE_UPDATE_ERRORED = 'STRUCTURE_UPDATE_ERRORED'
export const STRUCTURE_DELETING = 'STRUCTURE_DELETING'
export const STRUCTURE_DRAFT_CHANGED = 'STRUCTURE_DRAFT_CHANGED'


export const structureDraftChanged = id => {
  return {
    type: STRUCTURE_DRAFT_CHANGED,
    id
  }  
}

export const structuresLoaded = data => {
  return {
    type: STRUCTURES_LOADED,
    data
  }  
}

export const structuresErrored = err => {
  return {
    type: STRUCTURES_ERRORED,
    err
  }
}

export const structureUpdateErrored = err => {
  return {
    type: STRUCTURE_UPDATE_ERRORED,
    err: err
  }
}

export const getStructures = () => dispatch => {
  return get(structureUrl)
    .then(data => dispatch(structuresLoaded(fromJS(data))))
    .catch(err => dispatch(structuresErrored(err)))
}

export const archive = (id, title) => dispatch => {
  const data = {
    status: 'ARCHIVE',
    archived: new Date().toISOString()
  }
  return put(`${structureUrl}/${id}`, data)
}

// export const clone = (id, updates = {}) => dispatch => {
//   return post(structureUrl, { source: id, status: 'DRAFT', published: {}, archived: {} })
// }

export const publish = (id, title) => dispatch => {
  const data = {
    status: 'LIVE',
    published: new Date().toISOString(),
    title
  }
  return put(`${structureUrl}/${id}`, data)
}

export const deleteStructure = id => dispatch => {
  return remove(`${structureUrl}/${id}`)
}

export const restore = id => dispatch => {
  return post(structureUrl, { source: id, status: 'DRAFT', published: null, archived: null })
}

