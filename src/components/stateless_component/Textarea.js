import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledTextarea = styled.div`
  width: 100%;

    &>textarea {
      box-sizing: border-box;
      resize: none;
      font-size: 1rem;
      line-height: 1.25rem
      width: 100%;
      min-height: 8rem;
      max-height: 8rem;
      border-radius: .75rem;
      text-indent: 1em;
      outline: none;
      border: 1px solid ${(props) => props.theme.color};
    }

    &>textarea:focus {
      border: .1rem solid ${(props) => props.theme.color}
    }
`

const Textarea = (props) => {
  return (
    <StyledTextarea>
      <textarea 
        name={props.name}
        value={props.value}
        onChange={props.onChange} />
    </StyledTextarea>
  )
}

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Textarea