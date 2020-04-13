import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Join from './components/Join'
import Chat from './components/Chat'
import Visitor from './components/Visitor'
import Rules from './pages/Rules'
import About from './pages/About'


const App = ()=>(
  <Router>
    {/* LATER: build a homepage that shows all the rooms available, stick Join component at the bottom of it (so people can create a room) */}
    <Route path="/" exact component={Join}/>
    {/* <Route path="/" exact component={Join}/> */}
    <Route path="/chat" component={Chat}/>
    <Route path="/visitor" component={Visitor}/>
    <Route path="/rules" component={Rules}/>
    <Route path="/about" component={About}/>
  </Router>
)

export default App