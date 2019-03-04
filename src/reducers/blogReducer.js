import produce from 'immer'

const defaultState = {
  homeTimeline: {
    timeline: [],
    cursor: {
      bottom: null,
      top: null
    },
    loading: false,
    lastFetch: {
      bottom: null,
      top: null
    },
    isLoadingDirection: 'none',
    atEnd: false,
    unreadCount: 0,
    hasMore: true,
  },
  entities: {
    posts: {
      entities: {},
      fetchStatus: {},
    },
    comments: {
      entities: {},
      fetchStatus: {},
    },
    users: {
      entities: {},
      fetchStatus: {},
    }
  },  
  user: {
    username: '',
    id: '',
    avatar: '',
  },
  authentication: {
    status: '',
    message: '',
    fields: {
      username: {
        required: true,
        type: 'text',
        name: 'username',
        prefix: '',
        suffix: '',
        value: '',
        help: '账号需由长度为6至16个字母或数字组成，且首字符必须为字母。',
        error: '',
        validate: false,
        validator: {
          pattern: '^[a-zA-Z][a-zA-Z0-9]{5,15}$',
          message: '输入有误。'
        }
      },
      password: {
        required: true,
        type: 'password',
        name: 'password',
        prefix: '',
        suffix: '',
        value: '',
        help: '密码需由长度为6至18个字母或数字组成。',
        error: '',
        validate: false,
        validator: {
          pattern: '^[a-zA-Z0-9]{6,18}$',
          message: '输入有误。'
        }
      },
      avatar: {
        required: false,
        type: 'file',
        name: 'avatar',
        prefix: '',
        suffix: '',
        value: '',
        accept: 'image/png, image/jpeg, image/gif, image/jpg, image/svg+xml',
        help: '只能上传以下类型的图片：png, jpeg, gif, jpg, svg。',
        error: '',
        validate: false,
        validator: {
          pattern: '^image\\/(png|jpeg|gif|jpg|svg\\+xml)$',
          message: '上传类型有误。'
        }
      },
      captcha: {
        required: true,
        type: 'text',
        name: 'captcha',
        prefix: '',
        suffix: '/captcha',
        value: '',
        help: '输入验证码，注意大小写。',
        error: '',
        validate: false,
        validator: {
          pattern: '^\\S+$',
          message: '验证码不能为空'
        }
      },
    }
  },
  postEditor: {
    status: '',
    message: '',
    fields: {
      title: {
        required: true,
        type: 'text',
        name: 'title',
        prefix: '',
        suffix: '',
        value: '',
        help: '',
        error: '',
        validate: false,
        validator: {
          pattern: '^[\\S\\s]{8,}$',
          message: '标题不可少于8个字'
        }
      },
      content: {
        required: true,
        name: 'content',
        prefix: '',
        suffix: '',
        value: '',
        help: '',
        error: '',
        validate: false,
        validator: {
          pattern: '^[\\S\\s]{10,150}$',
          message: '内容不可少于10个字或者多于了150个字'
        }
      }
    }
  },
  commentEditor: {
    status: '',
    message: '',
    fields: {
      content: {
        required: true,
        name: 'content',
        prefix: '',
        suffix: '',
        value: '',
        help: '',
        error: '',
        validate: false,
        validator: {
          pattern: '^[\\S\\s]{10,150}$',
          message: '评论字数不够或者多于了150个字。'
        }
      }
    }
  }
}

const blogReducer = (state, action) => {
  if (!state) {
    const stateStorage = sessionStorage.getItem('stateStorage')
    if (stateStorage) {
      return JSON.parse(stateStorage)
    }
    return defaultState
  }
  switch (action.type) {
    case 'FIRST_QUERY_REQUEST':
      return produce(state, draft => {

        draft.homeTimeline.lastFetch.top = action.payload.lastFetch

      })
    case 'QUERY_NOTING_MORE':
      return produce(state, draft => {

        draft.homeTimeline.hasMore = false

      })
    case 'QUERY_REQUEST': 
      return produce(state, draft => {
 
        draft.homeTimeline.loading = true
        draft.homeTimeline.isLoadingDirection = action.payload.direction

      })
    case 'TIMELINESTATE_QUERY_UPDATED':
      return produce(state, draft => {

        const {
          unreadCount,
          direction,
          lastFetch
        } = action.payload
        draft.homeTimeline.loading = false
        draft.homeTimeline.isLoadingDirection = 'none'
        draft.homeTimeline.unreadCount = unreadCount
        draft.homeTimeline.lastFetch[direction] = lastFetch

      })
    case 'QUERY_HOME_POSTS_SUCCESS':
      return produce(state, draft => {
        
        const {
          method,
          ids,
          data
        } = action.payload
        draft.homeTimeline.timeline[method](...ids)
        data.forEach(post => {
          draft.entities.posts.entities[post.id] = {
            ...post,
            timeline: []
          }
          draft.entities.posts.fetchStatus[post.id] = 'loaded'
        }) 
        
      })
    case 'QUERY_USER_POSTS_SUCCESS': 
      return produce(state, draft => {

        const {
          user_id,
          method,
          ids,
          data
        } = action.payload
        draft.entities.users.entities[user_id].timeline[method](...ids)
        data.forEach(post => {
          draft.entities.posts.entities[post.id] = {
            ...post,
            timeline: []
          }
          draft.entities.posts.fetchStatus[post.id] = 'loaded'
        })

      })
    case 'QUERY_COMMENTS_SUCCESS':
      return produce(state, draft => {

        const {
          post_id,
          ids,
          method,
          data
        } = action.payload
        draft.entities.posts.entities[post_id].timeline[method](...ids)
        data.forEach(comment => {
          draft.entities.comments.entities[comment.id] = {
            ...comment,
            timeline: []
          }
          draft.entities.comments.fetchStatus[comment.id] = 'loaded'
        })

      })
    case 'QUERY_REQUEST_FAILURE': 
      return produce(state, draft => {

        draft.homeTimeline.loading = false
        draft.homeTimeline.isLoadingDirection = 'none'
        console.log(action.payload.error)

      })
    case 'PUBLISH_REQUEST': 
      return produce(state, draft => {

        draft.homeTimeline.loading = true
        draft.homeTimeline.isLoadingDirection = 'top'

      })
    case 'TIMELINE_STATE_PUBLISH_UPDATE':
      return produce(state, draft => {

        draft.homeTimeline.loading = true
        draft.homeTimeline.isLoadingDirection = 'none'
        draft.homeTimeline.lastFetch.top = action.payload.id

      })
    case 'PUBLISH_POST_SUCCESS': 
      return produce(state, draft => {

        const {
          user_id,
          id,
          entity
        } = action.payload
        draft.entities.users.entities[user_id].timeline.unshift(id)
        draft.entities.posts.entities[id] = {...entity, timeline: []}
        draft.entities.posts.fetchStatus[id] = 'loaded'

      })
    case 'PUBLISH_COMMENT_SUCCESS': 
      return produce(state, draft => {

        const {
          post_id,
          id,
          entity
        } = action.payload
        draft.entities.posts.entities[post_id].timeline.unshift(id)
        draft.entities.comments.entities[id] = {...entity, timeline: []}
        draft.entities.comments.fetchStatus[id] = 'loaded'

      })
    case 'PUBLISH_REQUEST_FAILURE': 
      return produce(state, draft => {

        const {message, inputField} = action.payload
        draft.homeTimeline.loading = false
        draft.homeTimeline.isLoadingDirection = 'none'
        draft[inputField].message = message

      })
    case 'AUTHENTICATION': 
      return produce(state, draft => {

        draft.homeTimeline.loading = true

      })
    case 'AUTHENTICATION_SUCCESS':
      return produce(state, draft => {

        const {
          username,
          id,
          avatar
        } = action.payload
        draft.homeTimeline.loading = false
        draft.user.username = username
        draft.user.id = id
        draft.user.avatar = avatar
        draft.entities['users'].entities[id] = {
          username,
          id,
          avatar,
          timeline: []
        }
        draft.entities['users'].fetchStatus[id] = 'loaded' 

      })
    case 'AUTHENTICATION_FAILURE':
      return produce(state, draft => {

        const {message, inputField} = action.payload
        draft.homeTimeline.loading = false
        draft[inputField].message = message

      })
    case 'TRACKING_DATA':
      return produce(state, draft => {

      })
    case 'TRACKED_DATA':
      return produce(state, draft => {

      })
    case 'INPUTFIELD_CHANGE':
      return produce(state, draft => {

        const {
          inputField,
          field,
          data
        } = action
        Object.entries(data).forEach(([key, value]) => {
          draft[inputField].fields[field][key] = value
        })

      })
    case 'INPUTFIELD_INIT':
      return produce(state, draft => {
        
        const { inputField, message} = action.payload
        if (message) {
          draft[inputField].message = ''
        }
        Object.keys(state[inputField].fields).forEach(field => {
          draft[inputField].fields[field].value = ''
          draft[inputField].fields[field].error = ''
          draft[inputField].fields[field].prefix = ''
          draft[inputField].fields[field].suffix = ''
          draft[inputField].fields[field].validate = false
        })

      })
    case 'SIGNOUT':
      sessionStorage.removeItem('stateStorage')
      return produce(state, draft => {

        draft.user.username = ''
        draft.user.id = ''
        draft.user.avatar = ''

      })
    case 'SAVE_STATE':
      const {
        homeTimeline,
        entities,
        user
      } = state
      const {
        authentication,
        postEditor,
        commentEditor
      } = defaultState
      sessionStorage.setItem('stateStorage', JSON.stringify({
        homeTimeline,
        entities,
        user,
        authentication,
        postEditor,
        commentEditor
      }))
      return state  
    case 'TIMELINESTATE_INIT':
      return produce(state, draft => {

        draft.homeTimeline.cursor.bottom = null
        draft.homeTimeline.cursor.top = null
        draft.homeTimeline.loading =  false
        draft.homeTimeline.lastFetch.bottom = null
        draft.homeTimeline.lastFetch.top = null
        draft.homeTimeline.isLoadingDirection = 'none'
        draft.homeTimeline.atEnd = false
        draft.homeTimeline.unreadCount = 0

      })
    case 'XHR_ABORT':
      return produce(state, draft => {

      })
    default:
      return state
  }
}

export default blogReducer