import React, { Component } from 'react'
import randomColor from 'randomcolor'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import './TransFlow.scss'
import PanelPiece from 'components/landing/PanelPiece'
import TransDescPiece from 'components/landing/TransDescPiece'
import PercentBar from 'components/landing/PercentBar'
import Spinner from 'components/common/Spinner'
import WordList from 'components/common/WordList'

const Badge = styled.span`    
  border-radius: 12px;
  background-color: #7cbb91;
  text-align: center;
  color: #ffffff;
  font-size: 11px;
  line-height: 23px;
  font-weight: bold;
  display: inline-block;
  padding: 1px 17px;
  margin: 0 5px;
  font-size: 13px;
  line-height: 22px;
  text-transform: uppercase;
  &:hover {
    background-color: #9DCCB3;
  }
  cursor: pointer;
`
const thumbnailBackground = (backgroundImage) => {
  return {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const getProperDimensions = (props) => {
  const maxWidth = 500
  const maxHeight = 400
  let width = 571
  let height = 320
  let ratio = 0
  if (props && props.video) {
    width = props.video.width
    height = props.video.height
    if (width > maxWidth) {
      ratio = maxWidth / width
      height = height * ratio
      width = width * ratio
    } else {
      ratio = maxHeight / height
      height = height * ratio
      width = width * ratio
    }
  }
  return { width, height }
}

class TransFlow extends Component {
  state = {
    collection: {}
  }

  componentDidMount = () => {
    this.exampleTranscript = null
    if (this.props.collection && this.props.collection.id) {
      this.setState({collection: this.props.collection})
    }
  }

  componentWillReceiveProps = (props) => {
    if (props.collection && props.collection.id) {
      this.setState({collection: props.collection})
    }
  }

  componentWillUnmount = props => {
    this.onStop()
  }

  onPlay = () => {
    if (!this.exampleTranscript) return
    this.interval = setInterval(() => {
      this.exampleTranscript.updateHighlights(this.exampleVideo.currentTime)
    }, 100)
    this.exampleVideo.addEventListener('ended', this.onStop, false)
  }

  onStop = () => {
    clearInterval(this.interval)
    this.exampleVideo.removeEventListener('ended', this.onStop, false)
    this.exampleTranscript.updateWordIndex(0)
  }

  onPause = () => clearInterval(this.interval)

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

  render = () => {
    const { collection } = this.state
    const meta = collection.props || {}
    const videoProps = meta.video || {}
    const videoDimensions = getProperDimensions(meta)
    let duration = meta.duration
    if (!duration && videoProps.duration) {
      duration = videoProps.duration / 1000
    }
    const sourceType = collection.sourceType || 'video'

    return (
      <div>
        <div className='flow-panel'>
          {
            sourceType === 'video' &&
            <div className='flow-row-panel'>
              <PanelPiece styles={videoDimensions}>
                {
                  collection.video
                    ? <video
                      src={collection.video.replace('http://', 'https://s3.amazonaws.com/')}
                      className='video-size'
                      {...videoDimensions}
                      controls />
                    : <div className='spinner-wrapper'><Spinner /></div>
                }
              </PanelPiece>
              <div className='flow-desc-panel' style={{paddingTop: '100px'}}>
                <TransDescPiece
                  title='Transcode for compatibility.'
                  cnt='Transcode & create all the assets you need in one shot. Plus, get meta data to help make your assets fit and look great.'
                  className='mb'
                  emph={
                    <div>
                      <div>Duration <b>{duration}s</b></div>
                      <div>Dimension <b>{videoProps && videoProps.width} x {videoProps && videoProps.height}</b></div>
                      <div>Size <b>{videoProps && Math.trunc(videoProps.mb, 2)}MB</b></div>
                    </div>
                  }
                />
              </div>
            </div>
          }

          {
            sourceType === 'video' &&
            <div className='flow-row'>
              <TransDescPiece
                title='Thumnails in sequence to preview your content'
                cnt='Transcode & create all the assets you need in one shot.'
                className='center'
              />
              <PanelPiece
                children={
                  <div className='spiece-rows'>
                    {collection &&
                     collection.thumbnails &&
                     collection.thumbnails.map((thumb, i) => (
                       <div
                         className={`spiece-${i}`}
                         key={i}
                         style={thumbnailBackground(thumb.replace('http://', 'https://s3.amazonaws.com/'))} />
                     ))}
                  </div>
                }
                className='spiece'
              />
              <div className='branch-point'>
                <div className='point' />
              </div>
            </div>
          }

          {
            sourceType === 'audio' &&
            <div style={{height: '80px'}} />
          }

          <div className='flow-row-panel'>
            {
              sourceType === 'video'
                ? <PanelPiece styles={videoDimensions}>
                  {
                    collection.video && collection.subtitles
                      ? <video
                        src={collection.video.replace('http://', 'https://s3.amazonaws.com/')}
                        {...videoDimensions}
                        className='video-size'
                        ref={video => (this.exampleVideo = video)}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onSeeking={this.onSeeking}
                        controls
                        crossOrigin='anomymous'>
                        {collection.subtitles && <track default src={collection.subtitles.replace('http://', 'https://s3.amazonaws.com/')} />}
                      </video>
                      : <div className='spinner-wrapper'>
                        <Spinner />
                      </div>
                  }
                </PanelPiece>
                : <div style={{backgroundColor: '#fafafa', padding: '8px', borderRadius: '6px'}}>
                  <audio controls src={collection.audio} style={{ height: '50%' }} />
                </div>
            }

            <div className='flow-desc-panel' style={{justifyContent: 'flex-start'}}>
              <TransDescPiece
                title='Transcription and Subtitle Files'
                cnt='Time coded or as a VTT file. We even make it easy
                  to correct transcription and improve your model over time.'
                badge={null}
                emph={null}
                className='up-in-mobile' >
                {
                  <WordList
                    isEditable={false}
                    style={{margin: '10px 0 0 -5px', lineHeight: '26px'}}
                    limit={40}
                    showMore={(<span>...</span>)}
                    action={(
                      <Link to={`/edit/${collection.id}`}>
                        <Badge onClick={evt => this.setState({showEditor: true})}>
                          <span
                            style={{marginRight: '6px'}}
                            role='img'
                            aria-label='pencil'>✏️</span>
                          <span>Open Editor</span>
                        </Badge>
                      </Link>
                    )}
                    ref={instance => (this.exampleTranscript = instance)}
                    seekVideo={this.seekVideo}
                    words={collection.transcript && (collection.transcript.words || [])} />
                }
              </TransDescPiece>
            </div>

            <div className='branch-point'>
              <div className='point' />
            </div>
          </div>

          <div className='flow-row spiece'>
            <TransDescPiece styles={{top: '-60px'}}
              title='Entity Extraction for Text and Images'
              cnt='Transcode & create all the assets you need in one shot.'
              className='center spiece'
              badge={(
                <div className='badge-cnt'>
                  <div className='badge-header'>
                    This is a
                  </div>
                  <div className='badge'>
                    PRO
                  </div>
                  <div className='badge-tailer'>
                    feature,
                    <span> find out more</span>
                  </div>
                </div>
              )} />
            <PanelPiece
              children={
                <div className='spiece-rows'>
                  {
                    collection &&
                    collection.analysis &&
                    collection.analysis.Sentiment &&
                    <PercentBar color='#e6b242' text={`Sentiment: ${collection.analysis.Sentiment}`} percent={40} />
                  }
                  {
                    collection &&
                    collection.analysis &&
                    collection.analysis.Entities &&
                    collection.analysis.Entities
                      .map((entity, i) => {
                        if (i >= 4) return null
                        return <PercentBar
                          color={randomColor({luminosity: 'light'})}
                          key={i}
                          text={`${entity.Type}: ${entity.Text} ${entity.Score.toFixed(2)}`}
                          percent={entity.Score * 100} />
                      })}
                  {
                    collection &&
                    collection.analysis &&
                    collection.analysis.KeyPhrases &&
                    collection.analysis.KeyPhrases
                      .sort((a, b) => (b.Score - a.Score))
                      .map((phrase, i) => {
                        if (i > 3 || (collection.analysis.Entities && (i + collection.analysis.Entities.length) >= 4)) return null
                        return <PercentBar
                          color={randomColor({luminosity: 'light'})}
                          key={i}
                          text={`${phrase.Text} ${phrase.Score.toFixed(2)}`}
                          percent={phrase.Score * 100} />
                      })
                  }
                </div>
              }
              className='spiece'
            />
            <div className='branch-point last'>
              <div className='point' />
            </div>
          </div>

          <div className='flow-row-panel'>
            <PanelPiece className='glow-blue' styles={{overflow: 'auto', minHeight: '370px'}}>
              <pre className='comment'>
                {'// This pages JSON response for the collection'}
              </pre>
              <pre>
                {JSON.stringify(collection, null, 2)}
              </pre>
            </PanelPiece>
            <div className='flow-desc-panel last'>
              <TransDescPiece
                title={<span>Endpoint <i>AND</i> Webhooks?</span>}
                cnt='We know how painful setting up an infrascturtucre can be. Developers love our easy to use SDK, RESTful endpoints, and webhooks that keep your clode clean.'
                className='mb last'
              />
              <code styles={{width: '100px'}}>
                #> yarn add konch-sdk
                <pre className='comment no-indent'>{'// yourPage.js'}</pre>
                import konch from 'konch-sdk'<br />
                konch.config({'{key-goes-here}'})<br />
                konch<br />
                &nbsp;&nbsp;&nbsp;&nbsp;.upload(blob, webookUrl)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;.then(console.log)<br />
              </code>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default TransFlow
