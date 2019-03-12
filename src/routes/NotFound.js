import React from 'react'
import { Link } from 'react-router-dom'
import style from 'styled-components'

const StyledNotFound = style.div`
  text-align: center;
  margin-top: 200px;
  font-size: 1.5rem;
  &>a {
    font-weight: bold;
    color: ${(props) => props.theme.color};
    text-decoration: underline; 
  }
`

const NotFound = (props) => (
  <StyledNotFound>
    <span>404, not found... ... </span>
    <Link to={`/home`}>返回首页</Link>
  </StyledNotFound>
)

export default NotFound