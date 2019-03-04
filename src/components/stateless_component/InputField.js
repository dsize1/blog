import React from 'react'
import PropTypes from 'prop-types'
import Input from '../stateless_component/Input'
import Button from '../stateless_component/Button'

const InputField = (props) => {
  
  return (
    <div className='input-field'>
      <span>{props.submitStatus}</span>
      <span>
        <Input 
          type="text"
          name={'action'} 
          value={props.inputFieldValue} 
          onChange={ props.handleChange }
          disabled={ props.submitting } />
      </span>
      <span>
        <Button
          text={'提交'} 
          onClick={ props.handleSubmit }/>
        <Button
          text={'打乱'} 
          onClick={ props.handleAutoArrangement }/>
        <Button
          text={'还原'}
          onClick={ props.handleRestore }/>
      </span>
    </div>
  )
}

InputField.propTypes = {
  submitting: PropTypes.bool.isRequired,
  submitStatus: PropTypes.string.isRequired,
  inputFieldValue: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleRestore: PropTypes.func.isRequired
}

export default InputField