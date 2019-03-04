import React from 'react'
import styled from 'styled-components'
import {
  Route,
  Link,
  Switch
} from 'react-router-dom'
import Login from '../components/container_component/Login'
import Signup from '../components/container_component/Signup'

const StyledAuth = styled.div`
  margin-top: 5rem;

    &>ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    &>ul>li {
      min-width: 5rem;
      text-align: center;
      padding: 5px 0;
      box-sizing: border-box;
      background-color: ${(props) => props.theme.bgc};
      margin: 0 5px;
    }

    &>ul>li>a:hover {
      color: blue;
      text-decoration: underline;
    }
    &>ul.signup>li:nth-of-type(1),
    &>ul.login>li:nth-of-type(2) {
      background-color: #eee;
      color: #888;
    }
    &>ul.signup>li:nth-of-type(2),
    &>ul.login>li:nth-of-type(1) {
      pointer-events: none;
    }
`

const StyledAuthForm = styled.div`
  padding: 0 25%;
`

const AuthenticationRoute = ({match, location}) => {
  const className = location.pathname === '/authentication' ? 'login' : 'signup'
  return (
    <StyledAuth url={match.url}>
      <ul className={className}>
        <li>
          <Link to={`${match.url}`}>登录</Link>
        </li>
        <li>
          <Link to={`${match.url}/signup`}>注册</Link>
        </li>
      </ul>
      <StyledAuthForm>
        <Switch>
          <Route 
            path={`${match.url}/signup`} 
            component={Signup}/>
          <Route exact 
            path={`${match.url}`} 
            component={Login}/>
        </Switch>
      </StyledAuthForm>
    </StyledAuth>
  )
}

export default AuthenticationRoute
