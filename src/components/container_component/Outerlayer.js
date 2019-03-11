import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledOuterlayer = styled.div`
  width: 100%;
  background-color: #0006;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

    &>div {
      position: absolute;
      top: 40%;
      left: 50%;
      width: 800px;
      transform: translate(-50%, -50%);
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      background: #fff;
      border-radius: 1rem;
    }

`
const Outerlayer = (Inner) => {
  return class extends Component {
    static propTypes = {
      alive: PropTypes.bool.isRequired,
      handleShutDown: PropTypes.func.isRequired,
      outerlayer: PropTypes.func.isRequired
    }
    render () { 
      const {
        alive,
        handleShutDown,
        outerlayer,
        ...rest
      } = this.props
      const display = alive ? 'block' : 'none'
      const pointerEvents = alive ? 'all' : 'none'
      const opacity = alive ? '1' : '0'
      return (
        <StyledOuterlayer
          ref={outerlayer} 
          onClick={handleShutDown}
          style={{display, pointerEvents, opacity}}>
          <div>
            <Inner {...rest}/>
          </div>
        </StyledOuterlayer>
      )
    }
  }
}

export default Outerlayer