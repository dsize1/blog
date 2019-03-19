import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'
import { connect } from 'react-redux'
import Outerlayer from './Outerlayer'
import Images from '../stateless_component/Images.js'
import {getImageSrc, fetchImageSrc} from '../../actions/masonry'
import debounce from 'lodash.debounce'

const StyledMasonry = Styled.div`
  .masonry-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.masonry-wrapper::after {
  content: '';
  flex-grow: 99999999;
}

.masonry-wrapper .item {
  margin: 2px;
  background-color: #ccc;
  position: relative;
  overflow: hidden;
  cursor: grab;
}

.masonry-wrapper .item>img {
  position: absolute;
  top: 0;
  width: 100%;
  vertical-align: bottom;
  transition: all 0.5s ease-in-out;
}

.masonry-wrapper .item>img:hover {
  transform: scale(1.2);
`

const WrapWithDataComponent = (WrappedComponent) => {
  return class extends Component {
    static propTypes = {
      cache: PropTypes.array.isRequired,
      display: PropTypes.array.isRequired,
      loading: PropTypes.bool.isRequired,
      fetchImageSrc: PropTypes.func.isRequired,
      getImageSrc: PropTypes.func.isRequired,
    }

    constructor (props) {
      super(props)
      this.state = {
        outerlayerSrc: ''
      }
      this.setOuterlayer = el => this.outerlayer = el
      this._getOuterlayerSrc = this._getOuterlayerSrc.bind(this)
      this._handleCloseOuterlayer = this._handleCloseOuterlayer.bind(this)
      this._handPageScroll = debounce(this._handPageScroll.bind(this), 0.5 * 1000)
      this._handVisibleImage = debounce(this._handVisibleImage.bind(this), 0.05 * 1000)
    }

    componentWillMount () {
      this.props.fetchImageSrc()
      document.addEventListener('scroll', this._handPageScroll)
      document.addEventListener('scroll', this._handVisibleImage)
    }

    componentWillUnmount () {
      document.removeEventListener('scroll', this._handPageScroll)
      document.removeEventListener('scroll', this._handVisibleImage)
    }

    _handVisibleImage (event) {
      const imgs = document.querySelector('.masonry-wrapper').children
      for(const img of imgs) {
        const position = img.getClientRects()[0]
        const top = position.top
        const bottom = position.bottom
        const screenHeight = document.documentElement.clientHeight
        if (top > -1000 && bottom < screenHeight + 1000) {
          img.style.visibility = 'visible'
        } else {
          img.style.visibility = 'hidden'
        }
      }
    }

    _handPageScroll (event) {
      const screenHeight = document.documentElement.clientHeight
      if (!this.props.Loading 
        && this.props.cache.length !== 0 
        && document.body.offsetHeight + document.body.getClientRects()[0].y < screenHeight + 500) {
        this.props.getImageSrc()
      }
    }

    _getOuterlayerSrc (src) {
      this.setState({
        outerlayerSrc: src
      })
    }

    _handleCloseOuterlayer (event) {
      if (event.target === this.outerlayer) {
        this.setState({
          outerlayerSrc: ''
        })
      }
    }

    render () {
      return (
        <StyledMasonry>
          <WrappedComponent 
            imgs={this.props.display} 
            handleClick={this._getOuterlayerSrc}/>
          <Outerlayer 
            alive={this.state.outerlayerSrc !== ''}
            outerlayer={this.setOuterlayer}
            handleShutDown={this._handleCloseOuterlayer}
            render={() => (
              <div style={{
                height: '525px',
                backgroundImage: `url("${this.state.outerlayerSrc}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}/>)
            }/>
        </StyledMasonry>
      )
    }
  }
}

const mapStateToProps = state => ({...state.masonry})
const mapDispatchToProps = (dispatch) => ({
  fetchImageSrc: () => dispatch(fetchImageSrc()),
  getImageSrc: () => dispatch(getImageSrc())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrapWithDataComponent(Images))