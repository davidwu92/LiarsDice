import React, {useState} from 'react'
import onlineIcon from '../../icons/onlineIcon.png'
import './TextContainer.css'

const TextContainer = ({socket, users, room, name, startGame, currentCall, roundNum}) => {
  let masterName
  if(users){
    users.forEach(user=>user.isMaster ? masterName=user.name:null)
  }
  let userToPlay
  if (users) {
    users.forEach(user=>user.isMyTurn ? userToPlay=user.name:null)
  }
  const [showHands, setShowHands]=useState(false)
  const [showMine, setShowMine]=useState(false)

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

  const hiddenHandArray = (hand)=>{
    let hiddenArray = []
    if (hand.length){
      hand.forEach(number=>{
        hiddenArray.push(<><i class="fas fa-dice-d6 medium grey-text"></i><span>  </span></>)
      })
    }
    return(hiddenArray)
  }
  const showMyHand = (event) => {
    event.preventDefault()
    setShowMine(true)
    socket.emit('peekHand',{name, room},()=>{
      console.log("You looked at your hand.")
    })
  }
  const hideMyHand = (event) => {
    event.preventDefault()
    setShowMine(false)
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
                {currentCall ? 
                  <>It's <b>{userToPlay}'s</b> turn to make a call.{userToPlay===name?" That's you!":""}</>
                  :<>It's <b>{userToPlay}'s</b> turn to make the call.{userToPlay===name?" That's you!":""}</>}
              </>: null}
            </h5>
            <h6 className="purple-text text-lighten-1 center">{currentCall ? `The call to beat is ${currentCall[0]} ${currentCall[1]}.`:``}</h6>
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
      {name==masterName ?
      <div className="center"><button className={"btn waves-effect purple"} onClick={startGame}>{roundNum===0?"START":"NEW GAME"}</button></div>
      :null}
      
        {
          users
            ? 
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
      <div><button onClick={()=>setShowHands(bool=>!bool)} className="btn red">TEST BUTTON: toggle showHands</button></div>
    </div>
  )
};

export default TextContainer;