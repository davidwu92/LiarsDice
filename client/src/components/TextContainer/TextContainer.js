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
        <h3>Real-Time Liars' Dice Game <span role="img" aria-label="emoji">💬</span></h3>
        <h5>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h5>
        {/* <button onClick={seeMaster}>TEST: SEE ROOM MASTER</button> */}
        {name==masterName? <>
          <h5>You are the room master. Hit start once everyone has joined!</h5>
          <button onClick={startGame}>START GAME</button>
        </> : null}
      </div>
      {
        users
          ? (
            <div>
              <h5>Users in this room:</h5>
              <div className="activeContainer">
                <h6>
                  {users.map((user) => (
                    <div key={user.name} className="activeItem">
                      {/* for now we'll show everyone's hands, all the time. */}
                      {user.name+" "}
                      {user.hand}
                      {user.isMaster ? " (room master)":null}
                      <img alt="Online Icon" src={onlineIcon}/>
                    </div>
                  ))}
                </h6>
              </div>
            </div>
          )
          : null
      }
    </div>
  )
};

export default TextContainer;