import React, { Component } from 'react'
import styled from 'styled-components'
import Button from '../stateless_component/Button'

const StyledForm = styled.form`
  background-color: ${(props) => props.theme.bgc};
  display: flow-root;
  padding: .75rem .5rem;
  border-radius: 1rem;

    &::after {
      content: '',
      display: block;
      height: 0;
      visibility: hidden;
      clear: both;
    }

    &>.submission {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: baseline;
    }

    &>.submission>span {
      margin: 0 10px;
      color: red;
    }

`
class Form extends Component {
  render () {
    const {
      children,
      fieldsName,
      inputField,
      btnTxt,
      handleSubmit,
      handleInputChange,
      handleFileChange
    } = this.props
    const validate = Object.values(inputField.fields).every(({validate, required}) => !required || validate)
    const btnClassName= validate ? 'active' : 'disabled'
    return (
      <StyledForm>
        { React.Children.map(children, (child) => {
          const { name } = {...child.props}
          const { validator } = inputField.fields[name]
          let onChange
          if (inputField.fields[name].type === 'file') {
            onChange = handleFileChange.bind(this, fieldsName, name, validator)
          } else {
            onChange = handleInputChange.bind(this, fieldsName, name, validator)
          }
          return React.cloneElement(child, {
            name,
            onChange,
            ...inputField.fields[name]
          })
        })}
        <div className={'submission'}>
          <span>{!validate && inputField.message}</span>
          <Button 
            className={btnClassName}
            onClick={handleSubmit}
            text={btnTxt}/>
        </div>
      </StyledForm>
    )
  }
}

export default Form

