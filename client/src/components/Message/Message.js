import React from 'react'
import ReactEmoji from 'react-emoji'
import './Message.css'

const Message = ({message:{user, text, isGameAction, makingCall, callingLiar}, name}) => {
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
        <div className="messageBox blue accent-2"
            style={makingCall? {borderWidth:"2px", borderStyle:"solid", borderColor:"green"}
                  :callingLiar ? {borderWidth:"2px", borderStyle:"solid", borderColor:"red"}
                    :null}>
          {isGameAction ? 
            makingCall ? <p className="messageText green-text text-darken-4"><i>{text}</i></p>
              : callingLiar ? <p className="messageText red-text text-darken-4"><i>{text}</i></p>
                :<p className="messageText purple-text text-darken-2"><i>{text}</i></p>
            : <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>}
        </div>
      </div>
    )
    :( //SENT BY SOMEONE ELSE
      <div className="messageContainer justifyStart">
        <div className={user!=="admin" ? "messageBox backgroundLight" : "messageBox orange lighten-4"}
            style={makingCall? {borderWidth:"2px", borderStyle:"solid", borderColor:"green"}
            :callingLiar ? {borderWidth:"2px", borderStyle:"solid", borderColor:"crimson"}
              :null}>
          {isGameAction ? 
            makingCall ? <p className="messageText green-text text-darken-2"><i>{text}</i></p>
            : callingLiar ? <p className="messageText red-text"><i>{text}</i></p>
              :<p className="messageText purple-text text-darken-2"><i>{text}</i></p>
            : <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>}
        </div>
        <p className="sentText pl-10">{user}</p>
      </div>
    )
  )
}
export default Message