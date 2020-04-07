import React from 'react'
import onlineIcon from '../../icons/onlineIcon.png'
import './TextContainer.css'

const TextContainer = ({users, name, startGame}) => {
  let masterName
  if(users){
    users.forEach(user=>user.isMaster ? masterName=user.name:null)
  }
  let userToPlay
  if (users) {
    users.forEach(user=>user.isMyTurn ? userToPlay=user.name:null)
  }
  return(
    <div className="textContainer">
      <div className="center">
        <h3>Real-Time Liars' Dice Game <span role="img" aria-label="emoji">💬</span></h3>
        {/* <h5>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h5> */}
        {/* START GAME BUTTON/GREETING */}
        {name==masterName? <>
          <h5>Hi {name}! You've become the room master.</h5>
          <h6>Hit start once everybody has joined!</h6>
          <button className={"btn waves-effect purple"} onClick={startGame}>START</button>
        </> : <><h5>Hi {name}!</h5><h6>Please wait until the room master starts the game...</h6></>}
      </div>
      {
        users
          ? (
            <div>
              <h4>Users in Room</h4>
              <div className="activeContainer">
                <h5>
                  {users.map((user) => (
                    <div key={user.name} className="activeItem">
                      {user.hand}
                      <span className={user.isMyTurn ? "green-text":null}>
                        {user.isMaster ? <><b>{user.name}</b><span> (room master)</span></>:<b>{user.name}</b>}
                      </span>
                      {/* for now we'll show everyone's hands, all the time. */}
                      <img alt="Online Icon" src={onlineIcon}/>
                    </div>
                  ))}
                </h5>
              </div>
            </div>
          )
          : null
      }
      <div>
        <h4 className="green-text">{userToPlay ? "Currently " + userToPlay + "'s turn." : null}</h4>
      </div>
    </div>
  )
};

export default TextContainer;