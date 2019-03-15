import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledUser = styled.div`
  position: relative;
  &>a {
    display: flex;
    flex-direction: row;
  }

  &>a>.name {
    font-weight: bold;
    margin-right: 10px;
  }

  &>a:hover>.name {
    color: ${(props) => props.theme.color};
    text-decoration: underline;
  }

  &>a>.id {
    color: #666;
  }

  &>a>img {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 0;
    left: -90px;
    background-color: transparent;
    border-radius: 50%;
  }
`

const User = (props) => (
  <StyledUser>
    <Link to={ `/user/${props.user_id}` }>
      <p className='name'>
        { props.username }
      </p>
      <p className='id'>
        @{props.user_id.slice(-6)}
      </p>
      <img alt='' src={`http://woai.linjinyan89.com/avatars/${props.avatar}`} />
    </Link>
  </StyledUser>
)

User.propTypes = {
  avatar: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

export default User
