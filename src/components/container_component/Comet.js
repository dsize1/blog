import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

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
      xhr: null
    }
    this.baseUrl = 'http://woai.lijinyan89.com/api'
    this._fetchPublishCount = this._fetchPublishCount.bind(this)
    this._onload = this._onload.bind(this)
    this._fetchAbort = this._fetchAbort.bind(this)
    this._initPublishCount = this._initPublishCount.bind(this)
    this._handleQueryNewPublish = this._handleQueryNewPublish.bind(this, this.props.handleQueryNewPublish)
  }

  _fetchPublishCount () {
    if (this.state.xhr) {
      if (this.state.xhr.readyState !== 0) this.state.xhr.abort()
      this.setState({
        xhr: null
      })
    }
    const xhr = new XMLHttpRequest()
    const lastFetch = this.props.homeTimeline.lastFetch.top || Date.now()
    const url = this.baseUrl + `/comet?l=${lastFetch}&n=20`
    xhr.open('GET', url)
    xhr.timeout = 60 * 1000
    xhr.send(null)

    xhr.onload = this._onload
    xhr.onerror = this._fetchPublishCount
    xhr.ontimeout = this._fetchPublishCount
    this.setState({
      xhr
    })
  }

  _onload () {
    if (this.state.xhr.status < 400) {
      this.setState((state) => {
        const count = JSON.parse(state.xhr.responseText).data.publishCount
        if (count < 20) {
          this._fetchPublishCount()
        }
        return {
          publishCount: count
        }
      })
    } else {
      this._fetchPublishCount()
    }
  }

  _fetchAbort () {
    this.setState((state) => {
      if (state.xhr && state.xhr.readyState !==0)
        state.xhr.abort()
      return {
        xhr: null
      }
    })
  }

  _initPublishCount () {
    this.setState({
      publishCount: 0
    })
  }

  _handleQueryNewPublish (queryNewPublish) {
    this._fetchAbort()
    this._initPublishCount()
    queryNewPublish(this.state.publishCount, this._fetchPublishCount)
  }

  componentDidMount () {
    this._fetchPublishCount()
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
