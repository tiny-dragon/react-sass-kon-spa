import React, { Component } from 'react'
// import styled from 'styled-components'
import konch from 'utils/KonchSDK'

import PageTemplate from 'components/base/PageTemplate'
import HeaderContainer from 'containers/base/HeaderContainer'
// import Footer from 'components/base/Footer'
import Editor from 'components/common/Editor'
import Spinner from 'components/common/Spinner'

class EditorPage extends Component {
  state = {}

  componentDidMount = props => {
    konch
      .collection(this.props.match.params.id)
      .then(response => {
        const collection = response.result
        console.log('collection respone', collection)
        this.setState({ collection })
      })
  }

  render = () => {
    const { collection } = this.state
    return (
      <PageTemplate
        header={<HeaderContainer />}>
        {
          collection
            ? <Editor collection={collection} />
            : <Spinner />
        }

      </PageTemplate>
    )
  }
}

export default EditorPage
