import React, {Component} from 'react'
import {connect} from 'react-redux'
import PostsList from '../stateless_component/PostsList'
import Comet from './Comet'

import { 
  handleQueryHomePosts,
  handleQueryNewPublish,
} from '../../actions/blog'

class Home extends Component {
  constructor (props) {
    super(props)
    this._handleQueryNewPublish = this.props.handleQueryNewPublish.bind(null, this.props.handleQueryHomePosts)
  }

  componentDidMount () {
    if (this.props.homeTimeline.timeline.length === 0) {
      this.props.handleQueryHomePosts()
    }
  }

  render () {
    const {
      timeline,
      loading,
      isLoadingDirection,
      hasMore
    } = this.props.homeTimeline
    return (
      <div className='Home'>
        <Comet
          handleQueryNewPublish={this._handleQueryNewPublish}/>
        <PostsList
          hasMore={hasMore}
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
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home)

export default ConnectedComponent