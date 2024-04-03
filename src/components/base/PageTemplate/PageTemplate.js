import React from 'react'
import Responsive from 'components/common/Responsive'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import './PageTemplate.scss'

const PageTemplate = (props) => {
  const { header, footer, children, profile, className, firebase: { auth } } = props
  const showHeader = auth().currentUser && profile && profile.isLoaded && !profile.hasEarlyAccess
  return (
    <div className={`page-template ${showHeader ? 'tall' : ''} ${className}`} >
      {header}
      <main>
        <Responsive>
          {children}
        </Responsive>
      </main>
      {footer}
    </div>
  )
}

export default compose(
  withFirebase, // add props.firebase (firebaseConnect() can also be used)
  connect(
    ({ firebase: { profile } }) => ({
      profile
    }),
    () => ({hello: 'dude'})
  )
)(PageTemplate)
