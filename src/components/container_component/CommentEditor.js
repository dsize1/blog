import React from 'react'
import PropTypes from 'prop-types'
import Form from '../form/Form'
import FormTextarea from '../form/FormTextarea'

const CommentEditor = (props) => {
  return (
    <Form
      btnTxt={'发布'}
      fieldsName={'commentEditor'}
      inputField={props.inputField}
      handleSubmit={props.handleSubmit}
      handleInputChange={props.handleInputChange}>
      <FormTextarea
        requiredVisible={false}
        name={'content'}/>
    </Form>
  )
}

CommentEditor.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  inputField: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

export default CommentEditor