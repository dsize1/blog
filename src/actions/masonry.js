import ajax from '../util/ajax'

export const getImageSrc = () => ({
  type: 'GET_IMAGE_SRC'
})

export const fetchImageSrc = () => (dispatch, getState) => {
  dispatch({ type: 'FETCH_POSTS_REQUEST' })
  return ajax('GET', 'http://localhost:8081/api/search')
    .then(res => dispatch({ type: 'FETCH_POSTS_SUCCESS', data: res }))
    .catch(err => console.log(err))
}

