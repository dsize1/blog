import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import thunkMiddleware from 'redux-thunk'

export const history = createBrowserHistory()

export default function configureStore (preloadedState) {
  const composeEnhancer = compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware
      )
    )
  )
  return store
}