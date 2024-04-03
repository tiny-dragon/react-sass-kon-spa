import React, {Component} from 'react'
import './SearchBox.scss'
import UserButton from 'components/base/UserButton'

class SearchBox extends Component {
  state = {}

  onUpload

  render = () => {
    const {
      onChange,
      onClick,
      disabled,
      openRecorder,
      openDropFile
    } = this.props

    return (
      <div className='search-panel'>
        <div className='search-box'>
          <input
            type='text'
            placeholder='Paste your media URL here ...'
            name='search-input'
            onChange={onChange}
            ref={input => (this.input = input)}
          />
          <UserButton disabled={disabled} text='Make Magic' type='search' onClick={evt => onClick(this.input.value)} />
        </div>

        <div className='dotted_curved_line' />

        <div className='search-brief'>
          <div className='video-ques'>
            Don't have a video URL?
          </div>
          <div className='video-circle' />
          <div className='yourself-ques'>
            <span>Record</span> a video
          </div>
          <div className='yourself-here' onClick={openRecorder}>
            here
          </div>
          <div className='yourself-ques' style={{marginLeft: '10px'}}>
             Or, <span style={{color: '#fc600f'}}>⬆</span> <span>upload</span> media file
          </div>
          <div className='yourself-here' onClick={openDropFile}>
            here.
          </div>
        </div>

      </div>
    )
  }
};

export default SearchBox
