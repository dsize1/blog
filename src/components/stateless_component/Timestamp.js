import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import getRelativeTimestamp from '../../util/getRelativeTimestamp'

const StyledTimestamp = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const Timestamp = (props) => (
  <StyledTimestamp>
    <span>{ props.created_at !== props.updated_at && `更新于：${getRelativeTimestamp(props.updated_at)}` }</span>
    <span>{ `发布日期：${new Date(props.created_at).toLocaleString().slice(0, -3)}` }</span>
  </StyledTimestamp>
)

Timestamp.propTypes = {
  created_at: PropTypes.number.isRequired,
  updated_at: PropTypes.number.isRequired,
}

export default Timestamp