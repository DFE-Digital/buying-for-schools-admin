import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import questionReducer from './reducers/question-reducer'
import frameworkReducer from './reducers/framework-reducer'
import categoryReducer from './reducers/category-reducer'
import providerReducer from './reducers/provider-reducer'
import dialogReducer from './reducers/dialog-reducer'
// import aggregationReducer from './reducers/aggregation-reducer'


// const logger = args => {
//   const { getState } = args
//   return next => action => {
//     console.log('will dispatch', action)

//     // Call the next dispatch method in the middleware chain.
//     const returnValue = next(action)

//     console.log('state after dispatch', getState())

//     // This will likely be the action itself, unless
//     // a middleware further in chain changed it.
//     return returnValue
//   }
// }

export const store = createStore(
  combineReducers({
    questionReducer,
    frameworkReducer,
    categoryReducer,
    providerReducer,
    dialogReducer
  }),
  applyMiddleware(thunk)
)
