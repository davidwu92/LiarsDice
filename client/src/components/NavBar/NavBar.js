import React from 'react'

const NavBar = () => {

  return (
    <>
      <ul id="dropdown1" className="dropdown-content">
        <li><a href="#!">one</a></li>
        <li><a href="#!">two</a></li>
        <li className="divider"></li>
        <li><a href="#!">three</a></li>
      </ul>
      <nav>
        <div className="nav-wrapper blue accent-3">
          <a href="#!" className="brand-logo center">Liars' Dice</a>
           <ul className="right hide-on-med-and-down">
            <li><a href="/">Join a Room</a></li>
            <li><a href="/rules" target="_blank">How to Play</a></li>
            <li><a href="/about" target="_blank">About</a></li>
            {/* <!-- Dropdown Trigger --> */}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default NavBar