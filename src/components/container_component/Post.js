import React, { Component } from 'react'
import styled from 'styled-components'
import Form from '../form/Form'
import FormTextarea from '../form/FormTextarea'
import { connect } from 'react-redux'
import {
  handleQueryComments,
  handleInputChange,
  handlePublishComment
} from '../../actions/blog'
import CommentsList from '../stateless_component/CommentsList'
import User from '../stateless_component/User'
import Timestamp from '../stateless_component/Timestamp'

const StyledPost = styled.div`
    &>.post-container {
      padding: 20px 15px 19px;
      border-bottom: 1px solid #eee;
    }
      &>.post-container>h2 {
          word-wrap: break-word;
      }

      &>.post-container>.user {
        margin: 1rem 100px;
        min-height: 100px;
        max-height: 100px;
      }

      &>.post-container>.user+p {
        word-wrap: break-word;
      }
`

class Post extends Component {
  constructor (props) {
    super(props)
    this.post_id = this.props.match.params.post_id
    this.handlePublishComment = this.props.handlePublishComment.bind(null, this.post_id)
  }

  componentWillMount () {
    if (!this.props.postsEntities[this.post_id] ||
      this.props.postsEntities[this.post_id].timeline.length === 0) {
      this.props.handleQueryRequest(this.post_id)
    }
  }

  render () {
    const {
      title,
      content,
      avatar,
      author,
      user_id,
      created_at,
      updated_at,
      timeline
    } = this.props.postsEntities[this.post_id]
    return (
      <>
        <StyledPost>
          <div className="post-container">
            <h2>{title}</h2>
            <div className="user">
              <User avatar={avatar} user_id={user_id} username={author}/>
            </div>
            <p>{content}</p>
            <div className="timeStamp">
              <Timestamp created_at={created_at} updated_at={updated_at}/>
            </div>
          </div>
          <Form
            btnTxt={'发布'}
            fieldsName={'commentEditor'}
            inputField={this.props.inputField}
            handleSubmit={this.handlePublishComment}
            handleInputChange={this.props.handleInputChange}>
            <FormTextarea
              requiredVisible={false}
              name={'content'}/>
          </Form>
          <CommentsList
            total={timeline.length}
            username={author}
            timeline={timeline}
            comments={this.props.comments}/>
        </StyledPost>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  postsEntities: state.blog.entities.posts.entities,
  comments: state.blog.entities.comments,
  inputField: state.blog.commentEditor
})
const mapDispatchToProps = (dispatch) => ({
  handleQueryRequest: (...args) => dispatch(handleQueryComments(...args)),
  handleInputChange: (...args) => dispatch(handleInputChange(...args)),
  handlePublishComment: (post_id) => dispatch(handlePublishComment(post_id))
})
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Post)

export default ConnectedComponent