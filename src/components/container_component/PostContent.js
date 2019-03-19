import React from 'react'
import PropTypes from 'prop-types'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'

BraftEditor.use(CodeHighlighter())

const PostContent = (props) => (
  <>
    <BraftEditor
      readOnly={true} 
      value={BraftEditor.createEditorState(props.content)}/>
  </>
)

PostContent.propTypes = {
  content: PropTypes.object.isRequired
}

export default PostContent