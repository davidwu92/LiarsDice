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
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js')

//In our server, we run methods that allow us to CONNECT and DISCONNECT from socket.io.
io.on('connection', (socket)=>{ //this is a socket that'll be connected as a client side socket.
  console.log("We have a new connection!!")

  //RECEIVES information from the front end. In Chat.js, we EMITTED an event called 'join'.
  //so this all happens when somebody JOINS the room. We'll emit out some admin-generated message when someone joins the room.
  socket.on('join',({name, room}, callback)=>{

    const{error, user} = addUser({id: socket.id, name, room}) //remember, addUser needs id, name and room.
    if (error) return callback(error) //this callback is handled if there's an error. We defined this error as "Username is taken" in users.js.
    
    //if there aren't any errors...
    //Let's emit a message to the user from admin to welcome them.
    socket.emit('message',{user:'admin', text:`Hi ${user.name}! Welcome to the room "${user.room}". ID: ${user.id}`})
    
    //This method sends a message to everyone in that room EXCEPT the just-joined user.
    //Don't forget we need to broadcast.to(user.room)!
    socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined!`})

    //This socket method: Join; this joins a user into a room. Simple.
    socket.join(user.room)
    //when user is finally in the room, we can handle the fun stuff: messaging and such.
    
    //show who else is in the room!
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback()
  })
  
  //user-generated messaging.
  //We'll be waiting for 'sendMessage' to be emitted from the front end.
  socket.on('sendMessage', (message, callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit('message', {user: user.name, text: message})
    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback() //this callback will let us do something after the user has sent something on the front end.
  })


  socket.on('disconnect', ()=>{ //Somebody is disconnecting.
    console.log("User has left the socket.")
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message', {user: "admin", text:`${user.name} has left.`})
    }
  })
  
})


//middleware.
app.use(router)
app.use(cors())

server.listen(PORT, ()=>console.log(`Server has started on port ${PORT}`))