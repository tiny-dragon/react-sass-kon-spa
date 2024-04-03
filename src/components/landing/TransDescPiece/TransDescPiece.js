import React from 'react'
import cx from 'classnames'
import './TransDescPiece.scss'

const TransDescPiece = ({title, cnt, emph, badge, className, styles, children}) => {
  return (
    <div className={cx('trans-desc-panel', className)} style={styles}>
      <div className='desc-title'>
        {title}
      </div>
      <div className='desc-cnt'>
        {cnt}
      </div>
      {
        emph &&
          <div className='desc-emph'>
            <div className='emph-border' />
            <div className='emph-cnt'>{emph}</div>
          </div>
      }
      {
        badge &&
          badge
      }
      {children}
    </div>
  )
}

export default TransDescPiece
