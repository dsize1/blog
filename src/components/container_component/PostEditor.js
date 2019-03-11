import React from 'react'
import PropTypes from 'prop-types'
import Form from '../form/Form'
import FormTextarea from '../form/FormTextarea'
import FormInput from '../form/FormInput'

const PostEditor = (props) => {
  return (
    <Form
      btnTxt={'发布'}
      fieldsName={'postEditor'}
      inputField={props.inputField}
      handleSubmit={props.handleSubmit}
      handleInputChange={props.handleInputChange}>
      <FormInput 
        requiredVisible={false}
        name={'title'} 
        type={'text'}/>
      <FormTextarea 
        requiredVisible={false}
        name={'content'}/>
    </Form>
  )
}

PostEditor.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  inputField: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

export default PostEditor
