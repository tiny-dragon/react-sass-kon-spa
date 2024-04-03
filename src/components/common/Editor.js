import React, { Component } from 'react'
import styled from 'styled-components'
import WordList from 'components/common/WordList'
import konch from 'utils/KonchSDK'

const WordCorrector = styled(WordList)`
  color: #FFF;
  top: -8px;
`

const VideoIcon = styled.span`
  ${props => props.highlight && `background: rgba(255,255,255,0.2);`}
  margin: 4px;
  padding: 2px 5px 0;
  display: inline-block;
  cursor: pointer;
  border-radius: 2px;
`

const VideoPlayer = styled.video`
  ${props => props.minimize && `height: 31px;`}
  width: 450px;
  &::-webkit-media-controls-panel {
    display: flex !important;
    opacity: 1 !important;
  }
`

const FloatingMedia = styled.div`
  position: fixed;
  bottom: -4px;
  right: 10px;
  z-index: 80;
  background: rgba(0,0,0,.8);
  padding: 5px 0 0 0;
  border-radius: 5px;
  box-shadow: 0 0 2px rgba(255,255,255,0.2);
`

const Root = styled.div`
  max-width: 900px;
  margin: 30px auto;
  padding: 24px 24px 100px 30px;
  height: 100%;
  background: #141921;
  border-radius: 4px;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.4);
  position: relative;
`

const SavingIndicator = styled.span`
  top: -13px;
  position: relative;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
  line-height: 1.1em;
  margin: 0 0 10px 0;
  display: inline-block;
  ${props => {
    if (props.hide) {
      return `
      opacity: 0;
      -webkit-transition: opacity 6s ease-in-out;
      -moz-transition: opacity 6s ease-in-out;
      -ms-transition: opacity 6s ease-in-out;
      -o-transition: opacity 6s ease-in-out;
      `
    } else {
      return `
      opacity: 1;
      -webkit-transition: opacity 0.5s ease-in-out;
      -moz-transition: opacity 0.5s ease-in-out;
      -ms-transition: opacity 0.5s ease-in-out;
      -o-transition: opacity 0.5s ease-in-out;
      `
    }
  }}
`
SavingIndicator.displayName = 'SavingIndicator'

class Editor extends Component {
  state = {
    collection: {},
    dirty: false,
    minimize: false,
    speed: 1,
    loop: null
  }

  componentWillReceiveProps = (props) => {
    this.props.collection &&
    this.props.collection.id !== this.state.collection.id &&
    this.setState({ collection: this.props.collection })
    console.log('props', this.props.collection)
  }

  componentDidMount = () => {
    this.exampleTranscript = null
    this.exampleVideo = null
    this.changeTimeout = null
    console.log('mount', this.props.collection)
    this.setState({ collection: this.props.collection })
  }

  componentWillUnmount = () => {
    this.onStop()
  }

  onPlay = () => {
    if (!this.exampleTranscript) return
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.exampleTranscript.updateHighlights(this.exampleVideo.currentTime)
      if (this.state.loop && this.state.loop.to && this.exampleVideo.currentTime > this.state.loop.to) {
        this.seekVideo(this.state.loop.from)
      }
    }, 100)
    this.exampleVideo &&
    this.exampleVideo.addEventListener &&
    this.exampleVideo.addEventListener('ended', this.onStop, false)
  }

  play = () => {
    this.exampleVideo.play()
  }

  onLoop = (data) => {
    console.log(data)
    if (data) {
      this.seekVideo(data.from)
      this.exampleVideo.play()
    }
    this.setState({loop: data})
  }

  onStop = () => {
    clearInterval(this.interval)
    this.exampleVideo.removeEventListener('ended', this.onStop, false)
    this.exampleTranscript.updateWordIndex(0)
  }

  onPause = () => clearInterval(this.interval)

  pause = (seekTime) => {
    this.exampleVideo.pause()
  }

  toggleMinimized = () => {
    this.setState({minimize: !this.state.minimize})
  }

  goNormal = () => {
    this.setState({speed: 1})
    this.exampleVideo.playbackRate = 1.0
  }

  goSlow = () => {
    this.setState({speed: 0.5})
    this.exampleVideo.playbackRate = 0.5
  }

  goFast = () => {
    this.setState({speed: 1.5})
    this.exampleVideo.playbackRate = 1.5
  }

  onSeeking = () => {
    this.exampleTranscript.clearHighlights()
    const newWordIndex = this.exampleTranscript.findWordIndexFromTime(this.exampleVideo.currentTime)
    this.exampleTranscript.updateWordIndex(newWordIndex)
  }

  seekVideo = (seekTime) => {
    // start read along
    this.exampleVideo.currentTime = seekTime
    this.exampleVideo.play()
  }

  sendUpdateWords = newWords => {
    konch
      .fix(this.state.collection.id, newWords)
      .then(evt => {
        this.setState({dirty: false})
      })
      .catch(err => {
        console.error('Error Updating Transcript', err)
      })
  }

  onWordChange = (newWords) => {
    if (!(newWords instanceof Array)) return console.error('NOT A VALID WORD LIST')
    let collection = this.state.collection
    collection.transcript.words = newWords
    this.setState({dirty: true, collection})
    this.sendUpdateWords(newWords)
  }

  render = () => {
    const { collection, dirty, minimize, speed, loop } = this.state
    const words = collection.transcript && (collection.transcript.words || [])
    return (
      <div style={{marginBottom: '200px'}}>
        {
          collection &&
          collection.video &&
          <FloatingMedia>
            <div style={{textAlign: 'right', fontSize: '1.5em'}}>
              {
                loop &&
                <VideoIcon onClick={evt => this.setState({loop: null})}>
                  <span role='img' aria-label='slow'>🔁</span>
                </VideoIcon>
              }
              <VideoIcon highlight={speed === 0.5} onClick={this.goSlow}>
                <span role='img' aria-label='slow'>🐢</span>
              </VideoIcon>
              <VideoIcon highlight={speed === 1} onClick={this.goNormal}>
                <span role='img' aria-label='normal' >🚶‍♂️️</span>
              </VideoIcon>
              <VideoIcon highlight={speed === 1.5} onClick={this.goFast}>
                <span role='img' aria-label='fast' >🐇</span>
              </VideoIcon>
              <VideoIcon style={{marginLeft: '1.5em'}}>
                <span onClick={this.toggleMinimized}>
                  {
                    minimize
                      ? <span role='img' aria-label='slow'>⬆️ </span>
                      : <span role='img' aria-label='slow'>⬇️</span>
                  }
                </span>
              </VideoIcon>
            </div>
            <VideoPlayer
              minimize={minimize}
              src={collection.video}
              innerRef={video => (this.exampleVideo = video)}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onSeeking={this.onSeeking}
              controls />
          </FloatingMedia>
        }
        <Root >
          <SavingIndicator hide={!dirty}>
            {
              dirty
                ? <span><span role='img' aria-label='save'>💾</span>Saving ...</span>
                : <span>Changes Saved.</span>
            }
          </SavingIndicator>
          <WordCorrector
            highlightColor='light'
            innerRef={wordCorrector => (this.exampleTranscript = wordCorrector)}
            isEditable
            onChange={this.onWordChange}
            seekVideo={this.seekVideo}
            pause={this.pause}
            play={this.play}
            looping={loop}
            onLoop={this.onLoop}
            words={words} />
        </Root>
      </div>
    )
  }
}

export default Editor
