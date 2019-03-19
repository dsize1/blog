import React from 'react'
import PropTypes from 'prop-types'
import Img from './Img.js'
   
const Images = (props) => {
  return (
    <div className={'masonry-wrapper'} >
      {props.imgs.map((img, index) => {
        const handleClick = props.handleClick.bind(null, img.url)
        return (
          <Img 
            key={'img' + index}
            id={'img' + index}
            src={img.url}
            width={img.width}
            height={img.height}
            handleClick={handleClick}/>
        )
      })}
    </div>
  )
}

Images.propTypes = {
  imgs: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleClick: PropTypes.func
}

export default Images