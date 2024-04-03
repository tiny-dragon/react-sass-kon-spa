import React, {Component} from 'react'
import ReactVideoRecorder from 'react-video-recorder'
import styled from 'styled-components'
import ProgressArc from 'progress-arc-component'

import Backdrop from 'components/common/Backdrop'
import './VideoRecorder.scss'

const RecorderOverlay = styled.div`
  width: 60%;
  height: 90%;
  position: fixed;
  top: 5%;
  left: 20%;
  background-position: 50%;
  background-size: 40%;
  border: 1px solid #555;
`

const Uploading = styled(ProgressArc)`
  position: absolute;
  top: 25%;
  font-size: 30px;
  z-index: 2;
`

class VideoRecorder extends Component {
  state = {}

  render = () => {
    const { progress, onBlobReady } = this.props
    return (
      <div>
        <Backdrop onClick={this.props.onBackdropClicked} />
        <RecorderOverlay>
          { progress && <Uploading value={progress} /> }
          <ReactVideoRecorder
            ref={video => (this.video = video)}
            onRecordingComplete={(
              videoBlob,
              startedAt,
              thumbnailBlob,
              duration
            ) => {
              onBlobReady && onBlobReady(videoBlob)
            }}
          />
        </RecorderOverlay>
      </div>
    )
  }
};

export default VideoRecorder
