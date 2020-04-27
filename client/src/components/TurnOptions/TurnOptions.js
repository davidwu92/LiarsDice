import React, {useState, useEffect} from 'react'
import './TurnOptions.css'

const TurnOptions = ({showHands, setShowHands, roundNum, users, name, currentCall, myQuantity, setMyQuantity, myValue, setMyValue, makeCall, callLiar}) => {
  const [quantities, setQuantities] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
  const [values, setValues] = useState(["Two", "Three", "Four", "Five", "Six"])
  
  useEffect(()=>{
    //triggers when roundNum changes; updates callable quantities (limited by # of die in all hands.)
    console.log("TurnOptions useEffect: roundNum changed.")
    let totalDie = 0
    if(users){
      users.forEach(user=>{
        if(user.hand){totalDie+=user.hand.length}
      })
    }
    let possibleQuantities = []
    let i = 1
    while (i<=totalDie){
      possibleQuantities.push(i)
      i++
    }
    setQuantities(possibleQuantities)
  }, [roundNum])

  let userToPlay
  if (users) {users.forEach(user=>user.isMyTurn ? userToPlay=user.name:null)}

  const turnAnnouncer = () => {
    return(
    showHands ? <div className="row center red-text text-darken-1" style={{marginBottom:"0"}}>{userToPlay} called liar! Wait for the room master to start Round {roundNum + 1}</div>
    :userToPlay===name ? 
          <div className="row center yellow-text text-darken-1" style={{marginBottom:"0"}}>
            {/* MY TURN. */}
            <b>It is your turn!</b>
              {currentCall.length ? 
                ` The call to beat is ${currentCall[0]} ${currentCall[0]===1 ? currentCall[1] : currentCall[1]==="Six"? currentCall[1]+"es":currentCall[1]+"s"}.`
                :` You're making the first call of Round ${roundNum}.`}
          </div>
          :<div className="row center grey-text text-darken-1" style={{marginBottom:"0"}}>
            {/* NOT MY TURN */}
            {currentCall.length ? `Now waiting on ${userToPlay} to make a call.` 
              :roundNum ? `${userToPlay} will make the first call of Round ${roundNum}.` 
                : `You must wait for the Room Master to start a game with you.`}
            </div>
    )
  }

  return(
    <>
      <div className={userToPlay===name ? "row green lighten-1" : " row green lighten-2"} style={{padding:"0", margin:"0"}}>
        {/* <div className="row" style={{padding:"0", margin:"0"}}> */}
        {turnAnnouncer()}
          <div className="input-field col s5 m4 l4" id="callColumn">
            <select className={userToPlay===name ? "browser-default green lighten-1 white-text":"browser-default green lighten-2 white-text"} 
                    style={{width: "100%", display:"inline"}}
                    onChange={(event)=> {setMyQuantity(JSON.parse(event.target.value))}}>
              <option value={0} disabled selected>Call Quantity</option>
              {currentCall.length ? quantities.map(quantity=>(
                  quantity < currentCall[0] ? <option value={quantity} disabled>{quantity}</option> 
                  : <option value={quantity}>{quantity}</option> 
                  ))
                :
                quantities.map(quantity=>(<option value={quantity}>{quantity}</option>))
              }
            </select>
          </div>
          <div className="input-field col s4 m4 l4" id="callColumn">
            <select className={userToPlay===name ? "browser-default green lighten-1 white-text":"browser-default green lighten-2 white-text"}
                    style={{width: "100%", display:"inline"}}
                    onChange={(event)=> setMyValue(event.target.value)}>
              <option value="" disabled selected>Dice Value</option>
              {currentCall.length ?
                values.map((diceValue, index)=>(
                  (index < values.indexOf(currentCall[1]) || index > values.indexOf(currentCall[1])+2) ? <option value={diceValue} disabled>{diceValue}</option>
                    :<option value={diceValue}>{diceValue}</option>))
                :
                values.map((diceValue, index)=>(
                  (index>2) ? <option value={diceValue} disabled>{diceValue}</option> 
                    :<option value={diceValue}>{diceValue}</option>))
              }
            </select>
          </div>
          <div className="input-field col s3 m4 l4 center" id="callColumn">
            <button id="callColumnBtn" className={userToPlay===name && !showHands ? "btn green darken-1" : "btn green lighten-1"} onClick={showHands ? null : makeCall}>{window.innerWidth<600 ? "Call!":"Make Call!"}</button>
          </div>
        {/* </div> */}
      </div>
      <button className={userToPlay===name && !showHands ? "btn red darken-1":"btn red lighten-3"} onClick={showHands ? null:callLiar}>Call Liar!</button>
    </>
  )
}
export default TurnOptions