import React from 'react'
import onlineIcon from '../../icons/onlineIcon.png'
import './TextContainer.css'

const TextContainer = ({users, name, startGame}) => {
  let masterName
  if(users){
    users.forEach(user=>user.isMaster ? masterName=user.name:null)
  }

  return(
    <div className="textContainer">
      <div>
        <h1>Real-Time Liars' Dice Game <span role="img" aria-label="emoji">💬</span></h1>
        <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
        {/* <button onClick={seeMaster}>TEST: SEE ROOM MASTER</button> */}
        {name==masterName? <>
          <h3>You are the room master. Hit start once everyone has joined!</h3>
          <button onClick={startGame}>START GAME</button>
        </> : null}
      </div>
      {
        users
          ? (
            <div>
              <h1>Users in this room:</h1>
              <div className="activeContainer">
                <h2>
                  {users.map((user) => (
                    <div key={user.name} className="activeItem">
                      {/* for now we'll show everyone's hands, all the time. */}
                      {user.name + " "+ user.hand}
                      {user.isMaster ? " (room master)":null}
                      <img alt="Online Icon" src={onlineIcon}/>
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : null
      }
    </div>
  )
};

export default TextContainer;