import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import './Join.css';
import NavBar from './../NavBar'
//currently our homepage.

const Join = () =>{
  //name state, setNameState
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  return(
    <>
    <NavBar />
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="joinHeading">Welcome to Liars' Dice</h1>
          <h2 className="joinHeading">Join A Room</h2>
          <div className="grey lighten-4">
            <input placeholder="Name" className="joinInput black-text center" type="text" onChange={(event)=>setName(event.target.value)}></input>
          </div>
          <div className="row"></div>
          <div className="grey lighten-4">
            <input placeholder="Room" className="joinInput mt-20 black-text center" type="text" onChange={(event)=>setRoom(event.target.value)}></input>
          </div>
          {/* CHAT component now takes the data: name and room.*/}
          <Link 
            onClick={(event)=>(!name || !room || name.toLowerCase()==="admin") ? event.preventDefault() : null}
            to={`/chat?name=${name.toLowerCase()}&room=${room}`}>
            <button className="button mt-20" type="submit">Join Room</button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Join