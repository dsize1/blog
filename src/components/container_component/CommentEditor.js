import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Form from '../form/Form'
import FormDraft from '../form/FormDraft'

const StyledCommentEditor = styled.div`

  & div.draft-editor .bf-content {
    min-height: 4rem;
    height: fit-content;
    overflow: visible;
  }
`

const CommentEditor = (props) => {
  return (
    <StyledCommentEditor>
      <Form
        btnTxt={'发布'}
        fieldsName={'commentEditor'}
        inputField={props.inputField}
        handleSubmit={props.handleSubmit}>
        <FormDraft
          requiredVisible={false}
          name={'content'}/>
      </Form>
    </StyledCommentEditor>
  )
}

CommentEditor.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  inputField: PropTypes.object.isRequired
}

export default CommentEditor