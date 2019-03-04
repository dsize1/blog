import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Input from '../stateless_component/Input'

const StyleFormInput = styled.div`
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
        max-width: 15%;
        padding: 0 2px;
      }
      &>div:nth-of-type(2)>div:nth-of-type(1)>:nth-child(2) {
        max-width: 75%;
      }

    &>div:nth-of-type(2)>div:nth-of-type(2),
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      min-height: 1.25rem;
    }
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      color: red;
    }
`

const FormInput = (props) => {
  const {
    name,
    required,
    prefix,
    suffix,
    value,
    onChange,
    help,
    error,
    type,
    requiredVisible
  } = props
  return (
    <StyleFormInput>
      <div>
        <span>{requiredVisible && required && '*'}</span>
        {name}:
      </div>
      <div>
        <div>
          <div>{prefix}</div>
          <Input
            name={name}
            type={type}
            value={value}
            onChange={onChange}/>
          <div>{suffix}</div>
        </div>
        <div>{help}</div>
        <div>{error}</div>
      </div>
    </StyleFormInput>
  )
}

FormInput.propTypes = {
  requiredVisible: PropTypes.bool,
  required: PropTypes.bool,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  help: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
}

export default FormInput