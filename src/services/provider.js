import { Map } from 'immutable'

export const getBlankProvider = () => {
  return Map({
    _id: 'new',
    initials: '',
    title: ''
  })
}