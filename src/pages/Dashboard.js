import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'
import axios from 'axios'
import styled from 'styled-components'
import PageTemplate from 'components/base/PageTemplate'
import { FUNCTIONS_URL, ASSETS_URL } from 'utils/env'
import MoreHoriz from 'static/images/more_horiz.svg'
import UserButton from 'components/base/UserButton'

import Dropdown from 'rc-dropdown'
import 'rc-dropdown/assets/index.css'

const menu = (
  <div onSelect={() => {}}>
    <div>menu 1</div>
    <div>menu 2</div>
    <div>menu 3</div>
  </div>
)

const Header = ({email, abbre, opened}) => (
  <div style={{height: '81px', margin: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0px 70px'}}>
    <div style={{lineHeight: '81px', marginRight: '15px'}}>
      {email}
    </div>

    <Dropdown
      trigger={['click']}
      overlay={menu}
      animation='slide-up'
      onVisibleChange={() => {}}
    >
      <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
        <div style={{width: '35px', height: '35px', borderRadius: '35px', background: '#88df90', lineHeight: '35px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold'}}>
          {abbre}
        </div>
        <div style={{transform: `rotate(${opened ? '180deg' : '0deg'})`, width: '10px', height: '10px', marginLeft: '5px'}}>
            ^
        </div>
      </div>
    </Dropdown>

  </div>
)

const Card = ({name, part, mins}) => (
  <div style={{width: '177px', marginRight: '16px', marginBottom: '16px', fontFamily: 'Lato-Regular', boxShadow: '0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.12)'}}>
    <div style={{height: '163px', fontSize: '14px', letterSpacing: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <div>David Okuniev <br />Part1</div>
    </div>
    <div style={{height: '47px', borderTop: '1px solid #eeeeee', fontSize: '12px', letterSpacing: '-0.8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{marginLeft: '16px'}}>23.minutes</div>
      <div style={{marginRight: '18px', cursor: 'pointer'}}><img src={MoreHoriz} alt={'more'} /></div>
    </div>
  </div>
)

const CollectionRow = styled.a`
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #FFF;
  display: flex;
  align-items: center;
  display: inline-block;
  margin: 10px;
  min-width: 45%;
`
CollectionRow.displayName = 'CollectionRow'

const CollectionDate = styled.div`
  opacity: 0.5;
  font-weight: normal;
  font-size: 0.9em;
  margin-top: 5px;
`
CollectionRow.displayName = 'CollectionRow'

const Thumb = styled.img`
  width: 70px;
  margin-right: 10px;
`
Thumb.displayName = 'Thumb'

const CollectionText = styled.span`
  color: white;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
`
CollectionText.displayName = 'CollectionText'

class Dashboard extends Component {
  state = {
    apiUserInfo: {}
  }

  componentDidMount = props => {
    this.props.firebase.auth().onAuthStateChanged((user) => {
      user.getIdToken(true)
        .then(idToken => {
          const url = FUNCTIONS_URL + '/getUser?idToken=' + idToken
          axios
            .get(url)
            .then(response => {
              console.log(response.data)
              this.setState({
                apiUserInfo: response.data
              })
            })
        }).catch((error) => {
          console.error('Issue getting tokens.', error)
        })
    }) // Auth State Changed
  }

  render = () => {
    const { keys, collections } = this.state.apiUserInfo
    const apiKeys = Object.values(keys || {})

    const collectionKeys = Object.keys(collections || {}).sort(function (a, b) {
      const second = collections[b].added ? collections[b].added : 0
      const first = collections[a].added ? collections[a].added : 0
      return second - first
    }).slice(0, 10)

    return (
      <PageTemplate className={'sdu'}>
        <Header
          email='anerer@sud.uk'
          abbre='AH'
          opened
        />

        <div style={{background: '#fafafa', height: 'calc(100vh - 81px)'}}>
          <div style={{display: 'flex', padding: '43px 47px 0px 84px', justifyContent: 'space-between'}}>
            <div style={{fontSize: '22px'}}>Uploaded files</div>
            <div>
              <UserButton text='+ New upload' onClick={() => {}} className={'dashboard-plus'} />
            </div>
          </div>
          <div style={{display: 'flex', padding: '52px 68px 52px 84px', flexWrap: 'wrap'}}>
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
            <Card
              name='David Okuniev'
              part='Part 1'
              mins='34.23'
            />
          </div>
        </div>

        <div style={{color: '#FFF'}}>
            Your Keys:
          {
            apiKeys.map((key, i) => (
              <span key={i}>{key}</span>
            ))
          }
        </div>

        {
          collectionKeys.map((cid, i) => {
            const stamp = collections[cid].added ? collections[cid].added : 0
            const dateStamp = (new Date(stamp * 1000)).toString()
            console.log(dateStamp)
            return (
              <CollectionRow href={`/edit/${cid}`} key={cid}>
                <Thumb src={`${ASSETS_URL}/${cid}/${cid}-00001.png`} />
                <CollectionText>
                  <div>{cid}</div>
                  <CollectionDate>{dateStamp.toString()}</CollectionDate>
                </CollectionText>
              </CollectionRow>
            )
          })
        }

      </PageTemplate>
    )
  }
}

export default firebaseConnect()(Dashboard)
