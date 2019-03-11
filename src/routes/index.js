import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Route,
  Link,
  Switch,
  withRouter,
  Redirect
} from 'react-router-dom'
import throttle from 'lodash.throttle'
import AuthenticationRoute from './AuthenticationRoute'
import AccessDenied from './AccessDenied'
import Blog from '../components/container_component/Blog'
import PixelPainter from '../components/container_component/PixelPainter'
import Masonry from '../components/container_component/Masonry'
import Cube from '../components/container_component/Cube'
import Post from '../components/container_component/Post'
import Home from '../components/container_component/Home'
import PrivateRoute from './PrivateRoute'
import { 
  handleSignout,
  handleSaveState
 } from '../actions/blog'
import Styled from 'styled-components'

const StyledHeader = Styled.header`
  border-bottom: .1rem solid #ccc;
  margin-bottom: .4rem;
  background-color: #fff;
  &>.header-inner {
    min-height: 2.5rem;
    max-height: 2.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: .5rem 1.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &>.header-inner>a>h1 {
    font-size: 1.5rem;
    line-height: 1.75rem;
  }

  &>.header-inner>nav>ul {
    display: flex;
    flex-wrap: nowrap;
  }
  &>.header-inner>nav>ul>li {
    margin: 0 .5rem;
  }

  &>.header-inner>nav>ul>li:nth-of-type(3)>a>img {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
  }
`

const StyledMain = Styled.main`
  display: relative;
  width: 1200px;
  margin: 0 auto;
    &>.container {
      display: flex;
      align-items: flex-start;
      padding: 0 .8rem;
    }

  @media (max-width: 1000px) {
    width: 920px;
      &>.container {
        flex-direction: column;
      }
  }

`

const StyledAside = Styled.aside`
  background-color: #fff;
  min-width: 7.5rem;
  max-width: 7.5rem;

  &>div:nth-of-type(1) {
    min-height: 6.25rem;
    margin: 0 auto;
    text-align: center;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &>div:nth-of-type(1)>a {
    display: flex;
    flex-direction: column;
  }

  &>div:nth-of-type(1)>a>img {
    width: 4rem;
    height: 4rem;
    background-color: transparent;
    margin: .25rem auto;
    border-radius: 50%;
  }

  &>div:nth-of-type(2) {
    text-align: right;
    padding: .5rem .25rem;
  }

  &>div:nth-of-type(2) li {
    margin: .5rem 0 ;
  }

  @media (max-width: 1000px) {
    border-bottom: 1px solid #ccc;
    max-width: 100%;
    min-width: 100%;
    &>div:nth-of-type(1) {
      display: none;
    }
    &>div:nth-of-type(2) {
      flex-direction: row;
      text-align: right;
    }
    &>div:nth-of-type(2) ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    &>div:nth-of-type(2) ul>li {
      margin: 0 2rem;
    }
  }
`

const StyledSection = Styled.section`
  flex: 1 1;
  background-color: #fff;
  position: relative;
  flex-shrink: 0;
  margin-left: .5rem;
  margin-bottom: 0;
  width: 100%;
  min-height: calc(100vh - 3rem);
  @media (max-width: 1000px) {
    margin-left: 0;
  }
`
const StyledRoutes = Styled.div`
  position: relative;
  &>div {
      display: block;
      border: 3px solid rgba(66,66,66,0.5);
      background-color: transparent;
      width: 2.5rem;
      height: 2.5rem;
      box-sizing: border-box;
      border-radius: 50%;
      position: fixed;
      top: 4rem;
      right: 1rem;
      outline: none;
      user-select: none;
    }
      &>div::before {
        content: '';
        display: block;
        height: 1rem;
        width: 0;
        background-color: transparent;
        border-top: 1rem solid  transparent;
        border-left: .6rem solid transparent;
        border-right: .6rem solid transparent;
        border-bottom: 1rem solid  rgba(66,66,66,0.5);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -100%);
      }
      &>div::after {
        content: '';
        display: block;
        width: .4rem;
        height: 1rem;
        background-color: rgba(66,66,66,0.5);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
      }
`

class Routes extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visibleBackTop: false
    }
    this._handleScroll = throttle(this._handleScroll.bind(this), 167)
  }

  _handleBackTop () {
    document.documentElement.scrollTop = 0
  }

  _handleScroll () {
    let visible = this.state.visibleBackTop
    if (document.documentElement.clientHeight >= document.documentElement.scrollTop && visible) {
      visible = false
    } else if (document.documentElement.clientHeight < document.documentElement.scrollTop && !visible) {
      visible = true
    }
    this.setState({
      visibleBackTop: visible
    })
  }

  componentDidMount () {
    document.addEventListener('scroll', this._handleScroll)
    window.addEventListener('beforeunload', this.props.handleSaveState)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this._handleScroll)
  }

  render () {
    const {
      id,
      username, 
      avatar,
      handleSignout
    } = this.props
    const asideLink = id ? `/user/${id}` : '/'
    const asideUsername = username || 'Unknown'
    const asideAvatar = avatar || 'unknown'
    return (
      <StyledRoutes>
        <StyledHeader role='banner'>
          <div className='header-inner'>
            <Link to='/home'><h1>成的小站</h1></Link>
            <nav>
              <ul>
                <li><Link to='/home'>首页</Link></li>
                { 
                  id === '' ?
                    (<li><Link to='/authentication'>登录</Link></li>) :
                    (<li><Link to='/home' onClick={handleSignout}>登出</Link></li>)
                }
                <li>
                  <Link 
                    to={asideLink}
                    className={'dropdown-menu'}>
                    <img alt='' 
                      src={`http://localhost:8080/avatars/${asideAvatar}`}/>
                  </Link>
                </li>	
              </ul>
            </nav>

          </div>
        </StyledHeader>
        <StyledMain role='main'>
          <div className='container'>
            <StyledAside>
              <div>
                <Link to={asideLink}>
                  <div>{asideUsername}</div>
                  <img alt='' 
                    src={`http://localhost:8080/avatars/${asideAvatar}`}/>
                </Link>
              </div>
              <div>
                <nav>
                  <ul>
                    <li><Link to={`/pixelpainter`}>像素画板</Link></li>
                    <li><Link to={`/masonry`}>相册</Link></li>
                    <li><Link to={`/cube`}>魔方</Link></li>
                  </ul>
                </nav>
              </div>
            </StyledAside>
            <StyledSection>
              <Switch>
                <Route path='/pixelpainter'component={PixelPainter}/>
                <Route path='/masonry' component={Masonry}/>
                <Route path='/cube' component={Cube}/>
                <Route path='/authentication' component={AuthenticationRoute}/>
                <Route path='/accessdenied' component={AccessDenied}/>
                <PrivateRoute path='/user/:user_id' condition={id} component={Blog}/>
                <PrivateRoute path='/post/:post_id' condition={id} component={Post}/>
                <Route path='/home' component={Home}/>
                <Route exec path='/' render={() => (<Redirect to={`/home`} />)}/>
                <Route render={() => 404}/>
              </Switch>
            </StyledSection>
          </div>
        </StyledMain>
        <div
          style={{display: `${this.state.visibleBackTop ? 'block' : 'none'}`}} 
          onClick={this._handleBackTop}>
        </div>
      </StyledRoutes>
    )
  }
}

const mapStateToProps = (state) => ({...state.blog.user})
const mapDispatchToProps = (dispatch) => ({
  handleSignout: () => dispatch(handleSignout()),
  handleSaveState: () => dispatch(handleSaveState())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes))