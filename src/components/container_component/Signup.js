import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { 
  signup
} from '../../actions/blog'
import Form from '../form/Form'
import FormInput from '../form/FormInput'
import FormFile from '../form/FormFile'
import FormCaptcha from '../form/FormCaptcha'

const Signup = (props) => {
  if (props.self_id) {
    return (<Redirect to={`/user/${props.self_id}`}/>)
  }
  return (
    <>
      <Form
        btnTxt={'注册'}
        fieldsName={'authentication'}
        inputField={props.inputField}
        handleSubmit={props.signup}>
        <FormInput
          requiredVisible={true} 
          name={'username'}/>
        <FormInput
          requiredVisible={true} 
          name={'password'}/>
        <FormFile
          requiredVisible={true} 
          name={'avatar'}/>
        <FormCaptcha
          requiredVisible={true}
          name={'captcha'} />
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  inputField: state.blog.authentication,
  self_id: state.blog.user.id
})
const mapDispatchToProps = (dispatch) => ({
  signup: (event) => dispatch(signup())
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Signup)

export default ConnectedComponent