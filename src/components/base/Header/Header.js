import React from 'react'
import { firebaseConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import { PopUpAuth } from 'utils/Firebase'
import Responsive from 'components/common/Responsive'
import logoImg from 'static/images/logo.png'
import './Header.scss'

const Header = (props) => {
  const { firebase } = props
  const { currentUser } = firebase.auth()
  const name = currentUser && currentUser.displayName ? currentUser.displayName.split(' ')[0] : ''
  return (
    <header className='base header'>
      <Responsive className='header-wrapper'>
        <div className='brand'>
          <Link to='/'>
            <img src={logoImg} alt='logo' />
            <span>konch</span>
          </Link>
        </div>
        <div className='right'>
          {
            currentUser
              ? <nav>
                <a>{name}</a>
                <Link to='/' onClick={firebase.logout}>Logout</Link>
              </nav>
              : <nav>
                <a onClick={PopUpAuth}>Create an account</a>
                <a onClick={PopUpAuth}>Login</a>
              </nav>
          }
        </div>
      </Responsive>
    </header>
  )
}

export default firebaseConnect()(Header)
