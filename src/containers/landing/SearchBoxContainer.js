import React, { Component } from 'react'
import SearchBox from 'components/landing/SearchBox'

class SearchBoxContainer extends Component {
  onChange = () => {
  }

  render () {
    const { onClick, defaultUrl, disabled, openRecorder, openDropFile } = this.props

    return (
      <SearchBox
        openRecorder={openRecorder}
        openDropFile={openDropFile}
        defaultUrl={defaultUrl}
        onChange={this.onChange}
        onClick={onClick}
        disabled={disabled}
      />
    )
  }
}

export default SearchBoxContainer
