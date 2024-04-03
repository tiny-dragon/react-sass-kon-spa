import React, { Component } from 'react'
import queryString from 'query-string'
import konch from 'utils/KonchSDK'
import { firebaseConnect } from 'react-redux-firebase'
import ContentEditable from 'react-contenteditable'

import DropFile from 'components/common/DropFile'
import { ToastContainer, toast } from 'react-toastify'
import VideoRecorder from 'components/common/VideoRecorder'
import Particles from 'components/common/Particles'
import PageTemplate from 'components/base/PageTemplate'
import HeaderContainer from 'containers/base/HeaderContainer'
import EarlyAccessHeader from 'components/landing/EarlyAccessHeader'
import Footer from 'components/base/Footer'
import PageIntro from 'components/landing/PageIntro'
import SearchBoxContainer from 'containers/landing/SearchBoxContainer'
import TransFlowContainer from 'containers/landing/TransFlowContainer'
import IntroContainer from 'containers/landing/IntroContainer'
import { WEBHOOK_HANDLER_URL, DEFAULT_COLLECTION_ID, API_URL } from 'utils/env'

class Home extends Component {
  state = {
    processing: false,
    recorderOpen: false,
    dropFileOpen: false,
    progress: {},
    collection: {},
    collectionInput: null
  }

  connectCollection = collectionId => {
    this.props.firebase.database().ref(`Collections`).off()
    const collection = this.props.firebase.database().ref(`Collections/${collectionId}`)

    collection.on('value', (snapshot) => {
      const collection = snapshot.val()
      if (!collection) {
        konch
          .collection(collectionId)
          .then(response => {
            this.setState({ collection: response.result, collectionInput: collectionId })
          })
      } else {
        this.setState({ collection, collectionInput: collectionId })
      }
    })

    if (collectionId !== DEFAULT_COLLECTION_ID) {
      window.history.pushState({}, '', `?collection=${collectionId}`)
    } else {
      window.history.pushState({}, '', `/`)
    }
  }

  updateAndConnect = (collectionId, data) => {
    this.props.firebase.database().ref(`Collections/${collectionId}`).set(data)
    this.connectCollection(collectionId)
  }

  componentDidMount = props => {
    const params = queryString.parse(this.props.location.search)
    const collectionId = params.collection || DEFAULT_COLLECTION_ID
    this.connectCollection(collectionId)
  }

  uploadBlob = videoBlob => {
    this.setState({processing: true})
    console.log('Video Blob', videoBlob.size, videoBlob)
    konch.upload(videoBlob, WEBHOOK_HANDLER_URL, progress => {
      this.setState({progress})
    })
      .then(result => {
        console.log(result)
        this.updateAndConnect(result.id, result)
        this.setState({processing: false, progress: {}})
        this.closeRecorder()
      })
      .catch(err => {
        this.setState({processing: false, progress: {}})
        this.closeRecorder()
        console.error(err)
        toast.error('Error uploading file.', {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
  }

  onDropFilesReady = files => {
    this.setState({progress: {loaded: 1, total: 100}})
    konch
      .upload(files[0], WEBHOOK_HANDLER_URL, progress => {
        this.setState({progress})
      })
      .then(result => {
        this.updateAndConnect(result.id, result)
        this.setState({processing: false, progress: {}})
        this.closeDropFile()
      })
      .catch(err => {
        this.setState({processing: false, progress: {}})
        this.closeDropFile()
        console.log('Error', err)
        toast.error('Error uploading file.', {
          position: toast.POSITION.BOTTOM_LEFT
        })
      })
  }

  onSubmitUrl = url => {
    clearInterval(this.poller)
    this.setState({processing: true})
    konch.process(url, WEBHOOK_HANDLER_URL)
      .then(response => {
        this.setState({processing: false})
        this.updateAndConnect(response.result, {id: response.result})
      })
      .catch(error => {
        console.error(error)
        this.setState({processing: false})
      })
  }

  openRecorder = () => {
    this.setState({recorderOpen: true})
  }

  closeRecorder = () => {
    this.setState({recorderOpen: false})
  }

  openDropFile = () => {
    this.setState({dropFileOpen: true})
  }

  closeDropFile = () => {
    this.setState({dropFileOpen: false})
  }

  render = () => {
    const { collection, processing, recorderOpen, dropFileOpen, progress } = this.state
    const loaded = progress.loaded * 1.0
    const total = progress.total * 1.0
    const perc = Math.trunc((loaded / total) * 100)
    const percLoaded = (perc > 98 ? 98 : perc === 0 ? 1 : perc) || null

    return (
      <div>
        <Particles />
        <PageTemplate
          header={<HeaderContainer />}
          footer={<Footer />}
        >
          <EarlyAccessHeader />
          <PageIntro />

          <SearchBoxContainer
            openRecorder={this.openRecorder}
            openDropFile={this.openDropFile}
            disabled={processing}
            onClick={this.onSubmitUrl} />

          <TransFlowContainer collection={collection || {}} />

          <IntroContainer />

          {
            recorderOpen &&
            <VideoRecorder
              onBackdropClicked={this.closeRecorder}
              progress={percLoaded}
              onBlobReady={this.uploadBlob} />
          }

          {
            dropFileOpen &&
              <DropFile
                onBackdropClicked={this.closeDropFile}
                progress={percLoaded}
                onDropFilesReady={this.onDropFilesReady} />
          }

          {
            <div id='collection-id-banner' style={{position: 'fixed', bottom: 0, right: 0, opacity: 0.8, fontSize: '13px'}}>
              <div style={{backgroundColor: '#333', padding: '6px 12px', color: '#FFF', borderTopLeftRadius: '5px'}}>
                <span>Collection:</span>
                <ContentEditable
                  style={{display: 'inline-block', margin: '0 8px 0 5px'}}
                  html={this.state.collectionInput}
                  onChange={evt => this.setState({collectionInput: evt.target.value})}
                  onClick={evt => document.execCommand('selectAll', false, null)}
                  onKeyDown={evt => {
                    if (evt.keyCode === 13) {
                      evt.preventDefault()
                    }
                  }}
                  onBlur={evt => {
                    this.connectCollection(this.state.collectionInput)
                  }} />
                <a href={`${API_URL}/collections/${collection.id}`} target='_blank'>
                  <span role='img' aria-label='link'>🔗</span>
                </a>
              </div>
            </div>
          }

        </PageTemplate>
        <ToastContainer />
      </div>
    )
  }
}

export default firebaseConnect()(Home)
