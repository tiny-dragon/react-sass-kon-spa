import React, {Component} from 'react'
// import { firebaseConnect } from 'react-redux-firebase'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import './EarlyAccessHeader.scss'

const Header = styled.div`
  text-align: center;
  color: #FFF;
  padding: 6px 17px 29px 17px;
  background-color: lightcoral;
  position: relative;
  border-radius: 4px;
  margin: auto;
  max-width: 912px;
  @media (min-width: 768px) {}
`

// In order to get positions right, we need to have some space if no banner
const Spacer = styled.div`
  height: 35px;
`

class EarlyAccessHeader extends Component {
  state = {}

  componentDidMount = props => {
  }

  render = () => {
    const { profile, firebase: { auth } } = this.props
    const showHeader = auth().currentUser && profile && profile.isLoaded && !profile.hasEarlyAccess

    return (
      <div>
        {
          showHeader
            ? <Header>
              <div className='product-hunt' />
              <h1>We're still rolling out the red carpet.</h1>
              <div>The big event is coming soon, and <span>{profile.email}</span> is on the early access list!</div>
            </Header>
            : <Spacer />
        }
      </div>
    )
  }
};

// export default firebaseConnect()(EarlyAccessHeader)
export default compose(
  withFirebase, // add props.firebase (firebaseConnect() can also be used)
  connect(
    ({ firebase: { profile } }) => ({
      profile
    })
  )
)(EarlyAccessHeader)
