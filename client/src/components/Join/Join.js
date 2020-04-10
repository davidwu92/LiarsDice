import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import './Join.css';
//currently our homepage.

const Join = () =>{
  //name state, setNameState
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  return(
    <>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="joinHeading">Welcome to Liars' Dice</h1>
          <h2 className="joinHeading">Join A Room</h2>
          <div><input placeholder="Name" className="joinInput white-text" type="text" onChange={(event)=>setName(event.target.value)}></input></div>
          <div><input placeholder="Room" className="joinInput mt-20 white-text" type="text" onChange={(event)=>setRoom(event.target.value)}></input></div>
          {/* CHAT component now takes the data: name and room.*/}
          <Link 
            onClick={(event)=>(!name || !room || name==="admin") ? event.preventDefault() : null}
            to={`/chat?name=${name}&room=${room}`}>
            <button className="button mt-20" type="submit">Join Room</button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Join