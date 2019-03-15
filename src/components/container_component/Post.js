import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import BraftEditor from 'braft-editor'
import {
  handleQueryComments,
  handlePublishComment,
  handleDelComment,
  handleUpdateComment,
  handleUpdatePost,
  initInputField,
  transmitValues
} from '../../actions/blog'
import CommentsList from '../stateless_component/CommentsList'
import User from '../stateless_component/User'
import Dropdown from '../stateless_component/Dropdown'
import Timestamp from '../stateless_component/Timestamp'
import CommentEditor from './CommentEditor'
import UpdateCommentEditor from './UpdateCommentEditor'
import UpdatePostEditor from './UpdatePostEditor'

const StyledPost = styled.div`
    &>.post-container {
      padding: 1rem .75rem;
    }
      &>.post-container>div:nth-of-type(1) {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
      }

      &>.post-container>div:nth-of-type(1)>h2 {
        word-wrap: break-word;
      }

      &>.post-container>.user {
        margin: 1rem 5rem;
        min-height: 5rem;
        max-height: 5rem;
      }

      &>.post-container>.user+p {
        word-wrap: break-word;
      }
`

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUpdateEditor: '',
      handleUpdate: null
    }

    const initInputField = this.props.initInputField
    const transmitValues = this.props.transmitValues
    this.commentEditorLayer = null
    this.setCommentEditorLayerRef = el => this.commentEditorLayer = el
    this.post_id = this.props.match.params.post_id
    this._handlePublishComment = this.props.handlePublishComment.bind(null, this.post_id)
    this._handleDelComment = this.props.handleDelComment.bind(null, this.post_id)
    this._handleCloseCommentEditor = this._handleShutDown.bind(this, initInputField, 'commentEditor')
    const _handleUpdateComment = this.props.handleUpdateComment.bind(this, this._handleCloseCommentEditor, this.post_id)
    this._handleOpenCommentEditor = this._handleStartUp.bind(this, transmitValues, 'commentEditor', _handleUpdateComment)

    this.postEditorLayer = null
    this.setPostEditorLayerRef = el => this.postEditorLayer = el
    this._handleClosePostEditor = this._handleShutDown.bind(this, initInputField, 'postEditor')
    const _handleUpdatePost = this.props.handleUpdatePost.bind(this, this._handleClosePostEditor, this.props.self_id)
    this._handleOpenPostEditor = this._handleStartUp.bind(this, transmitValues, 'postEditor', _handleUpdatePost)
  }

  _handleShutDown (initInputField, inputField, event) {
    if (!event 
      || event.target === this.commentEditorLayer 
      || event.target === this.postEditorLayer) { 
      initInputField(inputField, true)
      this.setState({
        currentUpdateEditor: '',
        handleUpdate: null,
      })
    }
  }

  _handleStartUp (transmitValues, inputField, handleUpdate, entries, id, created_at) {
    transmitValues(inputField, entries)
    this.setState({
      currentUpdateEditor: inputField,
      handleUpdate: handleUpdate.bind(this, id, created_at)
    })
  }

  componentDidMount () {
    if (!this.props.postsEntities[this.post_id] 
      || this.props.postsEntities[this.post_id].timeline.length === 0) {
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
    const handleOpenPostEditor = this._handleOpenPostEditor.bind(null, 
      { title, content }, 
      this.post_id, 
      {user_id, author, avatar, created_at})
    const display = user_id === this.props.self_id ? 'flow-root' : 'none'
    const updateCommentEditorFields = this.state.currentUpdateEditor === 'commentEditor' ? this.props.commentEditor : null
    const UpdatePostEditorFields = this.state.currentUpdateEditor === 'postEditor' ? this.props.postEditor : null
    const commentEditorFields = this.state.currentUpdateEditor === '' ? this.props.commentEditor : null
    return (
      <>
        <StyledPost>
          <div className="post-container">
            <div>
              <h2>{title}</h2>              
              <Dropdown display={display}>
                <li onClick={handleOpenPostEditor}>编辑</li>
              </Dropdown>
            </div>
            <div className="user">
              <User avatar={avatar} user_id={user_id} username={author}/>
            </div>
            <p dangerouslySetInnerHTML={{__html: BraftEditor.createEditorState(content).toHTML()}}></p>
            <div className="timeStamp">
              <Timestamp created_at={created_at} updated_at={updated_at}/>
            </div>
          </div>
          <CommentEditor
            inputField={commentEditorFields}
            handleSubmit={this._handlePublishComment}/>
          <CommentsList
            total={timeline.length}
            self_id={this.props.self_id}
            timeline={timeline}
            comments={this.props.comments}
            handleStartUp={this._handleOpenCommentEditor}
            handleDelComment={this._handleDelComment}/>
        </StyledPost>
        <UpdateCommentEditor
          outerlayer={this.setCommentEditorLayerRef}
          alive={this.state.currentUpdateEditor==='commentEditor'}
          handleShutDown={this._handleCloseCommentEditor}
          inputField={updateCommentEditorFields}
          handleSubmit={this.state.handleUpdate}/>
        <UpdatePostEditor
          outerlayer={this.setPostEditorLayerRef}
          alive={this.state.currentUpdateEditor==='postEditor'}
          handleShutDown={this._handleClosePostEditor}
          inputField = {UpdatePostEditorFields}
          handleSubmit={this.state.handleUpdate}/>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  postsEntities: state.blog.entities.posts.entities,
  comments: state.blog.entities.comments,
  commentEditor: state.blog.commentEditor,
  postEditor: state.blog.postEditor,
  self_id: state.blog.user.id
})
const mapDispatchToProps = (dispatch) => ({
  handleQueryRequest: (...args) => dispatch(handleQueryComments(...args)),
  handleUpdateComment: (...args) => dispatch(handleUpdateComment(...args)),
  handleUpdatePost: (...args) => dispatch(handleUpdatePost(...args)),
  handlePublishComment: (...args) => dispatch(handlePublishComment(...args)),
  handleDelComment: (...args) => dispatch(handleDelComment(...args)),
  initInputField: (...args) => dispatch(initInputField(...args)),
  transmitValues: (...args) => dispatch(transmitValues(...args)),
})
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Post)

export default ConnectedComponent