import ajax from '../util/ajax'
import { push } from 'connected-react-router'

const baseUrl = 'http://woai.lijinyan89.com/api'
//const baseUrl = 'http://localhost:8080/api'

const firstQueryRequest = (lastFetch) => ({ type: 'FIRST_QUERY_REQUEST', payload: { lastFetch } })

const queryRequest = (direction) => ({ type: 'QUERY_REQUEST', payload: { direction } })

const queryRequestFailure = (error) => ({ type: 'QUERY_REQUEST_FAILURE', payload: { error } })

const queryTimelineNotingMore = () => ({ type: 'QUERY_NOTING_MORE'})

const timelineStateQueryUpdate = (payload) => ({ type: 'TIMELINESTATE_QUERY_UPDATED', payload })

const queryHomePostsSuccess = (payload) => ({ type: 'QUERY_HOME_POSTS_SUCCESS', payload })

const queryUserPostsSuccess = (user_id) => (payload) => ({ type: 'QUERY_USER_POSTS_SUCCESS', payload: { ...payload, user_id } })

const queryPostsWithEntitySuccess = (user_id, entity) => (payload) => ({ type: 'QUERY_POSTS_WITH_ENTITY_SUCCESS', payload: { ...payload, user_id , entity} })

const queryCommentsSuccess = (post_id) => (payload) => ({ type: 'QUERY_COMMENTS_SUCCESS', payload: { ...payload, post_id } })

const queryRequestSuccess = (res, fetchStatus, oldUnreadCount, direction, querySuccessFunc) => {
  const data = res.data.filter(item => (!fetchStatus.hasOwnProperty(item.id)))
  const ids = res.data.map(item => item.id)
  const unreadCount = oldUnreadCount + ids.length
  const lastFetch = direction === 'bottom' ? res.data[ids.length - 1].created_at : res.data[0].created_at
  const method = direction === 'bottom' ? 'push' : 'unshift'
  const action1 = querySuccessFunc({ method, ids, data })
  const action2 = timelineStateQueryUpdate({ direction, unreadCount, lastFetch })
  return [action1, action2]
}
const publishRequest = () => ({ type: 'PUBLISH_REQUEST' })

const delRequest = () => ({ type: 'DELETE_REQUEST' })

const updateRequest = () => ({ type: 'UPDATE_REQUEST'})

const delRequestSuccess = (payload) => ({ type: 'DELETE_REQUEST_SUCCESS', payload})

const delRequestFailure = (payload) => ({ type: 'DELETE_REQUEST_FAILURE', payload})

const updateCommentRequestSuccess = (payload) => ({ type: 'UPDATE_COMMENT_REQUEST_SUCCESS', payload})

const updatePostRequestSuccess = (payload) => ({ type: 'UPDATE_POST_REQUEST_SUCCESS', payload})

const updateRequestFailure = (payload) => ({ type: 'UPDATE_REQUEST_FAILURE', payload})

const getFieldsValidate = (fields) => Object.values(fields).every(({required, validate}) => !required || validate)

const getFieldsValues = (fields) => Object.values(fields).reduce((res, {name, value}) => {
  res[name] = value
  return res
}, {})

const appendForm = (fields) => Object.values(fields).reduce((form, {name, value}) => {
  form.append(name, value)
  return form
}, new FormData())

const publishRequestFailure = (payload) => ({ type: 'PUBLISH_REQUEST_FAILURE', payload})

const timelineStatePublishUpdate = (payload) => ({ type: 'TIMELINE_STATE_PUBLISH_UPDATE', payload})

const publishPostSuccess = (payload) => ( {type: 'PUBLISH_POST_SUCCESS', payload})

const publishCommentSuccess = (payload) => ( {type: 'PUBLISH_COMMENT_SUCCESS', payload})

const dispatchAll = (dispatch, actions) => actions.forEach(action => dispatch(action))

const authenticationSuccess = (payload) => ({ type: 'AUTHENTICATION_SUCCESS', payload})

const authenticationFailure = (payload) => ({ type: 'AUTHENTICATION_FAILURE', payload})

const authentication = (dispatch, url, options) => {
  dispatch({ type: 'AUTHENTICATION' })
  return ajax('POST', url, options)
    .then(response => {
      dispatch(authenticationSuccess(response.data))
      dispatch(initInputField('authentication'))
    })
    .catch(({ message }) => {
      dispatch(authenticationFailure({message, inputField: 'authentication'}))
      dispatch(initInputField('authentication'))
    })
}

export const initInputField = (inputField, message) => ({ type: 'INPUTFIELD_INIT', payload: {inputField , message} })

export const transmitValues = (inputField, entries) => ({ type: 'TRANSMIT_VALUES', payload: {inputField, entries}})

export const handleQueryNewPublish = (queryPosts, publishCount, fetchPublishCount) => () => {
  return queryPosts('top', publishCount).finally(() => {
    fetchPublishCount()
  })
}

export const handleQueryHomePosts = (direction, limit = 15 ) => (dispatch, getState) => {
  const { blog } = getState()
  let lastFetch
  if (direction) {
    lastFetch = blog.homeTimeline.lastFetch[direction]
  } else {
    direction = 'bottom'
    lastFetch = Date.now()
    dispatch(firstQueryRequest(lastFetch))
  }
  if (!lastFetch) return null
  const url = baseUrl + `/home?d=${direction[0]}&l=${lastFetch}&n=${limit}` 
  const unreadCount = blog.homeTimeline.unreadCount
  const fetchStatus = blog.entities.posts.fetchStatus
  dispatch(queryRequest(direction))
  return ajax('GET', url)
    .then(res => {
      if (res.data.length !== 0) {
        dispatchAll(dispatch, queryRequestSuccess(res, fetchStatus, unreadCount, direction, queryHomePostsSuccess))
      }
    })
    .catch(err => {
      dispatch(queryRequestFailure(err))
    })
}

export const handleQueryUserPosts = (user_id, direction, withUserinfo = false, limit = 15) => (dispatch, getState) => {
  const { blog } = getState()
  let lastFetch
  if (direction) {
    lastFetch = blog.homeTimeline.lastFetch[direction]
  } else {
    direction = 'bottom'
    lastFetch = Date.now()
    dispatch(firstQueryRequest(lastFetch))
  }
  if (!lastFetch) return null
  const url = baseUrl + `/user/${user_id}?d=${direction[0]}&l=${lastFetch}&w=${withUserinfo ? 't' : 'f'}&n=${limit}`
  const unreadCount = blog.homeTimeline.unreadCount
  const fetchStatus = blog.entities.posts.fetchStatus
  dispatch(queryRequest(direction))
  return ajax('GET', url)
    .then(res => {
      if (withUserinfo) {
        dispatchAll(dispatch, queryRequestSuccess(res, fetchStatus, unreadCount, direction, queryPostsWithEntitySuccess(user_id, res.userinfo)))
      } else if (res.data.length) {
        dispatchAll(dispatch, queryRequestSuccess(res, fetchStatus, unreadCount, direction, queryUserPostsSuccess(user_id)))
      }
    }).catch(err => {
      dispatch(queryRequestFailure(err))
    })
}

export const handleQueryComments = (post_id) => (dispatch, getState) => {
  const { blog } = getState()
  const url = baseUrl + `/post/${post_id}`
  const unreadCount = blog.homeTimeline.unreadCount
  const fetchStatus = blog.entities.comments.fetchStatus
  dispatch(queryRequest('bottom'))
  return ajax('GET', url)
    .then(res => {
      if (res.data.length) {
        dispatchAll(dispatch, queryRequestSuccess(res, fetchStatus, unreadCount, 'bottom', queryCommentsSuccess(post_id))) 
      }
    }).catch(err => {
      dispatch(queryRequestFailure(err))
    })
}

export const handlePublishPost = () => (dispatch, getState) => {
  const { blog, router } = getState()
  const url = baseUrl + router.location.pathname
  const { id: user_id, username: author, avatar } = blog.user
  if (!getFieldsValidate(blog.postEditor.fields)) {
    return dispatch(publishRequestFailure({message: '填写有误', inputField: 'postEditor'}))
  }
  const now = Date.now()
  const body = {
    user_id,
    author,
    avatar,
    created_at: now,
    updated_at: now,
    ...getFieldsValues(blog.postEditor.fields)
  }
  const headers = { "Content-Type": "application/json" }
  dispatch(publishRequest())
  return ajax('POST', url, {body: JSON.stringify(body), headers})
    .then(res => {
      const { id } = res.data
      const entity = { ...body, id }
      dispatch(publishPostSuccess({user_id, id, entity}))
      dispatch(timelineStatePublishUpdate({lastFetch: now, direction: 'top'}))
      dispatch(initInputField('postEditor', true))
    })
    .catch(({ message }) => {
      dispatch(publishRequestFailure({message, inputField: 'postEditor'}))
      dispatch(initInputField('postEditor'))
    })
}

export const handlePublishComment = (post_id) => (dispatch, getState) => {
  const { blog, router } = getState()
  const url = baseUrl + router.location.pathname
  const { id: user_id, username: author, avatar } = blog.user
  if (!getFieldsValidate(blog.commentEditor.fields)) {
    return dispatch(publishRequestFailure({message: '填写有误', inputField: 'commentEditor'}))
  }
  const now = Date.now()
  const body = {
    user_id,
    post_id,
    author,
    avatar,
    created_at: now,
    updated_at: now,
    ...getFieldsValues(blog.commentEditor.fields)
  }
  const headers = { "Content-Type": "application/json" }
  dispatch(publishRequest())
  return ajax('POST', url, {body: JSON.stringify(body), headers})
    .then(res => {
      const { id } = res.data
      const entity = { ...body, id}
        dispatch(publishCommentSuccess({post_id, id, entity})) 
        dispatch(timelineStatePublishUpdate({lastFetch: now, direction: 'bottom'}))
        dispatch(initInputField('commentEditor', true))
    })
    .catch(({ message }) => {
      dispatch(publishRequestFailure({message, inputField: 'commentEditor'}))
      dispatch(initInputField('commentEditor'))
    })
}

export const handleDelComment = (post_id, id) => (dispatch, getState) => {
  const { blog, router } = getState()
  const user_id = blog.user.id
  const url = baseUrl + router.location.pathname
  const body = {
    user_id,
    id
  } 
  const headers = { "Content-Type": "application/json" }
  dispatch(delRequest()) 
  return ajax('DELETE', url, {body: JSON.stringify(body), headers})
    .then(res => {
      dispatch(delRequestSuccess({ post_id, id }))
      dispatch(push(router.location.pathname))
    })
    .catch(({ message }) => {
      dispatch(delRequestFailure({ message }))
      dispatch(push('/home'))
    })
}

export const handleUpdateComment = (handleShutDown, post_id, id, rest) => (dispatch, getState) => {
  const { blog, router } = getState()
  const url = baseUrl + router.location.pathname
  const now = Date.now()
  if (!getFieldsValidate(blog.commentEditor.fields)) {
    return dispatch(publishRequestFailure({message: '填写有误', inputField: 'commentEditor'}))
  }
  const body = {
    id,
    post_id,
    updated_at: now,
    ...rest,
    ...getFieldsValues(blog.commentEditor.fields)
  }  
  const headers = { "Content-Type": "application/json" }
  dispatch(updateRequest())
  return ajax('PUT', url, {body: JSON.stringify(body), headers})
    .then(res => {
      dispatch(updateCommentRequestSuccess({id, entity: body}))
      handleShutDown()
    })
    .catch(({ message }) => {
      dispatch(updateRequestFailure({message, inputField: 'commentEditor'}))
      dispatch(initInputField('commentEditor'))
    })
}

export const handleUpdatePost = (handleShutDown, self_id, id, rest) => (dispatch, getState) => {
  const { blog } = getState()
  const url = baseUrl + `/user/${self_id}`
  const now = Date.now()
  if (!getFieldsValidate(blog.postEditor.fields)) {
    return dispatch(publishRequestFailure({message: '填写有误', inputField: 'postEditor'}))
  }
  const body = {
    id,
    updated_at: now,
    ...rest,
    ...getFieldsValues(blog.postEditor.fields)
  }  
  const headers = { "Content-Type": "application/json" }
  dispatch(updateRequest())
  return ajax('PUT', url, {body: JSON.stringify(body), headers})
    .then(res => {
      dispatch(updatePostRequestSuccess({id, entity: body}))
      handleShutDown()
    })
    .catch(({ message }) => {
      dispatch(updateRequestFailure({message, inputField: 'postEditor'}))
      dispatch(initInputField('postEditor'))
    })
}

export const signup = () => (dispatch, getState) => {
  const { blog, router } = getState()
  const url = baseUrl + router.location.pathname
  if (!getFieldsValidate(blog.authentication.fields)) {
    return dispatch(authenticationFailure({message: '填写有误', inputField: 'authentication'}))
  }
  const body = appendForm(blog.authentication.fields)
  return authentication(dispatch, url, { body })
}

export const login = () => (dispatch, getState) => {
  const { blog, router } = getState()
  const url = baseUrl + router.location.pathname
  if (!getFieldsValidate(blog.authentication.fields)) {
    return dispatch(authenticationFailure({message: '填写有误', inputField: 'authentication'}))
  }
  const { username, password, captcha } = getFieldsValues(blog.authentication.fields)
  const body = {username, password, captcha}
  const headers = { "Content-Type": "application/json" }
  return authentication(dispatch, url, {body: JSON.stringify(body), headers})
}

export const handleInputChange = (inputField, field, { pattern, message}, event) => (dispatch, getState) => {
  const value = event.target.value
  let result = false
  const regExp = pattern && new RegExp(pattern)
  if ( regExp && regExp.test(value) ) {
    message = ''
    result = true
  }
  dispatch({
    type: 'INPUTFIELD_CHANGE',
    inputField,
    field,
    data: {
      value,
      error: message,
      validate: result
    }
  })
}

export const handleFileChange = (inputField, field, { pattern, message }, event) => (dispatch, getState) => {
  const file = event.target.files[0]  
  if (!file) {
     return 
  }
  let result = false
  const regExp = pattern && new RegExp(pattern)

  // 匹配类型为image/开头的字符串
  if (regExp && regExp.test(file.type)) {
    result = true
    message = ''
  }
  dispatch({
    type: 'INPUTFIELD_CHANGE',
    inputField,
    field,
    data: {
      value: file,
      suffix: file.name,
      validate: result,
      error: message
    }
  })

}

export const handleInitTimeline = () => ({ type: 'TIMELINESTATE_INIT'})

export const handleXHRAbort = () => ({ type: 'XHR_ABORT' })

export const handleSignout = () => (dispatch, getState) => {
  dispatch({ type: 'SIGNOUT' })
  return ajax('GET', baseUrl + '/signout').then(({data}) => console.log(data.message), err => console.log(err))
} 

export const handleSaveState = () => ({ type: 'SAVE_STATE'})
