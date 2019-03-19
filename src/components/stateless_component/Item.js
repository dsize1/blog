import React from 'react'
import PropTypes from 'prop-types'

const Item = (props) => {
  const size = props.size
  const width = `${props.size}px`
  const height = width
  const action = props.position.action
  const translate3d = props.position.translate3d
  const rotate3d = props.position.rotate3d
  const transform = `
    rotateX(${action[0]}deg) rotateY(${action[1]}deg) rotateZ(${action[2]}deg)
    translate3d(${translate3d[0] * size}px, ${translate3d[1] * size}px, ${translate3d[2] * size}px)
    rotate3d(${rotate3d[0]}, ${rotate3d[1]}, ${rotate3d[2]}, ${rotate3d[3]}deg)`
  const id = props.aspect.id
  const color = props.aspect.color
  const backgroundColor = color
  // const backgroundImage = `url(${bgi})`
  // const backgroundPos = props.aspect.backgroundPos
  // const backgroundPosition = `${backgroundPos.x * size}px ${backgroundPos.y * size}px`
  // const backgroundRepeat = 'no-repeat'
  // const backgroundSize = '900% 600%'  
  return (
    <div 
      className={`item ${color}-${id}`}
      style={{
        // backgroundImage, 
        // backgroundPosition,
        // backgroundRepeat,
        // backgroundSize,
        backgroundColor,
        width, 
        height, 
        transform}}>
    </div>
  )
}

Item.propTypes = {
  size: PropTypes.number.isRequired,
  position: PropTypes.object.isRequired,
  aspect: PropTypes.object.isRequired,
}

export default Item