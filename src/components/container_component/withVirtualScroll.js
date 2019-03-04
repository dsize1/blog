import React, {Component} from 'react'
import throttle from 'lodash.throttle'
import Loading from '../stateless_component/Loading'

const withVirtualScroll = (WrappedList) => {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        start: 0,
        end: Math.ceil(document.documentElement.clientHeight / this.props.itemHeight) + 5,
        screenHeight: document.documentElement.clientHeight,
      }
      this._handleScroll = throttle(this._handleScroll.bind(this), 167)
      this._handleResize = this._handleResize.bind(this)
      this._handleQueryRequest = throttle(this.props.handleQueryRequest, 500, {leading: true})
    }

    _handleScroll () {
      const scrollTop = document.documentElement.scrollTop
      this.setState((state) => {
        let start = Math.floor(scrollTop / this.props.itemHeight) - 5
        let end = start + Math.ceil(state.screenHeight / this.props.itemHeight) + 10        
        if (start < 0) {
          // this._handleQueryRequest('top')
          start = 0
        } 
        if (end > this.props.timeline.length) {
          !this.props.loading && this.props.hasMore && this._handleQueryRequest('bottom')
          end = this.props.timeline.length
        }
        return {
          start,
          end
        }
     })
    }

    _handleResize () {
      this.setState({
        screenHeight: document.documentElement.clientHeight
      })
      this._handleScroll()
    }

    componentDidMount () {
      document.addEventListener('scroll', this._handleScroll)
      window.addEventListener('resize', this._handleResize)
    }

    componentWillUnmount () {
      document.removeEventListener('scroll', this._handleScroll)
      window.removeEventListener('resize', this._handleResize)
    }

    render () {
      const {
        timeline,
        itemHeight,
        isLoadingDirection,
        loading,
        posts,
        hasMore
      } = this.props
      const loadingTop = hasMore && isLoadingDirection === 'top' && loading
      const loadingBottom = hasMore && isLoadingDirection === 'bottom' && loading
      const paddingTopOffset = loadingBottom ? '2.5' : '0'
      const paddingBottomOffset = loadingTop ? '2.5' : '0'
      const currentTimeline = timeline.slice(this.state.start, this.state.end)
      const paddingTop = this.state.start * itemHeight
      const paddingBottom = (timeline.length - this.state.end) * itemHeight
      
      return (
        <>
          <Loading visible={loadingTop}/>
          <div style={{height: `calc(${paddingTop}px - ${paddingTopOffset}rem)`}}>
          </div>
          <WrappedList
            timeline={currentTimeline}
            posts={posts}/>
          <div style={{height: `calc(${paddingBottom}px - ${paddingBottomOffset}rem)`}}>
          </div>
          <Loading visible={loadingBottom}/>
        </>
      )
    }
  }
}

export default withVirtualScroll