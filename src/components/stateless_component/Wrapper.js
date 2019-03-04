import React from 'react'
import PropTypes from 'prop-types'
import Img from './Img.js'
   
const Wrapper = (props) => {
  return (
    <div className={'masonry-wrapper'} >
      {props.imgs.map((img, index) => (
        <Img 
          key={index}
          id={index}
          src={img.url}
          width={img.width}
          height={img.height}
        />
      ))}
    </div>
  )
}

Wrapper.propTypes = {
  imgs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Wrapper