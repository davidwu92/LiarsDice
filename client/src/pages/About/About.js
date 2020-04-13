import React from 'react'
import Navbar  from '../../components/NavBar'
import './About.css'

const About = () => {
  return(
    <>
      <Navbar/>
      <div id="aboutPage" className="row white-text">
        <h3 className="center" style={{marginTop: "0", paddingTop:"2vw"}}>About Us</h3>
        <div className="col s10 m10 l10 offset-s1 offset-m1 offset-l1 center">
          <h5>This application was created by David Wu and Paul Jung using React and Socket.io.</h5>
          <h5>This app was our first project using socket.io to create a live chat game application. We had a lot of fun building this game, and hope you have fun playing this game with your friends!</h5>
          <h6>You can see more of our coding/web development projects or contact us through the links provided below.</h6>
        </div>
        <div className="row"> </div>
        <div className="col s5 m5 l5 offset-s1 offset-m1 offset-l1 center">
          <h5>David Wu</h5>
          <h6>Full Stack Web Developer</h6>
          <h6>Github: <a href="https://github.com/davidwu92">https://github.com/davidwu92</a></h6>
          <h6>Portfolio: <a href="https://davidwu.herokuapp.com">https://davidwu.herokuapp.com</a></h6>
          <h6>LinkedIn: <a href="https://www.linkedin.com/in/davidwu92/">https://www.linkedin.com/in/davidwu92/</a></h6>
        </div>
        <div className="col s5 m5 l5 center">
          <h5>Paul Jung</h5>
          <h6>Full Stack Web Developer</h6>
          <h6>Github: <a href="https://github.com/thejunglife">https://github.com/thejunglife</a></h6>
          {/* <h6>Portfolio: <a href="https://pauljung.herokuapp.com">https://pauljung.herokuapp.com</a></h6> */}
          <h6>LinkedIn: <a href="https://www.linkedin.com/in/paulsjung/">https://www.linkedin.com/in/paulsjung/</a></h6>
        </div>
      </div>
    </>
  )
}

export default About