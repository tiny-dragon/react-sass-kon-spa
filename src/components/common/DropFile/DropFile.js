import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import ProgressArc from 'progress-arc-component'
import { ToastContainer, toast } from 'react-toastify'

import Backdrop from 'components/common/Backdrop'
import './DropFile.scss'

const File = styled.div`
  width: 70%;
  text-align: left;
  margin: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 1.5em;
  font-size: 1.2em;  
`

const Uploading = styled(ProgressArc)`
  position: absolute;
  top: 25%;
  font-size: 30px;
  z-index: 2;
  left: 0;
`

class DropFile extends Component {
  state = {
    files: [],
    dropzoneActive: false,
    isOpen: false,
    accept: '.webm, .mp4, .wav, .mov'
  }

  onDrop = (files) => {
    if (files && files.length > 0) {
      this.props.onDropFilesReady && this.props.onDropFilesReady(files)
      if (files[0].size > 10000000) {
        console.log('Oh, that is a big file. This may takes a few minutes. Please be patient')
      }
    } else {
      toast.error('Format not yet supported.', {
        position: toast.POSITION.BOTTOM_LEFT
      })
    }

    this.setState({
      files,
      dropzoneActive: false
    })
  }

  onDragEnter = () => {
    this.setState({
      dropzoneActive: true
    })
  }

  onDragLeave = () => {
    this.setState({
      dropzoneActive: false
    })
  }

  render = () => {
    const { className, onBackdropClicked, progress } = this.props
    const parentClass = className || ''
    const draggingClass = this.state.dropzoneActive ? 'dragging' : ''
    const hasFilesClass = this.state.files.length > 0 ? 'has-files' : ''
    return (
      <div>
        <Backdrop onClick={onBackdropClicked} />
        <ToastContainer />
        <Dropzone
          className={`dropfile ${parentClass} ${draggingClass} ${hasFilesClass}`}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          accept={this.state.accept} >
          {
            !this.state.dropzoneActive &&
              !hasFilesClass &&
              <p>Drop your files here ({this.state.accept}), or click to select files.</p>
          }
          { this.state.files.map((f, i) => <File key={i}>{f.name}</File>) }
          { progress && progress > 0 ? <Uploading value={progress} /> : null}

        </Dropzone>
      </div>
    )
  }
};

export default DropFile
