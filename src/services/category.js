import { Map } from 'immutable'

export const getBlankCategory = () => {
  return Map({
    _id: 'new',
    title: ''
  })
}