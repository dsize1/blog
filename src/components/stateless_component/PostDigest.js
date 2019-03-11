import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import User from '../stateless_component/User'
import Timestamp from '../stateless_component/Timestamp'

const StyledPostDigest = styled.div`
  position: relative;
  padding: .75rem .75rem 14px 0;
  padding-left: 5rem;
  border-bottom: 1px solid #ccc;
  &:hover {
    background-color: #eee;
  }

    &>div:nth-of-type(2)>a>P:nth-of-type(1) {
      font-size: 1.5rem;
      line-height: 2.5rem;
    }
    &>div:nth-of-type(2)>a>P:nth-of-type(2) {
      min-height: 6rem;
      max-height: 6rem;
      word-wrap: break-word;
      overflow: auto;
    }
`

const PostDigest = (props) => {
  return (
    <StyledPostDigest>
      <User
        avatar={props.avatar}
        user_id={props.user_id}
        username={props.author}/>
      <div>
        <Link to={ `/post/${props.post_id}` }>
          <p>{props.title}</p>
          <p>{props.content}</p>
        </Link>
      </div>
      <Timestamp
        created_at={props.created_at}
        updated_at={props.updated_at}/>
    </StyledPostDigest>
  )
}

PostDigest.propTypes = { 
  post_id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.number.isRequired,
  updated_at: PropTypes.number.isRequired
}

export default PostDigest 