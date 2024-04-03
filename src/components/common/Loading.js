import React from 'react'
import styled from 'styled-components'
import PageTemplate from 'components/base/PageTemplate'
import Spinner from './Spinner'

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  text-align: center;
  position: fixed;
  top: 40%;

`

const CenteredSpinner = styled(Spinner)`
  margin: auto;
`

const Loading = () => {
  return (
    <PageTemplate>
      <Overlay>
        <CenteredSpinner />
      </Overlay>
    </PageTemplate>
  )
}

export default Loading
