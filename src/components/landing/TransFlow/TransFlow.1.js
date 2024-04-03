import React, { Component } from 'react';
import './TransFlow.scss';
import PanelPiece from 'components/landing/PanelPiece'
import TransDescPiece from 'components/landing/TransDescPiece'
import PercentBar from 'components/landing/PercentBar'
import Spinner from 'components/common/Spinner'

const thumbnailBackground = (backgroundImage) => {
  return {    
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}


class TransFlow extends Component {
  state = {}

  componentDidMount = props => {}
  
  render = () => {
    const props = this.props
    const { collection } = props
    return (
      <div className="flow-panel">
        <div className="flow-row-panel">
          <PanelPiece>
            {collection.video ? <video src={collection.video} className="video-size" controls /> : <span>Loading</span>}
          </PanelPiece>
          <div className="flow-desc-panel">
            <TransDescPiece
              title="Transcode for compatibility."
              cnt="Transcode & create all the assets you need in one shot."            
              className="mb"
            />
            <span>Video Duration {collection.duration/1000}s</span>
          </div>
        </div>
        
        <div className="flow-row">
          <TransDescPiece
            title="Thumnails in sequence to preview your content"
            cnt="Transcode & create all the assets you need in one shot."
            className="center"
          />
          <PanelPiece
            children = {
              <div className="spiece-rows">
                {collection && 
                 collection.thumbnails && 
                 collection.thumbnails.length > 0 && 
                 collection.thumbnails.map((thumb, i) => (
                  <div className={`spiece-${i}`} key={i} style={thumbnailBackground(thumb)} />
                ))}
              </div>
            }
            className = "spiece"
          />
          <div className="branch-point">
            <div className="point"></div>
          </div>
        </div>
        
        <div className="flow-row-panel">
          <PanelPiece>
          {
            collection.video && collection.subtitles ? 
            <video src={collection.video} 
              className="video-size"
              controls 
              crossOrigin="anomymous">
              {collection.subtitles && <track default src={collection.subtitles} />}
            </video> 
            :(<div className="spinner-wrapper">
                <Spinner />
              </div>
            )
          }

          </PanelPiece>
            <div className="flow-desc-panel">
              <TransDescPiece styles={{top: '-70px'}}
                title="Transcription and Subtitle Files"
                cnt="Time coded or as a VTT file. We even make it easy 
                to correct transcription and improve your model over time."
                emph={
                      (collection && 
                       collection.transcripts && 
                       collection.transcripts.length > 0) ?
                        collection.transcripts[0].transcript :
                        'Loading ...'
                     }
                className="up-in-mobile"
              />            
            </div>

            <div className="branch-point">
              <div className="point"></div>
            </div>
        </div>


        <div className="flow-row spiece">
          <TransDescPiece styles={{top: '-60px'}}
            title="Entity Extraction for Text and Images"
            cnt="Transcode & create all the assets you need in one shot."
            className="center spiece"
            badge={(
              <div className="badge-cnt">
                <div className="badge-header">
                  This is a 
                </div>
                <div className="badge">
                  PRO
                </div>
                <div className="badge-tailer">
                  feature,
                  <span> find out more</span>
                </div>
              </div>
              )} />
          <PanelPiece
            children = {
              <div className="spiece-rows">
                <PercentBar color="#e6b242" text="Friendship .10" percent={30} />
                <PercentBar color="#7cbb91" text="Cold .55" percent={50} />
                <PercentBar color="#72bec8" text="Bananas .70" percent={70} />
                <PercentBar color="#c386c6" text="Sqlurtiness .90" percent={100} />
              </div>
            }
            className = "spiece"
          />
          <div className="branch-point last">
            <div className="point"></div>
          </div>
        </div>

        <div className="flow-row-panel">
          <PanelPiece className="glow-blue" styles={{overflow: 'auto', minHeight: '240px'}}>
            <pre className='comment'>
              {'// Easy promise based implementation'}
            </pre>
            <pre>
              import konch from 'konch-sdk'<br/>
              konch.config(&#123;key&#123;)<br/>
              konch.upload(blob, webook)<br/>
                .then(console.log)<br/>
            </pre>
            <pre className='comment'>
              {'// JSON response and webhooks'}
            </pre>
            <pre>
              {JSON.stringify(collection, null, 2)}  
            </pre>
          </PanelPiece>
          <div className="flow-desc-panel last">
            <TransDescPiece
              title="Loved by Developers"
              cnt="Easy to use JSON endpoints, and webhooks to host, ingest, or what ever you please."
              className="mb last"
            />
          </div>
        </div>
      </div>
    )
  }
};

export default TransFlow;
