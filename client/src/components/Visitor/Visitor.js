import React, { useState, useEffect } from 'react'
import queryString from 'query-string' //retrieves data from the url!
import io from 'socket.io-client'
import {Link} from 'react-router-dom'
import Navbar from '../NavBar'

let socket;

const Visitor = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('') //users is the array of all users in this chatroom. Not all of them are necessarily playing.
  const [playersInRoom, setPlayersInRoom] = useState([])

  const ENDPOINT = 'http://localhost:5000'
  // const ENDPOINT = 'http://liars-dice-app.netlify.com'
  
  let visitLink = window.location.href
  let startLink = visitLink.split('=')
  let finalLink = startLink[0] + '=' + `${name}` + startLink[1] + '=' + startLink[2]

  useEffect(()=>{
    const {room} = queryString.parse(location.search) //grab Name and Room from the url (which was created in Join.js)
    socket = io(ENDPOINT)
    setRoom(room)
    socket.emit('visitor', {room},()=>{
    });
  },[ENDPOINT, location.search])

  useEffect(()=>{
    socket.on("playersInRoom", ({playersInRoom})=>{
      setPlayersInRoom(playersInRoom)
    })
  })

  return (
    <>
      <Navbar/>
      <div className="joinOuterContainer">
        <div className="joinInnerContainer">
          <h1 className="joinHeading">You're invited Liars' Dice room: "{room}"</h1>
          <div className="grey-text text-lighten-1">
            {playersInRoom.length? <>
              <h5>Users in this room:</h5>
              {playersInRoom.map(player=>(<ul>{player.name}</ul>))}
            </>: null}
          </div>
          <h5 className="white-text"><u>Enter a unique name and join them!</u></h5>
          <div className="grey lighten-4">
            <input
              placeholder="Name"
              className="joinInput black-text center"
              type="text"
              onChange={(event) => setName(event.target.value)}
            ></input>
          </div>
          {/* CHAT component now takes the data: name and room.*/}
          <Link
            onClick={(event) => 
              !name || name.toLowerCase() === 'admin' || playersInRoom.map(players=>players.name).includes(name.toLowerCase()) ? event.preventDefault() : null
            }
            to={`/chat?name=${name.toLowerCase()}&room=${room}`}
          >
            <button className="button mt-20" type="submit">
              Join Room
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Visitor