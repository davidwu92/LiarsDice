import React, { useState } from 'react'
import{Link} from 'react-router-dom'

const Visitor = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('') //users is the array of all users in this chatroom. Not all of them are necessarily playing.

  let visitLink = window.location.href
  let startLink = visitLink.split('=')
  let finalLink = startLink[0] + '=' + `${name}` + startLink[1] + '=' + startLink[2]

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="joinHeading">Welcome to Liars' Dice</h1>
        <h2 className="joinHeading">Join Room</h2>
        <div>
          <input
            placeholder="Name"
            className="joinInput white-text"
            type="text"
            onChange={(event) => setName(event.target.value)}
          ></input>
        </div>
        {/* CHAT component now takes the data: name and room.*/}
        <Link
          onClick={(event) =>
            !name || name == 'admin' ? event.preventDefault() : null
          }
          to={'chat?name' + '=' + `${name}` + startLink[1] + '=' + startLink[2]}
        >
          <button className="button mt-20" type="submit">
            Join Room
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Visitor