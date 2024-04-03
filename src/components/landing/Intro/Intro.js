import React from 'react'
// import cx from 'classnames';
import './Intro.scss'
import { Link } from 'react-router-dom'
import UserButton from 'components/base/UserButton'
import { PopUpAuth } from 'utils/Firebase'

const Intro = () => {
  return (
    <div className='intro-panel'>
      <h1>But wait, theres more!</h1>
      <p>
        Transcription and key word accuracy is important, especially when using them to make descisions. <br />
        Konch helps you correct your results to improve your models, and automaically updates all your assets.
      </p>

      <div className='intros'>
        <Link to='/'>
          <div className='intro-card'>
            <div className='intro-icon-wrapper cloud' />
            <div className='intro-name'>Hosting</div>
            <div className='intro-desc'>Generate every asset you need without managing infrastructure.</div>
          </div>
        </Link>

        <Link to='/'>
          <div className='intro-card'>
            <div className='intro-icon-wrapper whiteout' />
            <div className='intro-name'>Correction</div>
            <div className='intro-desc'>Our correction keeps your translations and transcription accurate, and redistrubtes updates automatically.</div>
          </div>
        </Link>

        <Link to='/'>
          <div className='intro-card'>
            <div className='intro-icon-wrapper ml' />
            <div className='intro-name'>Custom Models</div>
            <div className='intro-desc'>AI is't perfect, but we will use your feedback to improve a custom model taht is tuned just for you.</div>
          </div>
        </Link>

        <Link to='/'>
          <div className='intro-card'>
            <div className='intro-icon-wrapper search' />
            <div className='intro-name'>Search</div>
            <div className='intro-desc'>Search your videos based on transcription, or translated text. Go upgrade to Optics, and search based on visual content.</div>
          </div>
        </Link>
      </div>

      <div className='create-btn-wrapper'>
        <UserButton text='Create an account' onClick={evt => { PopUpAuth() }} />
      </div>

    </div>
  )
}

export default Intro
