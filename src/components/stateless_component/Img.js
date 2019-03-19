import React from 'react'
import PropTypes from 'prop-types'

const Img = (props) => {
  const {
    id,
    src,
    width,
    height,
    handleClick
  } = props
  return (
    <div
      className={'item'} data-id={`${id}`}
      style={{width: `${width*200/height}px`, flexGrow: `${width*200/height}`}}>
      <div style={{paddingBottom: `${height/width*100}%`}}></div>
      <img
        onClick={handleClick} 
        src={`https:${src}`}
        alt='' />
    </div>
  )
}

Img.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Img

