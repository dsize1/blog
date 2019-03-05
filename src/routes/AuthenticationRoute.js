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

    &>div:nth-of-type(1) {
      padding: 0 25%;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    &>div:nth-of-type(1)>a {
      flex-grow: 1;
      text-align: center;
      box-sizing: border-box;
      background-color: ${(props) => props.theme.bgc};
    }

    &>div:nth-of-type(1)>a:hover {
      color: blue;
      text-decoration: underline;
    }
    &>div:nth-of-type(1).signup>a:nth-of-type(1),
    &>div:nth-of-type(1).login>a:nth-of-type(2) {
      background-color: #eee;
      color: #888;
    }
    &>div:nth-of-type(1).signup>a:nth-of-type(2),
    &>div:nth-of-type(1).login>a:nth-of-type(1) {
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
      <div className={className}>
        <Link to={`${match.url}`}>登录</Link>
        <Link to={`${match.url}/signup`}>注册</Link>
      </div>
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
