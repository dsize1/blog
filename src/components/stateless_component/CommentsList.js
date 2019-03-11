import React from 'react'
import PropTypes from 'prop-types'
import Comment from '../stateless_component/Comment'
import withPaginationController from '../container_component/withPaginationController'

const CommentsList = (props) => (
  <ul>
    { props.timeline.map((comment_id, idx) => {
      if (!props.comments.entities[comment_id]
        || Math.floor(idx / props.pageSize) !== props.current - 1) {
          return null
      }
      const {
        user_id,
        author,
        avatar,
        content,
        created_at,
        updated_at
      } = props.comments.entities[comment_id]
      const _handleDelComment = props.handleDelComment.bind(null, comment_id)
      const _handleStartUp = props.handleStartUp.bind(null, {content}, comment_id, created_at)
      return  (
        <li
          key={comment_id}
          className={`comment-${idx}`}>
          <Comment 
            id={comment_id}
            avatar={avatar}
            user_id={user_id}
            self_id={props.self_id}
            author={author}
            content={content}
            created_at={created_at}
            updated_at={updated_at}
            handleDelComment={_handleDelComment}
            handleStartUp={_handleStartUp}/>
        </li>
      )
    })}
  </ul>
)

CommentsList.propTypes = {
  timeline: PropTypes.array.isRequired,
  comments: PropTypes.object.isRequired,
  self_id: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  handleDelComment: PropTypes.func.isRequired,
  handleStartUp: PropTypes.func.isRequired,
}

export default withPaginationController(CommentsList)