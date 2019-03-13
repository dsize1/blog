import React, {Component} from 'react'
import {connect} from 'react-redux'
import PostsList from '../stateless_component/PostsList'
import Comet from './Comet'
import { 
  handleQueryHomePosts,
  handleQueryNewPublish,
  initLastFetch
} from '../../actions/blog'

class Home extends Component {
  constructor (props) {
    super(props)
    this._handleQueryNewPublish = this.props.handleQueryNewPublish.bind(null, this.props.handleQueryHomePosts)
  }

  componentDidMount () {
    const timeline = this.props.homeTimeline.timeline
    if (timeline.length === 0) {
      this.props.handleQueryHomePosts()
    } else {
      const posts = this.props.posts
      const top = timeline[0]
      const bottom = timeline[timeline.length-1]
      this.props.initLastFetch(posts.entities[top].created_at, posts.entities[bottom].created_at)
    }
  }

  render () {
    const {
      timeline,
      loading,
      isLoadingDirection
    } = this.props.homeTimeline
    return (
      <div className='Home'>
        <Comet
          handleQueryNewPublish={this._handleQueryNewPublish}/>
        <PostsList
          isLoadingDirection={isLoadingDirection}
          loading={loading}
          handleQueryRequest={this.props.handleQueryHomePosts}
          itemHeight={250}
          timeline={timeline}
          posts={this.props.posts}
        />
      </div>
    )
  }
} 

const mapStateToProps = (state) => ({ 
  homeTimeline: state.blog.homeTimeline,
  posts: state.blog.entities.posts,
})
const mapDispatchToProps = (dispatch) => ({
  handleQueryHomePosts: (...args) => dispatch(handleQueryHomePosts(...args)),
  handleQueryNewPublish: (...args) => dispatch(handleQueryNewPublish(...args)),
  initLastFetch: (...args) => dispatch(initLastFetch(...args))
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home)

export default ConnectedComponent