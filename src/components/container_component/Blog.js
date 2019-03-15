import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostEditor from './PostEditor'
import PostsList from '../stateless_component/PostsList'
import Loading from '../stateless_component/Loading'
import { 
  handleQueryUserPosts,
  handlePublishPost,
  initLastFetch
 } from '../../actions/blog'

class Blog extends Component {
  constructor (props) {
    super(props)
    this.user_id = this.props.match.params.user_id
    this.self_id = this.props.self_id
    this._handleQueryRequest = this.props.handleQueryUserPosts.bind(this, this.user_id)
  }

  componentDidMount () {
    if (this.user_id === this.self_id && this.props.usersEntities[this.user_id].timeline.length === 0) {
      this._handleQueryRequest()
    } else if (!this.props.usersEntities.hasOwnProperty(this.user_id)) {
      this._handleQueryRequest(null, true)
    } else {
      const timeline = this.props.usersEntities[this.user_id].timeline
      const top = timeline[0]
      const bottom = timeline[timeline.length - 1]
      const posts = this.props.posts
      this.props.initLastFetch(posts.entities[top].created_at, posts.entities[bottom].created_at)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!nextProps.usersEntities.hasOwnProperty(this.user_id)) {
      return false
    }
    return true
  }

  render () {
    const {
      homeTimeline,
      inputField,
      handlePublishPost,
      usersEntities,
      posts
    } = this.props
    const {
      loading,
      isLoadingDirection
    } = homeTimeline
    const timeline = usersEntities[this.user_id] && usersEntities[this.user_id].timeline
    const ITEM_HEIGHT = 250
    if (!timeline) return (<><Loading/></>)
    return (
      <div className='blog'>
        { this.user_id === this.self_id 
          && <PostEditor
              inputField={inputField}
              handleSubmit={handlePublishPost}/> }
        <PostsList
          isLoadingDirection={isLoadingDirection}
          loading={loading}
          itemHeight={ITEM_HEIGHT}
          handleQueryRequest={this._handleQueryRequest}
          timeline={timeline}
          posts={posts}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ 
  self_id: state.blog.user.id,
  usersEntities: state.blog.entities.users.entities,
  posts: state.blog.entities.posts,
  inputField: state.blog.postEditor,
  homeTimeline: state.blog.homeTimeline,
})
const mapDispatchToProps = (dispatch) => ({
  handleQueryUserPosts: (...args) => dispatch(handleQueryUserPosts(...args)),
  handlePublishPost: () => dispatch(handlePublishPost()),
  initLastFetch: (...args) => dispatch(initLastFetch(...args))
})
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Blog)

export default ConnectedComponent