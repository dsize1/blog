const express = require('express')
// const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const upload = multer({dest: path.join(__dirname, './avatars')})
const svgCaptcha = require('svg-captcha')

const port = 8080

const connectToMongoDB = () => {

  const dbURL = 'mongodb://localhost:27017/blog'
  const connectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, 
    reconnectTries: Number.MAX_VALUE, 
    reconnectInterval: 500, 
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, 
    socketTimeoutMS: 45000, 
    family: 4 
  }
  mongoose.connect(dbURL, connectOptions).then(
    () => {},
    (err) => console.log(err)
  )

  const schemaOptions = null

  const _callback = function (result) {
    return result
  }
  const _create = function (document) {
    return this.create(document).then(_callback)
  }

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
    },
    password: String,
    avatar: String,
  }, schemaOptions)
  userSchema.statics.login = function (query, selection) {
    return this.findOne(query).select(selection).exec().then(_callback, _callback)
  }
  userSchema.statics.hasUser = function (query) {
    return this.findOne(query).exec().then(_callback, _callback)
  }
  userSchema.statics.signup = _create
  const User = mongoose.model('User', userSchema)

  const postSchema = new mongoose.Schema({
    user_id: String,
    author: String,
    title: String,
    content: String,
    created_at: Number,
    updated_at: Number,
    avatar: String,
  }, schemaOptions)
  postSchema.statics.addPost = _create
  postSchema.statics.getPosts = function (direction, lastFetch, query = {}) {
    const compare = direction === 'b' ? 'lt' : 'gt'
    return this.find(query)
      .where('created_at')[compare](lastFetch)
      .limit(15)
      .sort('-created_at')
      .exec()
      .then(_callback, _callback)
  }
  const Post = mongoose.model('Post', postSchema)

  const commentSchema = new mongoose.Schema({
    post_id: String,
    avatar: String,
    author: String,
    user_id: String,
    content: String,
    created_at: Number,
    updated_at: Number
  }, schemaOptions)
  commentSchema.statics.addComment = _create
  commentSchema.statics.getComments = function (query) {
    return this.find(query).sort('-created_at').exec().then(_callback, _callback)
  }
  const Comment = mongoose.model('Comment', commentSchema)

  return {
    User,
    Post,
    Comment,
  }
}

const {
  User,
  Post,
  Comment
} = connectToMongoDB()

const sessions = {

}

setInterval(() => {
  Object.entries(sessions).forEach(([key, {timestamp, text}]) => {
    console.log(key, timestamp, text)
    if (Date.now() - timestamp > 1000 * 60 * 5) {
      delete sessions[key]
    }
  })
  console.log(sessions)
}, 1000 * 60 * 5);

const app = express()

// app.use((req, res, next) => {
//   console.log(req.method, req.url, req.body)
//   next()
// })
//  cors
// app.use(cors())

//  static resource
const staticOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static(path.join(__dirname, 'build'), staticOptions))
app.use('/avatars',express.static(path.join(__dirname, './avatars'), staticOptions))

//  cookie parser
app.use(cookieParser('woailijinyan'))
const cookieOptions = {
  signed: true,
  maxAge: 1000 * 60 * 60 * 72,
  httpOnly: true
}
const sessionOptions = {
  signed: true,
  maxAge: 1000 * 60 * 5,
  httpOnly: true
}

//  body parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.use(function sessionMiddleware(req, res, next) {
  if (!req.signedCookies.sessionId) {
    res.cookie('sessionId', Math.random().toString(16).substr(2), sessionOptions)
  }
  next()
})

app.get(/^\/(?!api\/)\S*$/, async (req, res, next) => {
  console.log(1)
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/api/captcha', (req, res, next) => {
  let sessionId = req.signedCookies.sessionId
  console.log(sessionId)
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1i',
    noise: 3,
  })
  sessions[sessionId] = {
    text: captcha.text,
    timestamp: Date.now()
  }
  res.type('svg')
  res.status(200).send(captcha.data)
})

app.route('/api/authentication')
  .post(async (req, res, next) => {
    console.log(1)
    const sessionId = req.signedCookies.sessionId
    const {username, password, captcha} = req.body  
    const query = {
      username,
      password
    }      
    const selection = {
      password: 0
    }
    const user = await User.login(query, selection) 
    if (user && sessionId && sessions[sessionId] && sessions[sessionId].text === captcha) {
      const id = user._id.toString()
      const { avatar } = user
      res.cookie('userId', id, cookieOptions)
      req._databaseResponse = {
        data: {
          id,
          avatar,
          username
        },
        errors: user.errors,
        errorText: 'Internal server error, Login again please.' 
      }
      next()
    } else {
      res.status(403).send({ message: 'Captcha or password is not correct!' })
    }
  })

app.get('/api/signout', (req, res, next) => {
  res.clearCookie('sessionId')
  res.clearCookie('userId')
  req._databaseResponse = {
    data: {
      message: 'out'
    },
    errors: false,
    errorText: ''
  }
  next()
})

app.route('/api/authentication/signup')
  .post(upload.single('avatar'), async (req, res, next) => {
    const sessionId = req.signedCookies.sessionId
    const {username, password, captcha} = req.body
    if (sessionId && sessions[sessionId] && sessions[sessionId].text === captcha) {
      if (!username || !password) {
        res.status(500).send({message: 'Internal server error! Signup again please .'})
      } else {
        const avatar = req.file ? req.file.filename : 'unknown'
        const query = { username }
        const hasUser = await User.hasUser(query)
        if (hasUser) {
          res.status(400).send({ message: 'Username has been used!' })
        } else {
          const user = await User.signup({ username, password, avatar })
          const id = user._id.toString()
          res.cookie('userId', id, cookieOptions)
          req._databaseResponse = {
            data: {
              id,
              avatar,
              username
            },
            errors: user.errors,
            errorText: 'Internal server error! Signup again please .'
          }
          next()
        } 
      }
    } else {
      req._databaseResponse = {
        data: {},
        errors: true,
        errorText: 'Captcha fault, Login again please.'
      }
      next()
    }
  })

// app.route('/users/:userid')
//   .get(async (req, res, next) => {
    
//   })

app.route('/api/user/:userid')
  .get(async (req, res, next) => {
    const direction = req.query.d
    const lastFetch = req.query.l
    const query = {user_id: req.params.userid}
    const result = await Post.getPosts(direction, lastFetch, query)
    const posts = result.map((model) => ({
      author: model.author,
      user_id: model.user_id,
      id: model.id,
      avatar: model.avatar,
      title: model.title,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at
    }))
    req._databaseResponse = {
      data: posts ,
      errors: result.some((model) => model.errors !== undefined),
      errorText: 'Internal server error!'
    }
    next()
  })
  .post(async (req, res, next) => {
    const user_id = req.params.userid
    if (user_id !== req.signedCookies.userId) {
      res.clearCookie('sessionId')
      res.clearCookie('userId')
      res.redirect(302, '/authentication')
    }
    const post = await Post.addPost({
      ...req.body,
      user_id
    })
    req._databaseResponse = {
      data: {
        id: post._id.toString()
      },
      errors: post.errors,
      errorText: 'Internal server error! Publish again Please.'
    }
    next()
})

app.route('/api/home')
  .get(async (req, res, next) => {
    const direction = req.query.d
    const lastFetch = req.query.l
    const result = await Post.getPosts(direction, lastFetch)
    const posts = result.map((model) => ({
      author: model.author,
      avatar: model.avatar,
      user_id: model.user_id,
      id: model.id,
      title: model.title,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at
    }))
    req._databaseResponse = {
      data: posts ,
      errors: result.some((model) => model.errors !== undefined),
      errorText: 'Internal server error!'
    }
    next()
})

app.route('/api/post/:postid')
  .get(async (req, res, next) => {
    const post_id = req.params.postid
    const result = await Comment.getComments({post_id})
    const comments = result.map((model) => ({
      author: model.author,
      avatar: model.avatar,
      user_id: model.user_id,
      post_id: model.post_id,
      id: model.id,
      content: model.content,
      created_at: model.created_at,
      updated_at: model.updated_at
    }))
    req._databaseResponse = {
      data: comments ,
      errors: result.some((model) => model.errors !== undefined),
      errorText: 'Internal server error!'
    }
    next()
  })
  .post(async (req, res, next) => {
    if (req.body.user_id !== req.signedCookies.userId) {
      res.clearCookie('sessionId')
      res.clearCookie('userId')
      res.redirect(302, '/authentication')
    }
    const post_id = req.params.postid
    const comment = await Comment.addComment({
      ...req.body,
      post_id
    })
    req._databaseResponse = {
      data: {
        id: comment._id.toString()
      },
      errors: comment.errors,
      errorText: 'Internal server error! Publish again Please .'
    }
    next()
  })

app.use((req, res, next) => {
  if (!req._databaseResponse) {
    console.log('miss')
    return void 0
  }
  const {
    data,
    errorText,
    errors
  } = req._databaseResponse
  if (!errors) {
    console.log(data)
    res.json({data})
  } else {
    console.log(errorText)
    res.status(500).send({message: errorText})
  }
})

app.listen(port, () => {
  console.log('server listening on port', port)
})
