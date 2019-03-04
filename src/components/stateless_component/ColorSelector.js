import React from 'react'
import PropTypes from 'prop-types'

const ColorSelector = (props) => {
  return (
    <div 
      onChange={props.onChange}>
      {props.commonColors.map((color, idx) => (
        < label key={idx} style={{backgroundColor: color}}>
          <input 
            type='radio'
            name='color-selector'
            value={color}
          />
        </label>)
      )}
    </div>
  )
}

ColorSelector.propTypes = {
  commonColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
}

export default ColorSelector