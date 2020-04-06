import React, {useState, useEffect} from 'react'
import queryString from 'query-string' //retrieves data from the url!
import io from 'socket.io-client'
import './Chat.css'

import InfoBar from './../InfoBar'
import Messages from './../Messages'
import Input from './../Input'
import TextContainer from './../TextContainer'

//here's where most of the socket.io logic will be stored.
let socket;

const Chat =({location}) => { //pass in the URL (location); it comes from react router!
  const [name, setName] = useState('') //name will be MY name; set once in the first useEffect, never changes.
  const [room, setRoom] = useState('') //same with room.
  
  const ENDPOINT = 'http://localhost:5000'

  //this useEffect is for joining a room. It'll run whenever theres a change to ENDPOINT or the url.
  useEffect(()=>{
    const {name, room} = queryString.parse(location.search)
    socket = io(ENDPOINT)
    setName(name)
    setRoom(room)
    console.log(socket)

    //emit lets us pass in strings and data! This data can be received on backend.
    //Socket.emit needs... 1. the event name ("join"); server will listen w/ socket.on("join")
    //2. an object of the info needed, in this case the NAME and ROOM.
    //3. Some error-handling callback that'll run if there's an error.
    socket.emit('join', {name, room},()=>{
    });
    
    //to finish our useEffect hook, we give it a return function that'll run when it's time to cleanup.
    //used for disconnect/unmounting (leaving chat)
    return ()=>{
      socket.emit('disconnect')
      socket.disconnect()
    }
  },[ENDPOINT, location.search])

  const [users, setUsers] = useState('') //users is the array of all users in this chatroom.
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  //this useEffect is for MESSAGING. Runs whenever there's a change to Messages array.
  useEffect(()=>{
    socket.on('message', (message)=>{
      // console.log(message) //{user: "message sender", text:"some message"}
      setMessages([...messages, message]) //whenever a message is sent, "push" to messages array.
    })
    socket.on("roomData", ({users})=>{
      setUsers(users)
    })
  },[messages, users])

  //function for sending messages.
  const sendMessage = (event)=>{
    event.preventDefault()
    if(message){ //if there's a message, emit that message to the server!
      socket.emit('sendMessage', message, ()=>setMessage(''))
    }
  }  

  return(
    <>
      <div className="outerContainer">
        <div className="container">
          {/* We need to pass off our ROOM property to the infobar! */}
          <InfoBar room={room}/> 

          {/* Messages. Shows all past messages. */}
          <Messages messages={messages} name={name}/>

          {/* Input component (typing area) needs message, setMessage, and sendMessage. */}
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        {/* TextContainer currently shows all the users in the room. */}
        <TextContainer users={users}/>
      </div>
    </>
  )
}

export default Chat