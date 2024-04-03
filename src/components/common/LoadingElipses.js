import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'

const KeyFrames = keyframes`
  0% { width: 0px; }
  25% { width: .25em; }
  50% { width: .50em; }
  75% { width: .75em; }
  100% { width: 1em; }
`
const Elipses = styled.div`
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ${KeyFrames} 1s alternate infinite;      
  animation: ${KeyFrames} 1s alternate infinite;
  width: 0px;

`

class Loading extends Component {
  state = {}
  render = () => {
    return (
      <span className={this.props.className}>
        {this.props.children}
        <Elipses>
          ...
        </Elipses>
      </span>
    )
  }
}

export default Loading
