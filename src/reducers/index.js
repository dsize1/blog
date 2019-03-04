import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import masonryReducer from './masonryReducer'
import cubeReducer from './cubeReducer'
import blogReducer from './blogReducer'

const rootReducer = (history) => combineReducers({
  cube: cubeReducer,
  masonry: masonryReducer,
  blog: blogReducer,
  router: connectRouter(history)
})

export default rootReducer