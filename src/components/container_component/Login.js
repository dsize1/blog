import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { 
  login
} from '../../actions/blog'
import Form from '../form/Form'
import FormInput from '../form/FormInput'
import FormCaptcha from '../form/FormCaptcha'

const Login = (props) => {
  if (props.self_id) {
    return (<Redirect to={`/user/${props.self_id}`} />)
  }
  return (
    <>
      <Form
        btnTxt={'登录'}
        fieldsName={'authentication'}
        inputField={props.inputField}
        handleSubmit={props.login}>
        <FormInput 
          requiredVisible={true}
          name={'username'} />
        <FormInput 
          requiredVisible={true}
          name={'password'} />
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
  login: () => dispatch(login())
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Login)

export default ConnectedComponent