import React, {useState, useEffect} from 'react'
import onlineIcon from '../../icons/onlineIcon.png'
import './TextContainer.css'

const TextContainer = ({showHands, setShowHands, socket, turnIndex, roundNum, users, room, name, startGame, currentCall}) => {
  let masterName
  if(users){users.forEach(user=>user.isMaster ? masterName=user.name:null)}
  let userToPlay
  if (users) {users.forEach(user=>user.isMyTurn ? userToPlay=user.name:null)}
  

  //showMine is true when mouseOver my own hand.
  const [showMine, setShowMine]=useState(false)
  //useEffect: setting a listener for revealHands.

  //SHOWN HAND dice array.
  const myHandArray = (hand) =>{
    let iconArray = []
    if (hand.length){
      hand.forEach(number=>{
        switch(number) {
          case 1: iconArray.push(<><i class="fas fa-dice-one medium white-text"></i><span>  </span></>);break;
          case 2: iconArray.push(<><i class="fas fa-dice-two medium white-text"></i><span>  </span></>); break;
          case 3: iconArray.push(<><i class="fas fa-dice-three medium white-text"></i><span>  </span></>); break;
          case 4: iconArray.push(<><i class="fas fa-dice-four medium white-text"></i><span>  </span></>); break;
          case 5: iconArray.push(<><i class="fas fa-dice-five medium white-text"></i><span>  </span></>); break;
          case 6: iconArray.push(<><i class="fas fa-dice-six medium white-text"></i><span>  </span></>); break;
        }
      })
    }
    return(iconArray)
  }

  //HIDDEN HAND dice array.
  const hiddenHandArray = (hand)=>{
    let hiddenArray = []
    if (hand.length){
      hand.forEach(number=>{
        hiddenArray.push(<><i class="fas fa-dice-d6 medium grey-text"></i><span>  </span></>)
      })
    }
    return(hiddenArray)
  }

  //mouseEnter my own hand.
  const showMyHand = (event) => {
    event.preventDefault()
    if(!showHands){
      setShowMine(true)
      socket.emit('peekHand',{name, room},()=>{
        console.log("You looked at your hand.")
      })
    }
  }
  //mouseLeave my own hand.
  const hideMyHand = (event) => {
    event.preventDefault()
    setShowMine(false)
  }

  //startNewRound button (available to Master after callLiar() triggers, ending a round.)
  const startNewRound = (event)=>{
    event.preventDefault()
    socket.emit('startRound',{room, turnIndex, roundNum},()=>{
      console.log("starting a new round.")
    })
  }

  return(
    // <div className="textContainer">
    <div className="container grey darken-4 white-text">
      <div className="row" style={{margin:0}}>
        <h3 className="center">Liars' Dice <span role="img" aria-label="emoji">💬</span></h3>
        {/* <h5>Hi {name}! You are in the room: {room}</h5> */}

        {/* TURN INFO if game's running; GREETING if game hasn't started. */}
        {
          roundNum!==0 ? 
          <> {/* Game is running. */}
            <h5 className="green-text center">
              {userToPlay ? 
              <>
                It's <b>{userToPlay}'s</b> turn to make a call.{userToPlay===name?" That's you!":""}
              </>: null}
            </h5>
            <h5 className="purple-text text-lighten-1 center">{currentCall.length ? `The current call is ${currentCall[0]} ${currentCall[1]}.`:<><b>{userToPlay}</b> is making the first call.</>}</h5>
          </>
          :<>{/* Game hasn't started. */} 
              {
                name==masterName? <>
                  <h5 className="purple-text text-lighten-1 center">You've become the room master.</h5>
                  <h6 className="purple-text text-lighten-1 center">Hit start once everybody has joined!</h6>
                </> : <><h6 className="purple-text text-lighten-1 center">Please wait until the room master starts the game...</h6></>
              }
          </>
        }
      
      {/* START/NEW GAME button for master. */}     
      
        {
          users ? 
              <div className="indigo darken-4">
                <h5 className="center">Users in Room</h5>
                {roundNum===0? null:<p className="center">Hover cursor over your hand to peek at it.</p>}
                    {users.map((user) => (
                        <div className="row" style={{width:"100%"}}>
                          <div key={user.name} className="col s5 m5 l5">
                            <h6 className={user.isMyTurn ? "green-text":null}>
                              <b>{user.name}</b>{(user.isMaster)?<span> (room master)</span>:null}
                            </h6>
                          </div>
                          <div className="col s7 m7 l7">
                            {user.name===name ?
                                <div onMouseEnter={showMyHand} onMouseLeave={hideMyHand}>
                                  {showMine||showHands ? myHandArray(user.hand):hiddenHandArray(user.hand)}
                                </div>
                                :<div>
                                  {showHands ? myHandArray(user.hand):hiddenHandArray(user.hand)}
                                </div>
                            }
                          </div>
                        </div>
                    ))}
              </div>
            : null
        }
      </div>
      {/* <div><button onClick={()=>setShowHands(bool=>!bool)} className="btn red">TEST BUTTON: toggle showHands</button></div> */}
      <div className="row center" style={{width:"100%"}}>
        {name==masterName ?
          <>
            {showHands ? <div className="col s6 m6 l6"><button onClick={startNewRound} className="btn purple">Start New Round</button></div>
              :<div className="col s6 m6 l6"><button onClick={startNewRound} className="btn disabled">Start New Round</button></div>}
            <div className="col s6 m6 l6"><button className={"btn waves-effect purple"} onClick={startGame}>{roundNum===0?"START GAME":"NEW GAME"}</button></div>
          </>
        :null}
      </div>
    </div>
  )
};

export default TextContainer;