import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledInput = styled.div`
    width: 100%;

    &>input {
      box-sizing: border-box;
      font-size: 1rem;
      line-height: 1.25rem;
      width: 100%;
      max-height: 1.25rem;
      border-radius: .5rem;
      text-indent: 1em;
      outline: none;
      border: 1px solid ${(props) => props.theme.color};
    }

    &>input:focus {
      border: .1rem solid ${(props) => props.theme.color}
    }
`

const Input = (props) => {
  return (
    <StyledInput>
      <input 
        type={props.type}
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}/>
    </StyledInput>
  )
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

export default Input