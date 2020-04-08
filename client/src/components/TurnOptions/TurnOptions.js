import React, {useState, useEffect} from 'react'

const TurnOptions = ({currentCall, myQuantity, setMyQuantity, myValue, setMyValue, makeCall, callLiar}) => {
  const [quantities, setQuantities] = useState([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
  const [values, setValues] = useState(["Twos", "Threes", "Fours", "Fives", "Sixes"])

  return(
    <>
      <div className="green lighten-1">
        <div class="input-field">
          <select className="browser-default green lighten-1 white-text" 
                  style={{width: "35%", display:"inline"}}
                  onChange={(event)=> setMyQuantity(event.target.value)}>
            <option value={0} disabled selected>Call a Quantity</option>
            {currentCall ? quantities.map(quantity=>(
                quantity < currentCall[0] ? <option value={quantity} disabled>{quantity}</option> 
                : <option value={quantity}>{quantity}</option> 
                ))
              :
              quantities.map(quantity=>(<option value={quantity}>{quantity}</option>))
            }
          </select>
          <span> </span>
          <select className="browser-default green lighten-1 white-text"
                  style={{width: "35%", display:"inline"}}
                  onChange={(event)=> setMyValue(event.target.value)}>
            <option value="" disabled selected>Dice Value</option>
            {currentCall ?
              values.map((diceValue, index)=>(
                (index < values.indexOf(currentCall[1]) || index > values.indexOf(currentCall[1])+2) ? <option value={diceValue} disabled>{diceValue}</option>
                  :<option value={diceValue}>{diceValue}</option>))
              :
              values.map((diceValue, index)=>(
                (index>2) ? <option value={diceValue} disabled>{diceValue}</option> 
                  :<option value={diceValue}>{diceValue}</option>))
            }
            {/* <option value={"Twos"}>Twos</option>
            <option value={"Threes"}>Threes</option>
            <option value={"Fours"}>Fours</option>
            <option value={"Fives"}>Fives</option>
            <option value={"Sixes"}>Sixes</option> */}
          </select>
          <button className="btn green darken-1 right" onClick={makeCall}>Make Call!</button>
        </div>
      </div>
      <button className="btn red darken-1" onClick={callLiar}>Call Liar!</button>
    </>
  )
}
export default TurnOptions