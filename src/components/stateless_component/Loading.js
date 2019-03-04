import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const rotate = keyframes`
  from {
    transform: rotate(0)
  }
  to {
    transform: rotate(360deg)
  }
`

const StyledLoading = styled.div`
  height: 2.5rem;
  position: relative;
  background-color: transparent;
  border-bottom: 1px solid #ccc;
    &>div{
      background-color: transparent;
      width: 1px;
      height: 1px;
      position: absolute;
      top: 50%;
      left: 50%;
      animation: ${rotate} 5s steps(10) infinite;
    }
      &>div>i {
        border-radius: 50%;
        display: block;
        width: .5rem;
        height: 1rem;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
      }
      &>div>i:nth-of-type(1) {
        background-color: #4169e144;
      }
      &>div>i:nth-of-type(2) {
        background-color: #4169e177;
        transform: 
          rotate(72deg)
      }
      &>div>i:nth-of-type(3) {
        background-color: #4169e1aa;
        transform: 
          rotate(144deg)
      }
      &>div>i:nth-of-type(4) {
        background-color: #4169e1cc;
        transform: 
          rotate(216deg)
      }
      &>div>i:nth-of-type(5) {
        background-color: #4169e1ff;
        transform: 
          rotate(288deg)
      }
`

class Loading extends Component {

  shouldComponentUpdate (nextprops, nextState) {
    if (nextprops.visible !== this.props.visible) {
      return true
    }
    return false
  }

  render () {
    if (!this.props.visible) return null
    return (
      <StyledLoading>
        <div>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </StyledLoading>
    )
  }
}

Loading.propTypes = {
  visible: PropTypes.bool.isRequired
}

export default Loading