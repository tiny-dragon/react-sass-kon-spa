import React from 'react'
import ContentEditable from 'react-contenteditable'
import styled from 'styled-components'

const NoSelectContentEditable = styled(ContentEditable)`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; 
  user-select: none; 
  cursor: text;
  display: inline-block;
`

export default class Word extends React.Component {
  constructor () {
    super()
    this.state = {
      html: ''
    }
  }

  componentWillMount = props => {
    this.clickTimeout = null
    this.setState({html: this.props.children})
  }

  componentWillReceiveProps = (props) => {
    this.setState({html: props.children})
  }

  handleChange = evt => {
    this.setState({html: evt.target.value})
    if (this.props.onChange && evt.target.value !== this.state.html) {
      this.props.onChange(evt.target.value)
    }
  }

  handleClick = evt => {
    if (this.clickTimeout !== null) {
      // DOUBLE CLICK
      clearTimeout(this.clickTimeout)
      this.clickTimeout = null
      this.props.handleDoubleClick && this.props.handleDoubleClick(evt)
      this.props.onRightClick && this.props.onRightClick(evt)
      document.execCommand('selectAll', false, null)
    } else {
      // SINGLE CLICK
      this.clickTimeout = setTimeout(() => {
        clearTimeout(this.clickTimeout)
        this.clickTimeout = null
        this.props.handleClick && this.props.handleClick(evt)
      }, 250)
    }
  }

  getCaretCharacterOffsetWithin = (element) => {
    var caretOffset = 0
    var doc = element.ownerDocument || element.document
    var win = doc.defaultView || doc.parentWindow
    var sel
    if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection()
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0)
        var preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
      }
    } else if ((sel === doc.selection) && sel.type !== 'Control') {
      var textRange = sel.createRange()
      var preCaretTextRange = doc.body.createTextRange()
      preCaretTextRange.moveToElementText(element)
      preCaretTextRange.setEndPoint('EndToEnd', textRange)
      caretOffset = preCaretTextRange.text.length
    }
    return caretOffset
  }

  render = () => {
    const {
      className,
      isEditable,
      confidence,
      nextElem,
      prevElem,
      onRightClick
    } = this.props

    return (
      <NoSelectContentEditable
        onClick={this.handleClick}
        onContextMenu={evt => {
          evt.preventDefault()
          document.execCommand('selectAll', false, null)
          onRightClick && onRightClick(evt)
        }}
        onKeyDown={evt => {
          const pos = this.getCaretCharacterOffsetWithin(evt.target)
          if (evt.keyCode === 39 && pos >= this.state.html.length) {
            evt.stopPropagation()
            evt.preventDefault()
            nextElem && nextElem(evt.target)
          } else if (evt.keyCode === 37 && pos === 0) {
            evt.stopPropagation()
            evt.preventDefault()
            prevElem && prevElem(evt.target)
          } else {
            console.log(this.state.html)
          }
        }}
        className={className}
        html={`${this.state.html}`}
        disabled={!isEditable}
        onChange={this.handleChange}
        title={confidence ? `${Math.trunc(confidence * 100)}%` : '-'}
      />
    )
  }
}
