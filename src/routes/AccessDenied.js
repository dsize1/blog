import React from 'react'
import { Link } from 'react-router-dom'
import style from 'styled-components'

const StyledAccessDenied = style.div`
  text-align: center;
  margin-top: 200px;
  font-size: 1.5rem;
  &>a {
    font-weight: bold;
    color: ${(props) => props.theme.color};
    text-decoration: underline; 
  }
`

const AccessDenied = (props) => (
  <StyledAccessDenied>
    <span>该页面无法访问，请  </span>
      <Link to={`/authentication`}>登录/注册</Link>
    <span>  ... ...</span>
  </StyledAccessDenied>
)

export default AccessDenied