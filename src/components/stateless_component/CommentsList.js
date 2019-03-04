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
      return  (
        <li
          key={comment_id}
          className={`comment-${idx}`}>
          <Comment 
            index={idx}
            avatar={avatar}
            user_id={user_id}
            username={props.username}
            author={author}
            content={content}
            created_at={created_at}
            updated_at={updated_at}/>
        </li>
      )
    })}
  </ul>
)

CommentsList.propTypes = {
  timeline: PropTypes.array.isRequired,
  comments: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
}

export default withPaginationController(CommentsList)