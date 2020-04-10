import React, {useState} from 'react'
// import onlineIcon from '../../icons/onlineIcon.png'
import './TextContainer.css'

const TextContainer = ({showHands, previousPlayer, setShowHands, socket, turnIndex, roundNum, users, room, name, startGame, currentCall}) => {
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
          case 1: iconArray.push(<><i class="fas fa-dice-one fa-3x white-text"></i><span>  </span></>);break;
          case 2: iconArray.push(<><i class="fas fa-dice-two fa-3x white-text"></i><span>  </span></>); break;
          case 3: iconArray.push(<><i class="fas fa-dice-three fa-3x white-text"></i><span>  </span></>); break;
          case 4: iconArray.push(<><i class="fas fa-dice-four fa-3x white-text"></i><span>  </span></>); break;
          case 5: iconArray.push(<><i class="fas fa-dice-five fa-3x white-text"></i><span>  </span></>); break;
          case 6: iconArray.push(<><i class="fas fa-dice-six fa-3x white-text"></i><span>  </span></>); break;
          default: console.log("Something is wrong with your hand.")
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
        hiddenArray.push(<><i class="fas fa-dice-d6 fa-3x grey-text"></i><span>  </span></>)
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
        // console.log("You looked at your hand.")
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

    // link to current room
    const visitorLink = (e) => {
      var copyLink = document.getElementById('inviteLink')
  
      copyLink.select()
      copyLink.setSelectionRange(0, 99999)
      e.target.focus()
      document.execCommand("copy")
    }
      // getting visitor link
    // let link = window.location.href 
    // let startLink = link.split('=')
    // let lastLink = link.split('&')
    // let finalLink = startLink[0]  + "=" + "&" + lastLink[1]

  return(
    <>
      {/* Game Messages. */}
      <div className="row" style={{margin:0}}>
        {/* LINK TO FRIENDS */}
        {/* <div className="center"><p>Share this link to room: <a>http://liars-dice-app.herokuapp.com/chatinvite</a></p></div> */}
        <div className="row" style={{margin:0, padding:"0 1vw"}}>
          {window.innerWidth<600 ?<></>:
          <div className="col m4 l4 center input-field">
            <p>Invite others to this room:</p>  
          </div>}
          <div className="col s11 m7 l7 input-field center">
            <input className="blue-text text-lighten-1" style={{border:"none", textAlign:"center"}} 
                  type="text" value={`liars-dice-app.netlify.com/visitor?room=${room}`} id="inviteLink"/>
          </div>
          <div className="col s1 m1 l1 input-field">
            <button className="btn-floating btn-small pink" onClick={visitorLink}><i className="material-icons">content_copy</i></button>
          </div>
        </div>

        {/* TURN INFO if game's running; GREETING if game hasn't started. */}
        {
          roundNum!==0 ? 
          <> {/* Game is running. */}
            {showHands ? 
              <>{/* End of round: hands are being shown. */}
                <h5 className="red-text center">{userToPlay} called liar on {previousPlayer}!</h5>
                <h6 className="amber-text text-darken-4 center">Revealing all dice values for Round {roundNum}.</h6>
              </>
              :<> {/* Round not over. */}
                <h5 className="green-text text-darken-1 center">
                  {userToPlay ? 
                  <>
                    It's <b>{userToPlay}'s</b> turn to make a call.{userToPlay===name?" That's you!":""}
                  </>: null}
                </h5>
                <h5 className="amber-text text-darken-4 center">
                  {currentCall.length ? `The call to beat is ${currentCall[0]} ${currentCall[1]}${currentCall[0]>1?`'s.`:`.`}`
                  :<>waiting for the first call for Round {roundNum}...</>}
                </h5>
              </>}
          </>
          :<>{/* Game hasn't started. */} 
              {
                name===masterName? <>
                  <h5 className="amber-text text-darken-4 center">You've become the room master <span>  <i class="fas fa-chess-king"></i></span></h5>
                  <h6 className="amber-text text-darken-4 center">Hit start once everybody has joined!</h6>
                </> : <>
                  <h5 className="amber-text text-darken-4 center">Welcome to Liars' Dice</h5>
                  <h6 className="amber-text text-darken-4 center">Please wait until the room master<span>  <i class="fas fa-chess-king"></i></span> starts the game...</h6>
                </>
              }
          </>
        }
        </div>
      

      
      {/* USERS BOX */}
      <div className="row" style={{margin:0}}>
        {users ? 
          <div className="light-blue darken-4" id="usersBox">
            {/* START/NEW GAME button for master. */}
            {name===masterName ?
              <>
                <div className="left" style={{marginLeft:"1%"}}><button className={"btn waves-effect amber darken-4"} onClick={startGame}>{roundNum===0?"START GAME":"NEW GAME"}</button></div>
                {showHands ? <div className="right" style={{marginRight:"1%"}}><button onClick={startNewRound} className="btn amber darken-4">Start Round {roundNum+1}</button></div>
                  :<div className="right" style={{marginRight:"1%"}}><button onClick={startNewRound} className="btn disabled">{roundNum!==0?<>Start Round {roundNum+1}</>:<>Next Round</>}</button></div>}
                  <h5 className="center">Users in {room}</h5>
              </>
            :<h5 className="center">Users in {room}</h5>}
            
            {roundNum===0? null:
              <>
                  <p className="center">Hover cursor or tap on your hand to peek at your hand.</p>
              </>
            }
                {users.map((user, index) => (
                    <div className={index%2?"row blue lighten-1":"row blue lighten-2"} style={{margin:"0", padding:"1% 1%"}}>
                      <div key={user.name} className="col s5 m5 l5">
                        <h6 className={user.isMyTurn ? "green-text text-darken-3":null}>
                          <b>{user.name}</b>{(user.isMaster)?<span>  <i class="fas fa-chess-king"></i></span>:null}
                        </h6>
                      </div>
                      <div className="col s7 m7 l7 center">
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
        : null}
      </div>
      {/* <div><button onClick={()=>setShowHands(bool=>!bool)} className="btn red">TEST BUTTON: toggle showHands</button></div> */}
    </>
  )
};

export default TextContainer;