// @flow
import React from 'react'
import cx from 'classnames'
import './UserButton.scss'
import searchOval from 'static/images/oval.png'

const providers = {
  search: {
    Icon: searchOval
  }
}

const UserButton = (props) => {
  const { type, text, onClick, disabled, className } = props
  const { Icon } = providers[type] ? providers[type] : {Icon: null}
  return (
    <div className={cx('user-button', type, className)} onClick={!disabled ? onClick : null} disabled={disabled}>
      <div className='text'>
        <span>{text}</span>
      </div>
      {
        Icon &&
        <div className='icon'>
          <img src={Icon} alt='search-oval' />
        </div>
      }
    </div>
  )
}

export default UserButton
