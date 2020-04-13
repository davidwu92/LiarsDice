import React from 'react'
import Navbar  from '../../components/NavBar'
import './Rules.css'

const Rules = () => {
  return(
    <>
      <Navbar/>
      <div id="rulesPage" className="row white-text">
        <div className="row">
          <h3 className="center" style={{marginTop: "0", paddingTop:"2vw"}}>How to Play Liars' Dice</h3>
          <div className="col s12 m10 l10 offset-m1 offset-l1">
            <h5>Rule #1: Each player starts the game with five dice in their hand. Losing a round results in losing one dice.</h5>
            <h6 className="center grey-text text-lighten-1">You are eliminated from the game if you run out of dice!</h6>
            <h3> </h3>
            <h5>Rule #2: During your turn, you must choose one of two <span className="purple-text">Game Actions</span>: either you <span className="green-text">Make Call</span> with a quantity and dice value, or you can <span className="red-text">"Call Liar!"</span> on the previous player.</h5>
            <h6 className="center grey-text text-lighten-1">Players will take turns making calls until someone calls <span className="red-text text-lighten-1">"Liar!"</span>, ending the round.</h6>
            <h3> </h3>
            <h5>Rule #3:  The dice value "One" is <i>wild</i> (it counts as <u>every</u> other dice value, Two through Six). When you <span className="green-text">Make Call</span>, you are stating a <u>minimum quantity</u> of a dice value that exists in the <b>entire room.</b></h5>
            <h6 className="center grey-text text-lighten-1">Example: If you <span className="green-text text-lighten-1">Make Call: "4 Five's"</span>, this translates to the statement <span className="green-text text-lighten-1">"There are <i>at least</i> 4 dice in this room with the value of One or Five."</span></h6>
            <h3> </h3>
            <h5>Rule #4: When <span className="red-text">"Liar"</span> is called, the round ends and all players' dice are revealed. The loser of the round gets to make the first call of the next round (if they weren't eliminated).</h5>
            <h6 className="center grey-text text-lighten-1">If the last call was true (there actually WERE at least 4 One's and Five's in all players' hands), the player who called <span className="red-text text-lighten-1">"Liar!"</span> loses the round.</h6>
            <h6 className="center grey-text text-lighten-1">If the last call was false (there are less than 4 One's and Five's in all players' hands), the person who called 4 Fives loses the round.</h6>
          </div>
        </div>
        <div className="row">
        {/* empty space */}
        </div>
        <div className="col s12 m5 l5 offset-m1 offset-l1 purple darken-4">
          <h5 className="center">How the Game Room Works</h5>
          <h4> </h4>
          <h6>1. Only the Room Master <i class="fas fa-chess-king"></i> can start a <span className="amber-text text-darken-4">new game</span> or begin the <span className="amber-text text-darken-4">next round.</span></h6>
          <h6 className="center grey-text text-lighten-1"><span className="amber-text text-darken-4">"Start Round"</span> can only be clicked after someone calls <span className="red-text">"Liar"</span>.</h6>
          <h4> </h4>
          <h6>2. Peek at your own hand by hovering your cursor over it (for mobile devices, touch your dice). Doing so alerts the other players that you looked at your hand!</h6>
          <h6 className="center grey-text text-lighten-1">The number of dice in each player's hand is visible to all players.</h6>
          <h4> </h4>
          <h6>3. Late joiners to your room can't join ongoing games and won't be dealt a hand at the start of a new round. Each user must be present in the room when the master clicks "Start" or "New Game" to be part of the game.</h6>
          <h4> </h4>
        </div>
        <div className="col s12 m5 l5 light-blue darken-3">
          <h5 className="center">How the Chatbox works</h5>
          <h4> </h4>
          <h6>1. You can chat with others in the room at any time with the messaging feature, but <span className="purple-text text-darken-3"><i>Game Actions</i></span> (<span className="green-text">Make Call</span> or <span className="red-text">Call Liar!</span>) are made by clicking the green or red button <i>during your turn.</i></h6>
          <h6 className="center grey-text text-lighten-1"><span className="purple-text text-darken-3"><i>Game Actions</i></span> show up in the chatbox with purple, italicized text.</h6>
          <h4> </h4>
          <h6>2. When you attempt to <span className="green-text">Make Call</span>, your call must have a higher <i>quantity</i> and/or higher <i>value</i> than the current call.</h6>
          <h6 className="center grey-text text-lighten-1">In each call, neither quantity nor value can decrease.</h6>
          <h4> </h4>
          <h6>3. Hitting the <span className="red-text">"Call Liar!"</span> button during your turn ends the round and calls "Liar!" on the <i>previous player</i>.</h6>
        </div>
      </div>
    </>
  )
}

export default Rules