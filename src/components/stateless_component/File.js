import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledFile = styled.div`
    width: 100%;

    &>label {
      display: block;
      box-sizing: border-box;
      font-size: 1rem;
      line-height: 1.25rem;
      width: 100%;
      max-height: 1.25rem;
      border-radius: .5rem;
      outline: none;
      border: 1px solid ${(props) => props.theme.color};
    }

    &>input {
      position: absolute;
      clip: rect(0 0 0 0);
      transform: scale(0);
    }
`

const File = (props) => {
  return (
    <StyledFile>
      <label htmlFor={props.name}>上传{props.name}</label>
      <input 
        type={props.type}
        id={props.name}
        name={props.name}
        accept={props.accept}
        onChange={props.onChange}/>
    </StyledFile>
  )
}

File.propTypes = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired
}

export default File