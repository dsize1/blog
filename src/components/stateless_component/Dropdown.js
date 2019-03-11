import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledDropdown = styled.label`
  position: relative;
  background-image: ${props => props.bgi };
  width: 1.25rem;
  height: 1.25rem;
  display: flow-root;
  &::before {
    content: '>';
    display: block;
    transform: rotate(90deg);
    color: #999;
    text-align: center;
    line-height: 1.25rem;
  }
  &:hover::before {
    color: ${props => props.theme.color};
  }
  &>ul {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    cursor: grab;
    position: absolute; 
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 0;
    z-index: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    transition: 
      visibility .5s ease-in-out 1s,
      opacity .5s ease-in-out 1s;
  }
  &:hover>ul,
  &>ul:hover {
    visibility: visible;
    opacity: 1;
    z-index: 900;
    pointer-events: all;
    transition: 
      visibility .5s ease-in-out,
      opacity .5s ease-in-out;
  }
  &>ul>li {
    white-space: nowrap;
    padding: .2rem;
  }
  &>ul>li:hover {
    background-color: #ccc;
  }
  &>ul>li:disabled {
    text-decoration: overline;
    color: orange;
  }
`

const Dropdown = (props) => {
  return (
    <StyledDropdown
      bgi={props.bgi}>       
      <ul>
        { props.children }
      </ul>
    </StyledDropdown>
  )
}

Dropdown.propTypes = {
  bgi: PropTypes.string,
}

export default Dropdown