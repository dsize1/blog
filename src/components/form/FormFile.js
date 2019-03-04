import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import File from '../stateless_component/File'

const StyledFormFile = styled.div`
  width: 100%;
  background-color: transparent;
  display: grid;
  grid-template-columns: 1fr 4fr;

    &>div:nth-of-type(1) {
      text-align: right;
      padding: 0 10px;
    }
    &>div:nth-of-type(1)>span {
      color: red;
    }

    &>div:nth-of-type(2)>div:nth-of-type(1) {
      display: flex;
      flex-direction: row;
      align-items: baseline;
    }
      &>div:nth-of-type(2)>div:nth-of-type(1)>div {
        text-align: center;
        max-width: 25%;
        padding: 0 2px;
      }
      &>div:nth-of-type(2)>div:nth-of-type(1)>:nth-child(2) {
        max-width: 50%;
      }

    &>div:nth-of-type(2)>div:nth-of-type(2),
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      min-height: 1.25rem;
    }
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      color: red;
    }
`

const FormFile = (props) => {
  const {
    name,
    required,
    prefix,
    suffix,
    onChange,
    help,
    error,
    type,
    accept,
    requiredVisible
  } = props
  return (
    <StyledFormFile>
      <div>
        <span>{requiredVisible && required && '*'}</span>
        {name}:
      </div>
      <div>
        <div>
          <div>{prefix}</div>
          <File
            name={name}
            type={type}
            accept={accept}
            onChange={onChange}/>
          <div>{suffix}</div>
        </div>
        <div>{help}</div>
        <div>{error}</div>
      </div>
    </StyledFormFile>
  )
}

FormFile.propTypes = {
  requiredVisible: PropTypes.bool,
  required: PropTypes.bool,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  onChange: PropTypes.func,
  help: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  validator: PropTypes.object,
  accept: PropTypes.string
}

export default FormFile