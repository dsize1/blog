import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { pro_api } from '../../url'

const StyledComet = styled.div`
  width: 100%;
  height: 1.25rem;
  line-height: 1.25rem
  text-align: center;
  background-color: ${props => props.theme.bgc};
  &>div {
    margin: 0 auto;
    color: ${props => props.theme.color};
  }
  &>div:hover {
    text-decoration: underline;
    cursor: grab;
  }
`

class Comet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      publishCount: 0,
      xhr: null,
      turnon: true,
    }
    this.baseUrl = pro_api
    this._handleQueryNewPublish = this._handleQueryNewPublish.bind(this, this.props.handleQueryNewPublish)
  }

  _fetchPublishCount = (timeout = '&t=45000') => {
    const xhr = new XMLHttpRequest()
    const lastFetch = this.props.homeTimeline.lastFetch.top || Date.now()
    const url = this.baseUrl + `/comet?l=${lastFetch}&n=20` + timeout
    xhr.open('GET', url)
    xhr.timeout = 60e3
    xhr.send(null)

    xhr.onload = this._onload
    xhr.onerror = this._fetchAbort
    xhr.ontimeout = this._fetchAbort
    this.setState({
      xhr
    })
  }

  _onload = () => {    
    this.setState((state) => {
      let count = state.publishCount
      if (this.state.xhr.status < 400) {
        count = JSON.parse(state.xhr.responseText).data.publishCount
      }
      return {
        xhr: null,
        publishCount: count
      }
    })
  }

  _fetchAbort = () => {
    this.setState((state) => {
      if (state.xhr && state.xhr.readyState !==0)
        state.xhr.abort()
      return {
        xhr: null
      }
    })
  }

  _initPublishCount = () => {
    this.setState({
      publishCount: 0
    })
  }

  _cometSwitch = (turnon) => {
    this.setState({
      turnon
    })
  }

  _handleQueryNewPublish (queryNewPublish) {
    this._fetchAbort()
    this._initPublishCount()
    this._cometSwitch(false)
    queryNewPublish(this.state.publishCount, this._cometSwitch)
  }

  componentDidMount () {
    this._fetchPublishCount('&t=5000')
  }

  componentDidUpdate () {
    const { xhr, turnon, publishCount} = this.state
    if (xhr === null && turnon === true && publishCount < 20) {
      this._fetchPublishCount()
    }
  }

  componentWillUnmount () {
    this._fetchAbort()
  }

  render () {
    return (
      <StyledComet>
        { this.state.publishCount === 0 
          ? (<div>没有新的推送</div>)
          : (<div onClick={this._handleQueryNewPublish}>有{`${this.state.publishCount}`}条新的推送</div>)}
      </StyledComet>
    )
  }
}

const mapStateToProps = (state) => ({
  homeTimeline: state.blog.homeTimeline
})

export default connect(mapStateToProps)(Comet)