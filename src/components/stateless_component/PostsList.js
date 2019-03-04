import React from 'react'
import PropTypes from 'prop-types'
import PostDigest from '../stateless_component/PostDigest'
import withVirtualScroll from '../container_component/withVirtualScroll'
const PostsList = (props) => {
    const list = props.timeline.map((post_id, index) => {
      if (!props.posts.entities[post_id]) return null
      const {
        author,
        user_id,
        avatar,
        title,
        content,
        created_at,
        updated_at
      } = props.posts.entities[post_id]
      return (
        <li
          key={post_id}
          className={`post-${post_id}`}>
          <PostDigest
            avatar={avatar}
            post_id={post_id}
            author={author}
            user_id={user_id} 
            title={title} 
            content={content} 
            created_at={created_at}
            updated_at={updated_at} 
          />
        </li>
      )
    })
  return (
    <ul>
      { list }
    </ul>
  ) 
}

PostsList.propTypes = {
  timeline: PropTypes.array.isRequired,
  posts: PropTypes.object.isRequired
}

export default withVirtualScroll(PostsList)