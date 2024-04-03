import React, {Component} from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  width: 100%;
  height: 100%;
`

class Backdrop extends Component {
  state = {}
  render = () => {
    return <Overlay onClick={this.props.onClick} />
  }
}

export default Backdrop
