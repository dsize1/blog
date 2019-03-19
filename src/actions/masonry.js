import ajax from '../util/ajax'

export const getImageSrc = () => ({
  type: 'GET_IMAGE_SRC'
})

export const fetchImageSrc = () => (dispatch, getState) => {
  dispatch({ type: 'FETCH_POSTS_REQUEST' })
  return ajax('GET', 'https://www.chengcici.info/masonary')
    .then(res => dispatch({ type: 'FETCH_POSTS_SUCCESS', data: res }))
    .catch(err => console.log(err))
}

