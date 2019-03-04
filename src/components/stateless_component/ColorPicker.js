import React from 'react'
import PropTypes from 'prop-types'
import Button from '../stateless_component/Button'

const ColorPicker = (props) => {
  return (
    <div>
      <label>
        画笔颜色： 
        <input type='color' value={props.color} onChange={props.onChange}/>
      </label>        
      <Button 
        text={props.isPickingColor ? '正在取色' : '开始取色'}
        onClick={props.onClick}/>
    </div>)
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  isPickingColor: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ColorPicker