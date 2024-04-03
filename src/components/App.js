import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UserIsAuthenticated from 'utils/Auth'
import Home from 'pages/Home'
import Dashboard from 'pages/Dashboard'
import Editor from 'pages/Editor'
import Login from 'pages/Login'

const ChooseRoom = (Home) => {
  const hostList = window.location.host.split('.')
  const regularNames = ['konch', 'dev', 'app', 'local']
  if (regularNames.indexOf(hostList[0]) >= 0) {
    console.log('Regular name')
    return Home
  } else {
    console.log('Enterprise name')
    return Login
  }
}

const App = () => (
  <React.Fragment>
    <Switch>
      <Route exact path='/dashboard' component={UserIsAuthenticated(Dashboard)} />
      <Route exact path='/edit/:id' component={Editor} />
      <Route exact path='/' component={ChooseRoom(Home)} />
    </Switch>
  </React.Fragment>
)

export default App
