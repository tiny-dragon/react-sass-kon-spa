import React, { Component } from 'react'
import styled from 'styled-components'

import { firebaseAuth } from 'utils/Firebase'
import PageTemplate from 'components/base/PageTemplate'

import SduLogo from 'static/images/sdu_logo.png'
import StudentImg from 'static/images/student.png'

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  min-height: 100vh;
  @media (max-width: 1040px) {
    display: flex;
    flex-direction: column;
  }
`

const LeftCnt = styled.div`
  background: #27313c;
`

const RightCnt = styled.div`  
`
const LeftWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: url(${StudentImg}) left bottom no-repeat;
  @media (max-width: 1040px) {   
    height: 670px;
  }
`
const SduLogoImg = styled.img`
  margin-top: 35px;
  margin-left: 50px;
  @media (max-width: 1040px) {
    margin-top: 40px;    
  }
`
const DescTxt = styled.div`
  margin-top: 268px;
  margin-left: 20vw;
  color: black;
  line-height: 40px;
  font-size: 25px;
  font-family: 'Lato-Light';
  @media (max-width: 1040px) {
    margin-top: 20px;
    text-align: center;
  }
`
const NameTxt = styled.div`
  margin-top: 250px;
  margin-left: 30vw;
  color: black;
  font-size: 25px;
  font-family: 'Lato-Light';  
  
  @media (max-width: 1040px) {
    margin-left: 60vw;
  }

  @media (max-width: 540px) {
    margin-top: 157px;
    margin-left: 240px;
  }
`

const RightWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1040px) {   
    height: 400px;
  }
`
const FormWrapper = styled.div`
  width: 363px;
`
const InputWithIcon = styled.div`
  position: relative;  
  margin-top: 15px;
  i {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 17px;    
  }  
`
const Input = styled.input`
  ${props => props.invalid && `
    outline: 2px solid red;
  `}
  display: block;
  height: 40px;
  width: 100%;
  font-size: 12px;
  text-indent: 40px;
  color: #4d5866;
  border-radius: 5px;
  border: 1px solid #e5eaf0;
  &:focus {
    outline: none !important;
    border:1px solid #4ac4ff;

    &+i {
      color: #4ac4ff;
    }
  }
`
const Button = styled.button`
  height: 44px;
  width: 100%;
  background: #14cd63;
  color: white;
  border-top: 1px solid #47d885;
  border-bottom: 1px solid #b3efcd;
  font-size: 20px;
  border-right: 1px solid #3bd57d;
  border-left: 1px solid #3bd57d;
  border-radius: 5px;
  cursor: pointer;
  outline: none !important;
`

class EnterpriseLogin extends Component {
  state = {
    email: '',
    password: ''
  }

  componentDidMount = props => {}

  // Test Account
  // email: test@konch.ai
  // password: test1234

  doLogin = (event) => {
    const { email, password } = this.state
    event.preventDefault()
    firebaseAuth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        if (user) {
          window.location.href = '/dashboard'
        }
      })
      .catch(console.error)
    return false
  }

  render = () => {
    const { email, password } = this.state
    return (
      <PageTemplate className={'sdu'}>
        <GridWrapper>
          <LeftCnt>
            <LeftWrapper>
              <SduLogoImg src={SduLogo} />
              <DescTxt>
                <div>"Transcribing is much</div>
                <div style={{marginLeft: '54px'}}>easier than it used to be"</div>
              </DescTxt>
              <NameTxt>
                <div>Kate Benson</div>
                <div style={{marginLeft: '37px', fontSize: '18px'}}>Msc. Economics</div>
              </NameTxt>
            </LeftWrapper>
          </LeftCnt>

          <RightCnt>
            <RightWrapper>
              <FormWrapper>
                <div style={{color: '#2c3a4a', fontSize: '20px', textAlign: 'center'}}>Good afternoon! Welcome back.</div>
                <div style={{color: '#97a2b3', fontSize: '15px', textAlign: 'center', marginTop: '15px', marginBottom: '30px'}}>Sign into your account here:</div>
                <form onSubmit={this.doLogin}>
                  <InputWithIcon>
                    <Input value={email} type='text' onChange={evt => this.setState({ email: evt.target.value })} placeholder='Email address' />
                    <i className='material-icons'>email</i>
                  </InputWithIcon>
                  <InputWithIcon>
                    <Input value={password} type='password' onChange={evt => this.setState({ password: evt.target.value })} placeholder='Password' />
                    <i className='material-icons'>lock</i>
                  </InputWithIcon>
                  <a style={{display: 'block', color: '#8493a6', textAlign: 'right', marginTop: '15px', marginBottom: '15px', fontSize: '13px'}}>
                    Forgotten password?
                  </a>
                  <Button onClick={this.doLogin}>Sign in</Button>
                </form>
              </FormWrapper>
            </RightWrapper>
          </RightCnt>
        </GridWrapper>
      </PageTemplate>
    )
  }
}

export default EnterpriseLogin
