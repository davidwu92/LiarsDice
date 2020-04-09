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

//if the master leaves the room, choose new master.
const chooseNewMaster = (name, room) => { //returns FALSE if the leaver is room master.
  if(users){
    let players = users.filter((user)=>user.room===room)
    if(players.length){
      let newMaster = players[0].name
      users.forEach(user=>{
        if(user.name===newMaster){user.isMaster=true}
      })
      return(newMaster)
    }
  }
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

const endRound = (room, name, previousPlayer, turnIndex, currentCall) =>{
  //this function will return object with all the round results and an updated turnIndex.
  if(users){
    let roundResults = {turnIndex: 0, numberOfCalledValue:0, roundWinner: "", roundLoser:"", loserEliminated:false, gameEnded:false}
    let players = users.filter((user)=>user.room===room)
    
    //determine true number of calledValue (if the call was 5 Sixes, we find the total number of 1's and 6's.)
    let numberOfCalledValue = 0
    switch(currentCall[1]){
      case "Two": 
        players.forEach(player=>{
          if(player.hand){ //if the player has a hand...
            player.hand.forEach(dieValue=>{
              if(dieValue===1 || dieValue===2){numberOfCalledValue++}
            })
          }
        })
      break;
      case "Three": 
        players.forEach(player=>{
          if(player.hand){ //if the player has a hand...
            player.hand.forEach(dieValue=>{
              if(dieValue===1 || dieValue===3){numberOfCalledValue++}
            })
          }
        })
      break;
      case "Four": 
        players.forEach(player=>{
          if(player.hand){ //if the player has a hand...
            player.hand.forEach(dieValue=>{
              if(dieValue===1 || dieValue===4){numberOfCalledValue++}
            })
          }
        })
      break;
      case "Five": 
        players.forEach(player=>{
          if(player.hand){ //if the player has a hand...
            player.hand.forEach(dieValue=>{
              if(dieValue===1 || dieValue===5){numberOfCalledValue++}
            })
          }
        })
      break;
      case "Six": 
        players.forEach(player=>{
          if(player.hand){ //if the player has a hand...
            player.hand.forEach(dieValue=>{
              if(dieValue===1 || dieValue===6){numberOfCalledValue++}
            })
          }
        })
      break;
    }
    roundResults.numberOfCalledValue=numberOfCalledValue
    let loserEliminated = false
    let eliminatedPlayers = []
    if (numberOfCalledValue >= currentCall[0]){ //NOT LYING; "name" loses the round.
      // console.log(`There were ${numberOfCalledValue} ${currentCall[1]}; currentPlayer (${name}) loses the round!`)
      roundResults.roundWinner=previousPlayer
      roundResults.roundLoser=name
      //Update users array: tick up roundsWon, roundsLost.
        users.forEach(user=>{
          if (user.room===room){
            if(user.roundsLost===5){eliminatedPlayers.push(user.name)}
            if(user.name===previousPlayer){user.roundsWon++}
            if(user.name===name){
              user.roundsLost++
              if(user.roundsLost === 5){
                eliminatedPlayers.push(user.name)
                loserEliminated = true
                roundResults.losereliminated=true
              }
            }
          }
        })
      //Update turnIndex: depending on if roundLoser was eliminated.
      if(loserEliminated){ //current player lost round and was eliminated.
        roundResults.turnIndex=turnIndex+1
        //CHECK IF THE GAME ENDED.
        if(eliminatedPlayers.length === players.length-1){
          roundResults.gameEnded = true
        }
      } else { //current player lost round but stays in; starts next round.
        roundResults.turnIndex=turnIndex
      }
    } else if (numberOfCalledValue < currentCall[0]){ //NOT ENOUGH DIE; "previousPlayer" loses the round.
      // console.log(`There were ${numberOfCalledValue} ${currentCall[1]}; previousPlayer (${previousPlayer}) loses the round!`)
      roundResults.roundWinner=name
      roundResults.roundLoser=previousPlayer
      //Update users array: tick up roundsWon, roundsLost.
        users.forEach(user=>{
          if (user.room===room){
            if(user.roundsLost===5){eliminatedPlayers.push(user.name)}
            if(user.name===name){user.roundsWon++}
            if(user.name===previousPlayer){
              user.roundsLost++
              if(user.roundsLost === 5){
                eliminatedPlayers.push(user.name)
                loserEliminated = true
                roundResults.loserEliminated=true
              }
            }
          }
        })
      //Update turnIndex: depending on if roundLoser was eliminated.
      if(loserEliminated){ //previousPlayer lost round and was eliminated; currentPlayer goes next in next round.
        roundResults.turnIndex=turnIndex
        //CHECK IF THE GAME ENDED.
        if(eliminatedPlayers.length === players.length-1){
          roundResults.gameEnded = true
        }
      } else { //previousPlayer lost round but stays in; starts next round.
        roundResults.turnIndex=turnIndex-1
      }
    }
    return(roundResults)
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

module.exports = {addUser, removeUser, chooseNewMaster, getUser, getUsersInRoom, startGameForRoom, passTurn, endRound, startNewRound}