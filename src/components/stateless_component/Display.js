import React from 'react'
import PropTypes from 'prop-types'

const Display = (props) => {
  const up = props.globalDisplay.slice(36, 45)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  const left = props.globalDisplay.slice(18, 27)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  const front = props.globalDisplay.slice(0, 9)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  const right = props.globalDisplay.slice(27, 36)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  const behind = props.globalDisplay.slice(9, 18)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  const down = props.globalDisplay.slice(45, 54)
    .map((it, idx) => (<li key={idx} style={{backgroundColor: it}}></li>))
  return (
    <div className='display'>
      <ul className='display-up'>{up}</ul>
      <ul className='display-left'>{left}</ul>
      <ul className='display-front'>{front}</ul>
      <ul className='display-right'>{right}</ul>
      <ul className='display-behind'>{behind}</ul>
      <ul className='display-down'>{down}</ul>
    </div>
  )
}

Display.propTypes = {
  globalDisplay: PropTypes.array.isRequired
}

export default Display