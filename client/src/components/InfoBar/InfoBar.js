import React from 'react'
import './InfoBar.css'
import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'

// This is the TOP of Chat.js: shows the online icon and room name.
const InfoBar = ({room}) =>(
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online"/>
      {/* room name here */}
      <h6>{room}</h6> {/* Chat.js passed the room state as Room into this component. */}
    </div>
    <div className="white-text">
      <h5>Game Not Started</h5>
    </div>
    <div className="rightInnerContainer">
      {/* Close Icon. Clicking it will take us back to homepage. */}

      <a href="/"><img src={closeIcon} alt="close"/></a> 
    </div>
  </div>
) //since we're ONLY returning this JSX and no functions, we don't need { return("someJSXhere")}

export default InfoBar