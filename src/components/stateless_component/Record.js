import React from 'react'
import PropTypes from 'prop-types'

const Record = (props) => {
  const records = props.records.map((record, index, arr) => (
    <li key={arr.length - index}>{ `${arr.length - index}: ${record}` }</li>
  ))
  return (
    <ul className='record'>
      { records }
    </ul>
  )
}

Record.propTypes = {
  records: PropTypes.array.isRequired
}

export default Record