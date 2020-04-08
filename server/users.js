//lets create helper functions to manage users.
//JOINING IN, SIGNING OUT, removing/adding users, users' hands, etc.
let users = []

//ADD A USER to socket. Each user is in a room specified in Join.js; starts off with...
// hand: false, isMyTurn: false, isMaster: false, roundsLost: 0, roundsWon: 0.
const addUser = ({id, name, room, hand, isMyTurn, isMaster, roundsLost, roundsWon}) =>{ //(id of socket instance, name of user, room name. All passed from server.)
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

  const user = {id, name, room, hand, isMyTurn, isMaster, roundsLost, roundsWon}
  users.push(user)
  
  return{user}
}

//remove users from socket.
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
const startGameForRoom = (room)=>{ //NEW GAME FUNCTION
  users.forEach(user=>{
    if(user.room===room){
      user.hand=[Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)]
      if(user.isMaster){
        user.isMyTurn = true
      }
    }
  })
}

const passTurn = (room, turnIndex) =>{ //CHANGE WHOSE TURN IT IS. Checks if the next player still has die.
  if (users){
    let players = users.filter((user)=>user.room===room)
    let callerName = players[turnIndex%players.length].name
    // let nextPlayer = players[(turnIndex+1)%players.length].name
    let turnIndexChecker = turnIndex+1
    while (!players[(turnIndexChecker)%players.length].hand.length){
      turnIndexChecker++ //as long as the next person in players array has no hand, add one more to turnIndexChecker.
    }
    let nextPlayer = players[(turnIndexChecker)%players.length].name
    users.forEach(user=>{
      if(user.room===room){
        if(user.name===callerName){user.isMyTurn = false}
        if(user.name===nextPlayer){user.isMyTurn = true}
      }
    })
    return(turnIndexChecker)
  }
}

const startNewRound = (room, turnIndex) =>{
  if(users){
    let players = users.filter((user)=>user.room===room)
    let nextPlayer = players[turnIndex%players.length].name

    users.forEach(user=>{
      if(user.room===room){
        //set everyone's isMyTurn to false except for nextPlayer.
        if(user.name===nextPlayer){user.isMyTurn=true} else {user.isMyTurn=false}
        
        //give everyone a set of die.
        let newHand = []
        let i = 0
        while(i < 5-user.roundsLost){
          newHand.push(Math.ceil(Math.random()*6))
          i++
        }
        user.roundsLost===5 ? user.hand=false : user.hand=newHand 
      }
    })
  }
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom, startGameForRoom, passTurn, startNewRound}