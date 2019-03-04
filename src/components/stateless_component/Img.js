import React from 'react'
import PropTypes from 'prop-types'

const Img = (props) => {
  const id = props.id
  const src = props.src
  const width = props.width
  const height = props.height
  return (
    <div  
      className={'item'} data-id={`${id}`}
      style={{width: `${width*200/height}px`, flexGrow: `${width*200/height}`}}>
      <div style={{paddingBottom: `${height/width*100}%`}}></div>
      <img 
        src={`https:${src}`}
        alt='' 
      />
    </div>
  )
}

Img.propTypes = {
  id: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Img

