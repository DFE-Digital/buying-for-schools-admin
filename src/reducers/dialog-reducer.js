import { DIALOG_SHOW, DIALOG_HIDE } from '../actions/dialog-actions'

const defaultState = {
  show: false,
  msg: [],
  title: '',
  buttons: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case DIALOG_HIDE: {
      return defaultState
    }
    case DIALOG_SHOW: {
      return { ...state, show: true, ...action.data }
    }
    default: {
      return state
    }
  }

}