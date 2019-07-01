import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import questionReducer from './reducers/question-reducer'
import frameworkReducer from './reducers/framework-reducer'
import categoryReducer from './reducers/category-reducer'



export const store = createStore(
  combineReducers({
    questionReducer,
    frameworkReducer,
    categoryReducer
  }),
  applyMiddleware(thunk)
)
