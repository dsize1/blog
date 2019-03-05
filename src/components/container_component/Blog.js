import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../form/Form'
import FormInput from '../form/FormInput'
import FormTextarea from '../form/FormTextarea'
import PostsList from '../stateless_component/PostsList'
import { 
  handleQueryUserPosts,
  handleInputChange,
  handlePublishPost
 } from '../../actions/blog'

class Blog extends Component {
  constructor (props) {
    super(props)
    this.user_id = this.props.match.params.user_id
    this.self_id = this.props.self_id
    this._handleQueryRequest = this.props.handleQueryUserPosts.bind(this, this.user_id)
  }

  componentDidMount () {
    if (!this.props.usersEntities[this.user_id] 
      || this.props.usersEntities[this.user_id].timeline.length === 0) {
      this._handleQueryRequest()
    }
  }

  render () {
    const {
      loading,
      isLoadingDirection,
      hasMore
    } = this.props.homeTimeline
    const form = this.user_id === this.self_id && 
      ( <Form
          btnTxt={'发布'}
          fieldsName={'postEditor'}
          inputField={this.props.inputField}
          handleSubmit={this.props.handlePublishPost}
          handleInputChange={this.props.handleInputChange}>
          <FormInput 
            requiredVisible={false}
            name={'title'} 
            type={'text'}/>
          <FormTextarea 
            requiredVisible={false}
            name={'content'}/>
        </Form>)
    return (
      <div className='blog'>
        { form }
        <PostsList
          hasMore={hasMore}
          isLoadingDirection={isLoadingDirection}
          loading={loading}
          itemHeight={250}
          handleQueryRequest={this._handleQueryRequest}
          timeline={this.props.usersEntities[this.user_id].timeline}
          posts={this.props.posts}/>
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
  handleInputChange: (...args) => dispatch(handleInputChange(...args))
})
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Blog)

export default ConnectedComponent