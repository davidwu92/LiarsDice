import React from 'react'
import ReactEmoji from 'react-emoji'
import './Message.css'

const Message = ({message:{user, text, isGameAction}, name}) => {
  let isSentByCurrentUser = false

  const trimmedName = name.trim().toLowerCase()
  if (user===trimmedName) {
    isSentByCurrentUser = true
  }
  return(
    isSentByCurrentUser 
    ? ( //SENT BY MYSELF
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{trimmedName}</p>
        <div className="messageBox backgroundBlue">
          {isGameAction ? 
            <p className="messageText purple-text"><b>{ReactEmoji.emojify(text)}</b></p>
            : <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>}
        </div>
      </div>
    )
    :( //SENT BY SOMEONE ELSE
      <div className="messageContainer justifyStart">
        <div className={trimmedName==="admin" ? "messageBox backgroundLight" : "messageBox orange lighten-3"}>
          {isGameAction ? 
            <p className="messageText purple-text"><b>{ReactEmoji.emojify(text)}</b></p>
            : <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>}
        </div>
        <p className="sentText pl-10">{user}</p>
      </div>
    )
  )
}
export default Message