import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Form from '../form/Form'
import FormDraft from '../form/FormDraft'
import FormInput from '../form/FormInput'

const StyledPostEditor = styled.div`
  & div.draft-editor .bf-content {
    min-height: 6rem;
    height: fit-content;
    overflow: visible;
  }
`

const PostEditor = (props) => {
  return (
    <StyledPostEditor>
      <Form
        btnTxt={'发布'}
        fieldsName={'postEditor'}
        inputField={props.inputField}
        handleSubmit={props.handleSubmit}>
        <FormInput 
          requiredVisible={false}
          name={'title'}/>
        <FormDraft
          requiredVisible={false}
          name={'content'}/>
      </Form>
    </StyledPostEditor>
  )
}

PostEditor.propTypes = {
  handleSubmit: PropTypes.func,
  inputField: PropTypes.object
}

export default PostEditor
