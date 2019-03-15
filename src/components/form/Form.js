import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Button from '../stateless_component/Button'
import {
  handleInputChange,
  handleFileChange,
  handleDraftChange,
  handleDraftBlur
} from '../../actions/blog'

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
      handleFileChange,
      handleDraftChange,
      handleDraftBlur
    } = this.props
    const validate = inputField && Object.values(inputField.fields).every(({validate, required}) => !required || validate)
    const btnClassName= validate ? 'active' : 'disabled'
    const message = !validate && inputField && inputField.message
    return (
      <StyledForm>
        { React.Children.map(children, (child) => {
          const { name } = {...child.props}
          if (inputField === null) {
            return React.cloneElement(child, {name})
          }

          const { validator } = inputField.fields[name]
          let onChange
          let onBlur
          if (inputField.fields[name].type === 'file') {
            onChange = handleFileChange.bind(this, fieldsName, name, validator)
          } else if (inputField.fields[name].type === 'draft') {
            onChange = handleDraftChange.bind(this, fieldsName, name)
            onBlur = handleDraftBlur.bind(this, fieldsName, name, validator)
          } else {
            onChange = handleInputChange.bind(this, fieldsName, name, validator)
          }
          return React.cloneElement(child, {
            name,
            onChange,
            onBlur,
            ...inputField.fields[name]
          })
        })}
        <div className={'submission'}>
          <span>{message}</span>
          <Button 
            className={btnClassName}
            onClick={handleSubmit}
            text={btnTxt}/>
        </div>
      </StyledForm>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleFileChange: (...args) => dispatch(handleFileChange(...args)),
  handleInputChange: (...args) => dispatch(handleInputChange(...args)),
  handleDraftChange: (...args) => dispatch(handleDraftChange(...args)),
  handleDraftBlur: (...args) => dispatch(handleDraftBlur(...args)),
})

export default connect(null, mapDispatchToProps)(Form)

