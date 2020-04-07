//THIS is our server.
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Let's get helper functions from users.js; they will manage all the USER activity.
const {addUser, removeUser, getUser, getUsersInRoom, startGameForRoom, setPlayerTurn} = require('./users.js')

//In our server, we run methods that allow us to CONNECT and DISCONNECT from socket.io.
io.on('connection', (socket)=>{ //this is a socket that'll be connected as a client side socket.
  console.log("We have a new connection!!")

  //In Join.js, we EMIT an event called 'join' and pass NAME and ROOM when someone joins the room.
  //We'll emit out some admin-generated message when someone joins the room.
  socket.on('join',({name, room}, callback)=>{
    if(getUsersInRoom(room).length){ //NOT THE FIRST TO JOIN.
      const{error, user} = addUser({id: socket.id, name, room, hand:false, isMyTurn: false, isMaster: false, roundsWon:0, roundsLost: 0})
      if (error) return callback(error)
      
      socket.emit('message',{user:'admin', text:`Hi ${user.name}! Welcome to the room "${user.room}".`, isGameAction: false})
      // socket.emit('message',{user:'admin', text:`${user.name} joins the room "${user.room}". ID=${user.id}. Hand=${user.hand}. isMyTurn=${user.isMyTurn}.`, isGameAction: false})
      
      //This method sends a message to everyone in that room EXCEPT the just-joined user. Don't forget we need to broadcast.to(user.room)!
      socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined the room!`,  isGameAction: false})
  
      //This socket method: Join; this joins a user into a room. Simple.
      socket.join(user.room)
      
      //show who else is in the room!
      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
      callback() 
    }
    else { //FIRST JOINER in room: make this user the master.
      const{error, user} = addUser({id: socket.id, name, room, hand:false, isMyTurn: false, isMaster: true, roundsWon:0, roundsLost: 0}) //remember, addUser needs id, name and room.
      if (error) return callback(error) //this callback is handled if there's an error. We defined this error as "Username is taken" in users.js.
      
      //If no errors, admin emits a welcome message JUST TO the user.
      socket.emit('message',{user:'admin', text:`Hi ${user.name}! You have been made master of the room "${user.room}".`, isGameAction: false})
      // socket.emit('message',{user:'admin', text:`${user.name} joins the room "${user.room}". ID=${user.id}. Hand=${user.hand}. isMyTurn=${user.isMyTurn}.`, isGameAction: false})
  
      //This socket method: Join; this joins a user into a room. Simple.
      socket.join(user.room)  
      
      //show who else is in the room!
      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

      callback() 
    } 
  })
  
  //user-generated messaging.
  //We'll be waiting for 'sendMessage' to be emitted from the front end.
  socket.on('sendMessage', (messageObj, callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit('message', {user: user.name, text: messageObj.messageText, isGameAction: messageObj.isGameAction})
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    
    callback() //this callback will let us do something after the user has sent something on the front end.
  })

  //START NEW GAME
  socket.on('startGame', ({room, name}, callback)=>{ //first person in the room will have power to start game.
    console.log(room + " is starting a game.")
    startGameForRoom(room)
    io.to(room).emit('message',{user:'admin', text:`${name} has started the game.`, isGameAction: true})
    io.to(room).emit('gameData', {users: getUsersInRoom(room), turnIndex: 0, roundNum: 1})
    callback()
  })

  //MAKE A CALL
  socket.on('makeCall', ({room, name, call, turnIndex}, callback)=>{
    console.log(`${name} made the call: ${call}`) //call: [2, 'Fives']
    
    //pass turn to next player.
    setPlayerTurn(room, turnIndex)

    //emit that call to whole room.
    io.to(room).emit('message',{user: name, text:`I call ${call[0] + " " + call[1]}.`, isGameAction: true}) 
    io.to(room).emit('gameData', {users: getUsersInRoom(room), turnIndex: turnIndex+1, currentCall: call})
    callback()
  })

  //DISCONNECT FROM ROOM (leave room.)
  socket.on('disconnect', ()=>{ //Somebody is disconnecting.
    console.log("User has left the socket.")
    //add logic: IF THE MASTER LEFT AND THERE ARE STILL ROOM MEMBERS, CHOOSE A NEW MASTER.
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message', {user: "admin", text:`${user.name} has left.`})
      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    }
  })
  
})


//middleware.
app.use(router)
app.use(cors())

server.listen(PORT, ()=>console.log(`Server has started on port ${PORT}`))