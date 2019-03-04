import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Styled from 'styled-components'
import { connect } from 'react-redux'
import Wrapper from '../stateless_component/Wrapper.js'
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
  zoom: 1.StyledMasonry
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
      this.handPageScroll = debounce(this.handPageScroll.bind(this), 0.5 * 1000)
      this.handVisibleImage = debounce(this.handVisibleImage.bind(this), 0.05 * 1000)
    }

    componentWillMount () {
      this.props.fetchImageSrc()
      document.addEventListener('scroll', this.handPageScroll)
      document.addEventListener('scroll', this.handVisibleImage)
    }

    componentWillUnmount () {
      document.removeEventListener('scroll', this.handPageScroll)
      document.removeEventListener('scroll', this.handVisibleImage)
    }

    handVisibleImage (event) {
      const imgs = document.querySelector('.masonry-wrapper').children
      for(const img of imgs) {
        const position = img.getClientRects()[0]
        const top = position.top
        const bottom = position.bottom
        const screenHeight = document.documentElement.clientHeight
        if (top > -800 && bottom < screenHeight + 800) {
          img.style.visibility = 'visible'
        } else {
          img.style.visibility = 'hidden'
        }
      }
    }

    handPageScroll (event) {
      const screenHeight = document.documentElement.clientHeight
      if (!this.props.Loading 
        && this.props.cache.length !== 0 
        && document.body.offsetHeight + document.body.getClientRects()[0].y < screenHeight + 500) {
        this.props.getImageSrc()
      }
    }

    render () {
      return (
        <StyledMasonry>
          <WrappedComponent imgs={this.props.display} />
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

export default connect(mapStateToProps, mapDispatchToProps)(WrapWithDataComponent(Wrapper))