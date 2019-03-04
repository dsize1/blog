import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import User from '../stateless_component/User'
import Timestamp from '../stateless_component/Timestamp'

const StyledComment = styled.div`
  padding: 12px 15px;
  position: relative;
  padding-left: 100px;
  border-bottom: 1px solid #ccc;
  &:hover {
    background-color: #eee;
  }

    &>div:nth-of-type(1) {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    &>p {
      min-height: 6rem;
      max-height: 6rem;
      word-wrap: break-word;
      overflow: hidden;
    }  
`

const Comment = (props) => (
  <StyledComment>
    <div>
      <User 
        avatar={props.avatar}
        user_id={props.user_id} 
        username={props.author}/>
      <div>{`#${props.index+1}`}</div>
    </div>

    <p className="content">{props.content}</p>
    <Timestamp 
      created_at={props.created_at}
      updated_at={props.updated_at}
      />
  </StyledComment>
)

Comment.propTypes = {
  avatar: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  user_id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.number.isRequired,
  updated_at: PropTypes.number.isRequired,
}

export default Comment 