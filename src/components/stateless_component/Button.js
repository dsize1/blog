import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledButton = styled.span`
  button {
    border: none;
    background-color: ${(props) => props.theme.color};
    color: #fff;
    border-radius: 1rem;
    min-width: 3.75rem;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.25rem;
    padding: 5px;
    outline: none;
  }

  button.disabled {
    background-color: orange;
  }

  button.disabled:hover {
    background-color: red;
    cursor: not-allowed;
  }
`

const Button = (props) => {
  const onClick = (e) => {
    e.preventDefault()
    props.onClick()
  }
  return (
  <StyledButton>
    <button 
      onClick={onClick}
      className={props.className}>
      {props.text}
    </button>
  </StyledButton>
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Button