import React from 'react'
import './Input.css'

const Input = ({messageText, setMessageText, sendMessage}) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={messageText}
      onChange={(event)=> setMessageText(event.target.value)}
      onKeyPress={event=> event.key==='Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={(event)=>sendMessage(event)}>Send</button>
  </form>
)
export default Input