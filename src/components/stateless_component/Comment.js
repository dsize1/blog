import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import User from '../stateless_component/User'
import BraftEditor from 'braft-editor'
import Timestamp from '../stateless_component/Timestamp'
import Dropdown from '../stateless_component/Dropdown'

const StyledComment = styled.div`
  padding: 0.6rem .75rem;
  position: relative;
  padding-left: 5rem;
  border-bottom: 1px solid #ccc;
  &:hover {
    background-color: #eee;
  }

    &>div:nth-of-type(1) {
      display: flex;
      justify-content: space-between;
      margin-bottom: .25rem;
    }

    &>p {
      min-height: 6rem;
      max-height: 6rem;
      word-wrap: break-word;
      overflow: hidden;
    }  
`

const Comment = (props) => {
  const display = props.user_id === props.self_id ? 'flow-root' : 'none'
  return (
    <StyledComment>
      <div>
        <User 
          avatar={props.avatar}
          user_id={props.user_id} 
          username={props.author}/>
        <Dropdown display={display}>
          <li onClick={props.handleStartUp}>编辑</li>
          <li onClick={props.handleDelComment}>删除</li>
        </Dropdown>
      </div>
      <p 
        className="content"
        dangerouslySetInnerHTML={{__html: BraftEditor.createEditorState(props.content).toHTML()}}></p>
      <Timestamp 
        created_at={props.created_at}
        updated_at={props.updated_at}
        />
    </StyledComment>
  )
}

Comment.propTypes = {
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
  self_id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.number.isRequired,
  updated_at: PropTypes.number.isRequired,
  handleDelComment: PropTypes.func.isRequired,
  handleStartUp: PropTypes.func.isRequired,
}

export default Comment 