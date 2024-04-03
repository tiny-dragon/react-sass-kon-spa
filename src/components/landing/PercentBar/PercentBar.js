import React from 'react'
import './PercentBar.scss'

const PercentBar = ({color, text, percent}) => {
  return (
    <div className='percent-bar'>
      <div style={{ width: `${percent}%`, backgroundColor: `${color}` }}>
        {text}
      </div>
    </div>
  )
}

export default PercentBar
