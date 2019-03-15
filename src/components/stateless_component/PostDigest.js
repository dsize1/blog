import React from 'react'
import PropTypes from 'prop-types'
import BraftEditor from 'braft-editor'
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

    &>div:nth-of-type(2)>P{
      font-size: 1.5rem;
      line-height: 2.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &>div:nth-of-type(2)>a {
      min-height: 6rem;
      max-height: 6rem;
      display: flex;
      flex-wrap: nowrap;
    }
    &>div:nth-of-type(2)>a>img {
      width: 9.5rem;
      height: 6rem;
      object-fit: cover;
      margin-right: 1rem;
    }
    &>div:nth-of-type(2)>a>p {
      flex-grow: 1;
      word-break: break-all;
      overflow: hidden;
    }
`

const PostDigest = (props) => {
  const { blocks, entityMap } = BraftEditor.createEditorState(props.content).toRAW(true)
  let content = blocks.reduce((re, it) => {
    if (it.type === 'unstyled')
      re += it.text
    return re
  }, '')
  const values = Object.values(entityMap)
  const src = values.length > 0 && values[0].data.url
  const img = src && (<img src={src} alt=''/>)
  const len = src ? 200 : 300
  content = content.length > len ? content.slice(0, len) + '...' : content
  return (
    <StyledPostDigest>
      <User
        avatar={props.avatar}
        user_id={props.user_id}
        username={props.author}/>
      <div>
        <p>{props.title}</p>
        <Link to={ `/post/${props.post_id}` }>
          { img }
          <p>{ content }</p>
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