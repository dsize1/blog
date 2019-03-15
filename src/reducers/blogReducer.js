import produce from 'immer'
import BraftEditor from 'braft-editor'

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
    unreadCount: 0
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
        help: '账号需由长度为6至16个字母或数字组成，首字符须为字母。',
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
        help: '只能上传图片。',
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
        suffix: '/api/captcha',
        value: '',
        help: '输入验证码，注意大小写。',
        error: '',
        validate: false,
        validator: {
          pattern: '^\\S+$',
          message: '验证码不能为空。'
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
          pattern: '^[\\S\\s]{6,}$',
          message: '标题不可少于6个字。'
        }
      },
      content: {
        required: true,
        type: 'draft',
        name: 'content',
        prefix: '',
        suffix: '',
        value: BraftEditor.createEditorState(null),
        controls: ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'media', 'emoji', 'blockquote', 'code', 'clear', 'undo', 'redo'],
        help: '',
        error: '',
        validate: false,
        validator: {
          pattern: '(?<=,"text":)(.)*?(?=,"type":"unstyled")',
          minLength: 8,
          message: '内容不可少于8个字,上传图片不要大于50kb。',
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
        type: 'draft',
        name: 'content',
        prefix: '',
        suffix: '',
        value: BraftEditor.createEditorState(null),
        controls: ['italic', 'underline', 'text-color', 'emoji', 'clear'],
        help: '',
        error: '',
        validate: false,
        validator: {
          pattern: '(?<=,"text":)(.)*?(?=,"type":"unstyled")',
          minLength: 8,
          maxLength: 150,
          maxLine: 6,
          message: '评论字数不够或者篇幅过长(须150个字以内)。'
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
    case 'INIT_LAST_FETCH': 
      return produce(state, draft => {

        draft.homeTimeline.lastFetch = action.payload

      })
    case 'FIRST_QUERY_REQUEST':
      return produce(state, draft => {

        draft.homeTimeline.lastFetch.top = action.payload.lastFetch

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
    case 'QUERY_POSTS_WITH_ENTITY_SUCCESS': 
      return produce(state, draft => {

        const {
          user_id,
          ids,
          data,
          entity
        } = action.payload
        draft.entities['users'].entities[user_id] = {
          ...entity,
          user_id,
          timeline: ids
        }
        draft.entities['users'].fetchStatus[user_id] = 'loaded'
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
    case 'DELETE_REQUEST':
    case 'UPDATE_REQUEST':
      return produce(state, draft => {

        draft.homeTimeline.loading = true

      })

    case 'DELETE_REQUEST_SUCCESS':
    return produce(state, draft => {

      const {post_id, id} = action.payload
      draft.homeTimeline.loading = false
      draft.entities.posts.entities[post_id].timeline = draft.entities.posts.entities[post_id].timeline.filter((comment_id) => id !== comment_id)
      delete draft.entities.comments.entities[id] 
      delete draft.entities.comments.fetchStatus[id]

    })
    case 'UPDATE_COMMENT_REQUEST_SUCCESS':
      return produce(state, draft => {

        Object.entries(action.payload.entity).forEach(([key, value]) => {
          draft.entities.comments.entities[action.payload.id][key] = value
        })

      })
    case 'UPDATE_POST_REQUEST_SUCCESS':
      return produce(state, draft => {

        Object.entries(action.payload.entity).forEach(([key, value]) => {
          draft.entities.posts.entities[action.payload.id][key] = value
        })

      })
    case 'DELETE_REQUEST_FAILURE':
      return produce(state, draft => {

        const {message} = action.payload
        draft.homeTimeline.loading = false
        console.log(message)

      })
    case 'UPDATE_REQUEST_FAILURE': 
      return produce(state, draft => {

        const {message, inputField} = action.payload
        draft.homeTimeline.loading = false
        draft[inputField].message = message
        console.log(message)

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
        draft.homeTimeline.lastFetch[action.payload.direction] = action.payload.lastFetch

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
        draft.entities.posts.entities[post_id].timeline.push(id)
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
        const fields = state[inputField].fields
        if (message) {
          draft[inputField].message = ''
        }
        Object.keys(fields).forEach(field => {
          draft[inputField].fields[field].value = fields[field].type !== 'draft' ? '' : BraftEditor.createEditorState(null)
          draft[inputField].fields[field].error = ''
          draft[inputField].fields[field].prefix = ''
          draft[inputField].fields[field].suffix = ''
          draft[inputField].fields[field].validate = false
        })

      })
    case 'TRANSMIT_VALUES':
      return produce(state, draft => {

        const { inputField, entries } = action.payload
        Object.entries(entries).forEach(([field, value]) => {
          draft[inputField].fields[field].value = field !== 'content' ? value : BraftEditor.createEditorState(value)
          draft[inputField].fields[field].validate = field !== 'content' ? true : false
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