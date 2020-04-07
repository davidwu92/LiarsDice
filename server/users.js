//lets create helper functions to manage users.
//JOINING IN, SIGNING OUT, removing/adding users. Even keeping track of which users are in what rooms.
let users = []
const ongoingGames = {}

//add users
const addUser = ({id, name, room, hand, isMyTurn, isMaster}) =>{ //(id of socket instance, name of user, room name. All passed from server.)
  //change the names; Javascript Mastery => javascriptmastery
  //trimming removes whitespace.
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  const existingUser = users.find((user)=>user.room ===room && user.name===name) //find if there's already an existing user with the same name.
  if (existingUser){
    return{error: 'Username is taken.'}
  } else if (name==="admin"){
    return{error: 'You cannot use the name "admin".'}
  }

  const user = {id, name, room, hand, isMyTurn, isMaster}
  users.push(user)
  
  return{user}
}

//remove users
const removeUser = (id) =>{
  const index = users.findIndex((user)=>user.id===id)
  if(index !=-1){
    return users.splice(index,1)[0]
  } //this removes the user from that users array.
}

//get user for text messaging. Takes a socket.id and returns the user attached to that message.
const getUser = (id) => users.find((user)=>user.id===id);

//get users in room; takes a ROOM NAME and returns array of everyone in that room.
const getUsersInRoom = (room) => users.filter((user)=>user.room===room)


//GAME FUNCTIONS
const startGameForRoom = (room)=>{
  users.forEach(user=>{
    if(user.room===room){
      user.hand=[Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)]
      if(user.isMaster){
        user.isMyTurn = true
      }
    }
  })
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom, startGameForRoom}