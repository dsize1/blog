import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import Markdown from 'braft-extensions/dist/markdown'

BraftEditor.use(CodeHighlighter())
BraftEditor.use(Markdown())

const StyleFormDraft = styled.div`
  width: 100%;
  background-color: transparent;
  display: grid;
  grid-template-columns: 1fr 5fr;

    &>div:nth-of-type(1) {
      text-align: right;
      padding: 0 .5rem;
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
        padding: 0 .1rem;
      }
      &>div:nth-of-type(2)>div:nth-of-type(1)>:nth-child(2) {
        width: 90%;
        background-color: #fff;
        border: 1px solid;
        border-radius: .5rem;
      }

    &>div:nth-of-type(2)>div:nth-of-type(2),
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      min-height: 1.25rem;
    }
    &>div:nth-of-type(2)>div:nth-of-type(3) {
      color: red;
    }
    &>div:nth-of-type(2)>div:nth-of-type(3):focus {
      visibility: hidden;
    }
`

class FormDraft extends Component {

  render () {
    const {
      name,
      required,
      prefix,
      suffix,
      value,
      onChange,
      onBlur,
      help,
      error,
      controls,
      requiredVisible 
    } = this.props
    const validateFn = (file) => file.size < 1024 * 50
    const accepts = 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg'
    return (
      <StyleFormDraft>
        <div>
          <span>{requiredVisible && required && '*'}</span>
          {name}:
        </div>
        <div>
          <div>
            <div>{prefix}</div>
            <div className={'draft-editor'}>
              <BraftEditor
                value={value}
                controls={controls}
                onBlur={onBlur}
                onChange={onChange}
                media={{validateFn, accepts}}/>
            </div>
            <div>{suffix}</div>
          </div>
          <div>{help}</div>
          <div>{error}</div>
        </div>
      </StyleFormDraft>
    )
  }
}

FormDraft.propTypes = {
  requiredVisible: PropTypes.bool,
  controls: PropTypes.array,
  required: PropTypes.bool,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  help: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
}

export default FormDraft