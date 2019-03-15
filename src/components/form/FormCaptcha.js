import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Input from '../stateless_component/Input'

const StyledFormCaptcha = styled.div`
  width: 100%;
  background-color: transparent;
  display: grid;
  grid-template-columns: 1fr 5fr;

    &>div:nth-of-type(1) {
      text-align: right;
      padding: 0 .5rem;
      min-width: 20%;
    }
    &>div:nth-of-type(1)>span {
      color: red;
    }

    &>div:nth-of-type(2)>div:nth-of-type(1) {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      max-height: 2.5rem;
    }
      &>div:nth-of-type(2)>div:nth-of-type(1)>div {
        text-align: center;
        max-width: 25%;
        min-height: 2.5rem;
        max-height: 2.5rem;
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

const FormCaptcha = (props) => {
  const {
    name,
    required,
    prefix,
    suffix,
    onChange,
    help,
    error,
    type,
    value,
    requiredVisible
  } = props
  return (
    <StyledFormCaptcha>
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
          <div><img alt='请刷新' src={suffix}/></div>
        </div>
        <div>{help}</div>
        <div>{error}</div>
      </div>
    </StyledFormCaptcha>
  )
}

FormCaptcha.propTypes = {
  requiredVisible: PropTypes.bool,
  required: PropTypes.bool,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  onChange: PropTypes.func,
  help: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  validator: PropTypes.object
}

export default FormCaptcha