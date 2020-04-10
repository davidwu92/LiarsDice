import React from 'react'

import ScrollToBottom from 'react-scroll-to-bottom'
import Message from '../Message'
import './Messages.css'

const Messages = ({messages, name}) => {

  return(
    <ScrollToBottom className="messages">
      {messages.map((message, i)=>
        <div key={i}>
          {/* Every message will have a KEY and a MESSAGE; the Message is created with the Message component. */}
          <Message message={message} name={name}/>
        </div>)
      }
    </ScrollToBottom>
  )
}

export default Messages