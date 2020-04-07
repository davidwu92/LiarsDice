import React, {useState, useEffect} from 'react'
import queryString from 'query-string' //retrieves data from the url!
import io from 'socket.io-client'
import './Chat.css'

import InfoBar from './../InfoBar'
import Messages from './../Messages'
import Input from './../Input'
import TextContainer from './../TextContainer'
import TurnOptions from './../TurnOptions'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//here's where most of the socket.io logic will be stored.
let socket;

const Chat =({location}) => { //pass in the URL (location); it comes from react router!
  toast.configure();
  const [name, setName] = useState('') //name will be MY name; set once in the first useEffect, never changes.
  const [room, setRoom] = useState('') //same with room.
  
  const ENDPOINT = 'http://localhost:5000'

  //this useEffect is for a user joining. It'll run whenever theres a change to ENDPOINT or the url.
  useEffect(()=>{
    console.log("User Joined useEffect triggering.")
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

  //this useEffect is for MESSAGING.
  useEffect(()=>{
    socket.on('message', (message)=>{ // console.log(message)= {user: "message sender", text:"some message"}
      console.log("message useEffect triggered.")
      setMessages(messages=>[...messages, message]) //whenever a message is sent, set messages to a new array.
    })
    socket.on("roomData", ({users})=>{
      console.log("roomData useEffect triggered.")
      setUsers(users)
    })
  },[])

  //function for sending TEXT messages; this is not a game action.
  const sendMessage = (event)=>{
    event.preventDefault()
    if(messageText){ //if there's a message, emit that message to the server!
      let messageObj = {messageText: messageText, isGameAction:false}
      socket.emit('sendMessage', messageObj, ()=>setMessageText(''))
    }
  }  

  //useEffect for game data.
  const [myQuantity, setMyQuantity] = useState(0) //my call: quantity.
  const [myValue, setMyValue] = useState("") //my call: Dice Value.
  const [currentCall, setCurrentCall] = useState([]) //i.e. [2, "threes"]
  const [turnIndex, setTurnIndex] = useState(-1) //use this number to track who's turn it is; -1 if game not started.
  const [roundNum, setRoundNum] = useState(0) //use this to track what round we're at; 0 if game not started.
  useEffect(()=>{
    socket.on('gameData', (game)=>{
      setUsers(game.users)
      setTurnIndex(game.turnIndex)
      setRoundNum(game.setRoundNum)
      setCurrentCall(game.currentCall)
      console.log('gameData useEffect has triggered.')
    })
  },[])
  
  //START NEW GAME
  const startGame = () =>{
    if(users.length>1){ //since only the master can start the game, pass room and master's name.
      socket.emit('startGame', {room, name}, ()=>{
        console.log("You started the game.")
      })
    } else {
      toast(`You need at least two players to start the game.`,
      {autoClose:4000, delay:0, hideProgressBar: true, type: "error"})
    }
  }

  //MY TURN FUNCTION: making a call.
  const makeCall = (event) =>{
    event.preventDefault()
    if(roundNum == 0){  //makeCall fails: game isn't running.
      console.log("makeCall failed: Game hasn't started.")
      toast(`The game has not started yet.`,
      {autoClose:4000, delay:0, hideProgressBar: true, type: "error"})
      return(false)
    }
    let currentPlayer = users.filter((user)=>user.isMyTurn)
    if (currentPlayer[0].name !== name){
      toast(`It is currently ${currentPlayer[0].name}'s turn.`,
      {autoClose:4000, delay:0, hideProgressBar: true, type: "error"})
      return(false)
    }
    if(myQuantity && myValue){
      if (currentCall){ //if this is NOT the first call...
        console.log("This is not the first call of the round.")
        if(myQuantity===currentCall[0] && myValue===currentCall[1]){ //error: can't make same call as previous player.
          toast("You can't make the same call as the last player.",{autoClose:4000, delay:0, hideProgressBar: true, type: "error"})
          return(false)
        }
        //make the call.
        let call = [myQuantity, myValue] // i.e. [3, "Fives"]
        socket.emit('makeCall', {room, name, call, turnIndex}, ()=>{
          console.log(`${name} made the call: ${call[0]+" "+call[1]}`)
          setMyQuantity(0)
          setMyValue("")
        })
      } else { //this is the first call.
        console.log("This is the first call of the round.")
        //make the call.
        let call = [myQuantity, myValue] // i.e. [3, "Fives"]
        socket.emit('makeCall', {room, name, call, turnIndex}, ()=>{
          console.log(`${name} made the call: ${call[0]+" "+call[1]}`)
          setMyQuantity(0)
          setMyValue("")
        })
      }
    } else {
      // console.log("You must call both a quantity and a value.")
      toast(`You need to call a new quantity and value.`,
      {autoClose:4000, delay:0, hideProgressBar: true, type: "error"})
      return(false)
    }
  }

  //MY TURN FUNCTION: Call Liar!
//code code code

  const testButton = () =>{
    console.log("current call: "+currentCall)
    console.log("turnIndex: "+turnIndex)
  }
  return(
    <>
      <div className="outerContainer">
        {/* <button onClick={makeCall}>DUMMY CALL</button> */}
        <button onClick={testButton}>console.log currentCall and turnIndex</button>
        <div className="container">
          {/* We need to pass off our ROOM property to the infobar! */}
          <InfoBar room={room}/> 

          {/* Messages. Shows all past messages. */}
          <Messages messages={messages} name={name}/>

          {/* Input component (typing area) needs message, setMessage, and sendMessage. */}
          <Input messageText={messageText} setMessageText={setMessageText} sendMessage={sendMessage}/>
          
          {/* MY TURN OPTIONS: either make a call or call liar. Still needs to check if its my turn. */}
          <TurnOptions  currentCall={currentCall} myQuantity={myQuantity} setMyQuantity={setMyQuantity}
            myValue={myValue} setMyValue={setMyValue} makeCall={makeCall}/>

        </div>
        {/* TextContainer currently shows all the users in the room. */}
        <TextContainer users={users} name={name} startGame={startGame}/>
      </div>
    </>
  )
}

export default Chat