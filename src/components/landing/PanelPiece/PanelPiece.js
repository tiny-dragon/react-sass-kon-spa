import React from 'react'
import cx from 'classnames'
import './PanelPiece.scss'

const PanelPiece = ({ children, className, styles }) => (
  <div className={cx('panel-piece', className)} style={styles}>
    { children }
  </div>
)

export default PanelPiece
