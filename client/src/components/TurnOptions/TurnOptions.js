import React, {useState, useEffect} from 'react'

const TurnOptions = ({currentCall, setMyQuantity, setMyValue, makeCall}) => {
  


  return(
    <>
      <div className="green lighten-1">
        <div class="input-field">
          <select className="browser-default green lighten-1 white-text" 
                  style={{width: "35%", display:"inline"}}
                  onChange={(event)=> setMyQuantity(event.target.value)}>
            <option value={0} disabled selected>Call a Quantity</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
          </select>
          <span> </span>
          <select className="browser-default green lighten-1 white-text"
                  style={{width: "35%", display:"inline"}}
                  onChange={(event)=> setMyValue(event.target.value)}>
            <option value="" disabled selected>Dice Value</option>
            <option value={"Twos"}>Twos</option>
            <option value={"Threes"}>Threes</option>
            <option value={"Fours"}>Fours</option>
            <option value={"Fives"}>Fives</option>
            <option value={"Sixes"}>Sixes</option>
          </select>
          <button className="btn green darken-1 right" onClick={makeCall}>Make Call!</button>
        </div>
      </div>
      <button className="btn red darken-1">Call Liar!</button>
    </>
  )
}
export default TurnOptions