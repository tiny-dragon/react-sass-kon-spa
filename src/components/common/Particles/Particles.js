import React, {Component} from 'react'
import './Particles.scss'

class Particles extends Component {
  state = {}

  render = () => {
    return (
      <div id='particle-container'>
        {
          Array.apply(null, Array(40)).map((item, i) => {
            return <div key={i} className='particle' />
          })
        }
      </div>
    )
  }
};

export default Particles
