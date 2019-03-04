import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, condition, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      condition ? (
        <Component {...props} />
      ): (
        <Redirect
          to={{
            pathname: "/accessdenied",
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

export default PrivateRoute