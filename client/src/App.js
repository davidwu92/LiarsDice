import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Join from './components/Join'
import Chat from './components/Chat'


const App = ()=>(
  <Router>
    {/* LATER: build a homepage that shows all the rooms available, stick Join component at the bottom of it (so people can create a room) */}
    <Route path="/" exact component={Join}/>
    {/* <Route path="/" exact component={Join}/> */}
    <Route path="/chat" component={Chat}/>
  </Router>
)

export default App