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
          <a href="#!" className="brand-logo center">Liar's Dice</a>
           <ul className="right hide-on-med-and-down">
            <li><a className="dropdown-trigger" href="#!" data-target="dropdown1">Join<i className="material-icons right">arrow_drop_down</i></a></li>
            <li><a href="sass.html">How To Play</a></li>
            <li><a href="badges.html">About</a></li>
            {/* <!-- Dropdown Trigger --> */}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default NavBar