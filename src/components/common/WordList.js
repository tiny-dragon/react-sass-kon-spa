import React, { Component } from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'
import Word from 'components/common/Word'
import Loading from 'components/common/LoadingElipses'

const Root = styled.div`
  line-height: 1.5em;
  position: relative;
`

const StartTimeMarker = styled.div`
  position: absolute;
  left: -40px;
  width: 40px;
  bottom: 21px;
  background-color: red;
  font-size: 10px;
  text-align: center;
  border-bottom-left-radius: 3px;
  border-top-left-radius: 3px;
`

const EndTimeMarker = styled.div`
  position: absolute;
  right: -40px;
  width: 40px;
  bottom: 21px;
  background-color: red;
  font-size: 10px;
  text-align: center;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
`

const ContextMenu = styled.div`
  position: absolute;
  min-width: 14em;
  left: 0px;
  top: 1.4em;
  background-color: #FFF;
  z-index: 999;
  min-height: 40px;
  color: #888;
  padding: 15px;
  border-radius: 3px;
  border: 1px solid rgba(40, 49, 60,0.3);
  box-shadow: 0 0 1px rgba(0,0,0,0.2);
  white-space: nowrap;
  z-index: 109;
`

const ClickCatcherOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
`

const MenuHeader = styled.div`
  height: 2em;
`

const MenuOption = styled.div`
  cursor: pointer;
  height: 2em;
`

const WordCont = styled.span`
  position: relative;
`

const TranscriptWord = styled(Word)`
  outline: none;
  ${props => props.type !== 'punctuation' && `
    margin: 5px 1px;
    padding: 0 3px;
    display: inline-block;
  `}
  ${props => props.selected &&
    `border-top: 2px dashed red;`
} 
  ${props => props.confidence < 1 &&
    `background-color: rgba(200, 200, 100, ${(1 - props.confidence)});`
} 
  ${props => (
    props.isHighlighted &&
      (
        props.highlightColor === 'light'
          ? `background-color: rgba(200,200,20, 0.3);`
          : `background-color: rgba(100,100,10, 0.3);`
      ))}
  ${props => props.contentEditable
    ? `background-color: #FFF; color: #000;`
    : `background-color: none;`
}
`
Word.displayName = 'Word'

const More = styled.span`
  ${props => props.isHighlighted &&
    `background-color: rgba(100,100,20, 0.4);`
}
`

/*
const ContextMenu = styled.div`
  position: absolute;
  background-color: #fff;
  width: 100px;
  height: 100px;
`

const Space = styled.span`
  padding: 4px;
  &:hover {
    background-color: rgba(255,255,255, 0.4);
    cursor: col-resize;
  }
`
*/

export default class WordList extends Component {
  state = {
    words: [],
    highlightMore: false,
    contextMenu: false,
    isDirty: false,
    contextMenuIndex: null
  }

  componentDidMount = () => {
    this.currentWordIndex = 0
    this.currentVideoTime = 0
    this.wordElems = []
    this.setState({
      words: this.props.words
    })
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      words: props.words
    })
  }

  componentWillUnMount = props => clearInterval(this.interval)

  updateWordIndex = (index) => (this.currentWordIndex = index)

  updateHighlights = (currentTime) => {
    this.currentVideoTime = currentTime
    const words = this.state.words
    if (!words) return null

    const wordsSize = words.length
    if (words[this.currentWordIndex]) {
      if (!words[this.currentWordIndex].isHighlighted) {
        words[this.currentWordIndex].isHighlighted = true
        this.setState({ words })
      }
      if (words[this.currentWordIndex].end_time) {
        const currentWordEndTime = parseFloat(words[this.currentWordIndex].end_time)
        if (currentWordEndTime < this.currentVideoTime) {
          this.currentWordIndex += 1
          if (words[this.currentWordIndex] && words[this.currentWordIndex].type === 'punctuation') {
            words[this.currentWordIndex - 1].isHighlighted = false
            this.currentWordIndex += 1
          }
          if (this.currentWordIndex < wordsSize) words[this.currentWordIndex].isHighlighted = true
          if (this.currentWordIndex - 1 < wordsSize) words[this.currentWordIndex - 1].isHighlighted = false
          this.setState({ words })
        }
      } else {
        // punctuation
        this.currentWordIndex += 1
      }
    }
    if (this.props.limit && this.currentWordIndex > this.props.limit) {
      this.setState({highlightMore: true})
    } else if (this.state.highlightMore) {
      this.setState({highlightMore: false})
    }
  }

  clearHighlights = () => {
    const words = this.state.words
    for (let i in words) {
      words[i].isHighlighted = false
    }
    this.setState({words})
  }

  wordClicked = (index, evt) => {
    this.clearHighlights()
    const words = this.state.words
    words[index].isHighlighted = true
    this.setState({ words })
    const wordRef = this.state.words[index]
    const startTime = wordRef.start_time
    const seekTime = Math.abs(startTime - 0.2)
    this.props.seekVideo && this.props.seekVideo(seekTime, evt)
  }

  findWordIndexFromTime = (seekedTime) => {
    for (let i in this.state.words) {
      const word = this.state.words[i]
      if (word && word.start_time && seekedTime >= word.start_time && seekedTime <= word.end_time) {
        return Math.abs(i - 1)
      }
    }
    return 0
  }

  onWordChange = (wordIndex, newContent) => {
    let words = this.state.words
    words[wordIndex].alternatives[0].content = newContent
    words[wordIndex].alternatives[0].confidence = 1.0
    words[wordIndex].alternatives[0].fixed = true
    clearTimeout(this.changeTimeout)
    this.changeTimeout = setTimeout(() => {
      clearTimeout(this.changeTimeout)
      this.props.onChange && this.props.onChange(words)
    }, 1000)
  }

  getWords = () => {
    return this.state.words
  }

  getCaretPos = (el) => {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0)
      var selectedObj = window.getSelection()
      var rangeCount = 0
      var childNodes = selectedObj.anchorNode.parentNode.childNodes
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] === selectedObj.anchorNode) {
          break
        }
        if (childNodes[i].outerHTML) { rangeCount += childNodes[i].outerHTML.length } else if (childNodes[i].nodeType === 3) {
          rangeCount += childNodes[i].textContent.length
        }
      }
      return range.startOffset + rangeCount
    }
    return -1
  }

  focus = (wordElem, end) => {
    const sel = window.getSelection()
    const prevElem = ReactDOM.findDOMNode(wordElem)
    const range = document.createRange()
    range.selectNodeContents(prevElem)
    range.collapse(!end)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  previousWord = (elem, isSpace, i) => {
    this.focus(this.wordElems[i - 1], true)
  }

  nextWord = (elem, isSpace, i) => {
    this.focus(this.wordElems[i + 1], false)
  }

  mergeWith = (wordIndex, toWordIndex) => {
    let words = JSON.parse(JSON.stringify(this.state.words))
    let newWords = []

    // Merge content
    if (wordIndex < toWordIndex) {
      words[wordIndex].alternatives[0].content += ' ' + words[toWordIndex].alternatives[0].content
      words[wordIndex].end_time = words[toWordIndex].end_time
    } else {
      words[wordIndex].alternatives[0].content = words[toWordIndex].alternatives[0].content + ' ' + words[wordIndex].alternatives[0].content
      words[wordIndex].start_time = words[toWordIndex].start_time
    }

    // Merge lists
    const beginning = words.slice(0, toWordIndex)
    const ending = words.slice(toWordIndex + 1, words.length)
    newWords = beginning.concat(ending)

    this.props.onChange && this.props.onChange(newWords)
  }

  render () {
    const {
      isEditable,
      highlightColor,
      limit,
      style,
      showMore,
      className,
      action,
      seekVideo,
      pause,
      play,
      onLoop,
      looping
    } = this.props

    const { words, highlightMore, contextMenuIndex } = this.state
    if (!words) return <Loading>Loading</Loading>
    // make copy to maniuplate what is dispalyed and compare to orig
    let displayCollectionWords = words

    // Since editable sends updates of word list,
    // and we don't want our trimmed list to overwrite our orig list in DB
    // only allow trim if not editable
    let leftOvers = false
    if (!isEditable && limit && words.length > limit) {
      displayCollectionWords = words.slice(0, limit)
      leftOvers = true
    }
    const showMoreHTML = <More isHighlighted={!!highlightMore}>
      {showMore || <span>...</span>}
    </More>

    return <Root className={className} style={style} >
      {
        displayCollectionWords.map((word, i) =>
          <div style={{display: 'inline-block'}} key={i}>
            {
              contextMenuIndex === i &&
              <ClickCatcherOverlay
                onClick={evt => {
                  this.setState({contextMenuIndex: null})
                  // evt.preventDefault()
                }}
                onContextMenu={evt => {
                  this.setState({contextMenuIndex: null})
                  evt.preventDefault()
                }}
              />
            }
            <WordCont>
              {
                contextMenuIndex === i &&
                <StartTimeMarker>
                  {parseFloat(word.start_time).toFixed(2)}
                </StartTimeMarker>
              }
              <TranscriptWord
                isEditable={isEditable}
                highlightColor={highlightColor}
                selected={contextMenuIndex === i}
                rightClick={evt => console.log('sadfds')}
                nextElem={(elem, isSpace) => this.nextWord(elem, isSpace, i)}
                prevElem={(elem, isSpace) => this.previousWord(elem, isSpace, i)}
                innerRef={el => (this.wordElems[i] = el)}
                type={word.type}
                isHighlighted={!!word.isHighlighted}
                confidence={word.alternatives[0].confidence}
                onChange={evt => this.onWordChange(i, evt)}
                handleClick={evt => {
                  pause && pause()
                }}
                onRightClick={evt => {
                  if (isEditable) {
                    pause && pause()
                    this.setState({contextMenuIndex: i})
                  }
                }}
                // handleDoubleClick={newContent => this.wordClicked(i, newContent)}
              >
                {word.alternatives[0].content}
              </TranscriptWord>
              {
                contextMenuIndex === i &&
                <EndTimeMarker>
                  {parseFloat(word.end_time).toFixed(2)}
                </EndTimeMarker>
              }

              {
                contextMenuIndex === i &&
                <ContextMenu onClick={evt => this.setState({contextMenuIndex: null})}>
                  <MenuHeader>

                    <i>{word.alternatives[0].content}</i> -
                    {
                      word.alternatives[0].confidence &&
                      <i>{Math.trunc(word.alternatives[0].confidence * 100)}%</i>
                    }

                  </MenuHeader>

                  <MenuOption onClick={evt => {
                    this.onWordChange(i, word.alternatives[0].content)
                  }}>
                    <span role='img' aria-label='play'>✅ </span>

                              Mark as accurate

                  </MenuOption>

                  <MenuOption>
                    <span onClick={evt => {
                      seekVideo && seekVideo(word.start_time)
                    }}>
                      <span role='img' aria-label='play'>▶️ </span>
                                Play from here or
                    </span>
                    <span
                      style={{textDecoration: 'underline', marginLeft: '4px'}}
                      onClick={evt => (play && play())}>
                                resume
                    </span>

                  </MenuOption>
                  {
                    looping
                      ? <MenuOption onClick={evt => {
                        onLoop && onLoop(null)
                      }}>
                        <span role='img' aria-label='play'>⏹️</span>
                                Stop Looping
                      </MenuOption>
                      : <MenuOption onClick={evt => {
                        onLoop && onLoop({
                          from: Math.abs(parseFloat(word.end_time) - 1),
                          to: parseFloat(word.end_time) + 2
                        })
                      }}>
                        <span role='img' aria-label='play'>🔁</span>
                                Loop Playback
                      </MenuOption>
                  }

                  {
                    i < words.length - 1 &&
                    <MenuOption onClick={evt => {
                      this.mergeWith(i, i + 1)
                    }}>
                      <span role='img' aria-label='play'>➡️</span>

                                Merge with "{words[i + 1].alternatives[0].content}"

                    </MenuOption>
                  }
                  {
                    i > 0 &&
                    <MenuOption onClick={evt => {
                      this.mergeWith(i, i - 1)
                    }}>
                      <span role='img' aria-label='play'>⬅️</span>

                                Merge with "{words[i - 1].alternatives[0].content}"

                    </MenuOption>
                  }
                </ContextMenu>
              }
            </WordCont>
          </div>
        )}
      { leftOvers && showMoreHTML }
      { action && action }
    </Root>
  }
}
