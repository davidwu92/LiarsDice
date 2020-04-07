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

  //this useEffect is for a user joining. It'll run whenever theres a change to ENDPOINT or the url.
  useEffect(()=>{
    const {name, room} = queryString.parse(location.search) //grab Name and Room from the url (which was created in Join.js)
    socket = io(ENDPOINT)
    setName(name)
    setRoom(room)
    console.log(socket)

    //emit lets us pass in strings and data! This data can be received on backend.
    //Socket.emit needs... 1. the event name ("join"); server will listen w/ socket.on("join")
    //2. an object of the info, in this case the NAME and ROOM.
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

  const [users, setUsers] = useState('') //users is the array of all users in this chatroom. Not all of them are necessarily playing.
  const [messageText, setMessageText] = useState('') //TYPED MESSAGE state.
  const [messages, setMessages] = useState([]) //all messages ever sent.

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

  //function for sending TEXT messages; this is not a game action.
  const sendMessage = (event)=>{
    event.preventDefault()
    if(messageText){ //if there's a message, emit that message to the server!
      let messageObj = {messageText: messageText, isGameAction:false}
      socket.emit('sendMessage', messageObj, ()=>setMessageText(''))
    }
  }  

  //useEffect: takes care of game data.
  const [myQuantity, setMyQuantity] = useState(0) //my call: quantity.
  const [myValue, setMyValue] = useState("") //my call: Dice Value.
  const [currentCall, setCurrentCall] = useState([]) //i.e. [2, "threes"]
  const [turnIndex, setTurnIndex] = useState(-1) //use this number to track who's turn it is?
  const [roundNum, setRoundNum] = useState(0) //use this to track what round we're at?
  useEffect(()=>{
    socket.on('gameData', (game)=>{
      setUsers(game.users)
      setTurnIndex(game.turnIndex)
      setRoundNum(game.setRoundNum)
      setCurrentCall(game.currentCall)
    })
  },[users, turnIndex, roundNum, currentCall])
  
  //START NEW GAME
  const startGame = () =>{
    if(users.length>1){ //since only the master can start the game, pass master's name.
      socket.emit('startGame', {room, name}, ()=>{
        console.log("Game starting.")
      })
    } else {
      console.log("You need at least two players to start the game.")
    }
  }

  //MY TURN FUNCTION: making a call.
  const makeCall = (event) =>{
    event.preventDefault()
    // let call = [myQuantity, myValue]
    let call = [3, "Fives"] //dummy call.
    socket.emit('makeCall', {room, name, call, turnIndex}, ()=>{
      console.log(`${name} made the call: ${call[0]+" "+call[1]}`)
    })
  }

  const testButton = () =>{
    console.log("current call: "+currentCall)
    console.log("turnIndex: "+turnIndex)
  }
  return(
    <>
      <div className="outerContainer">
        <button onClick={makeCall}>DUMMY CALL</button>
        <button onClick={testButton}>TEST BUTTON</button>
        <div className="container">
          {/* We need to pass off our ROOM property to the infobar! */}
          <InfoBar room={room}/> 

          {/* Messages. Shows all past messages. */}
          <Messages messages={messages} name={name}/>

          {/* Input component (typing area) needs message, setMessage, and sendMessage. */}
          <Input messageText={messageText} setMessageText={setMessageText} sendMessage={sendMessage}/>
          
          {/* MY TURN: OPTIONS */}
          <div className="green lighten-1">
            <div class="input-field">
              <select className="browser-default green lighten-1 white-text" style={{width: "35%", display:"inline"}}>
                <option value="" disabled selected>Call a Quantity</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
              <span> </span>
              <select className="browser-default green lighten-1 white-text" style={{width: "35%", display:"inline"}}>
                <option value="" disabled selected>Dice Value</option>
                <option value="Twos">Twos</option>
                <option value="Threes">Threes</option>
                <option value="Fours">Fours</option>
                <option value="Fives">Fives</option>
                <option value="Sixes">Sixes</option>
              </select>
              <button className="btn green right" onClick={makeCall}>Make Call!</button>
            </div>
          </div>
          <button className="btn red">Call Liar!</button>
        </div>
        {/* TextContainer currently shows all the users in the room. */}
        <TextContainer users={users} name={name} startGame={startGame}/>
      </div>
    </>
  )
}

export default Chat