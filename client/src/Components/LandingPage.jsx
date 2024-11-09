import React from 'react'
import {Link, useNavigate} from "react-router-dom" 
import  "../App.css"

function LandingPage() {
   const navigate=useNavigate()
  return (
     <div className="landingPageContainer">
        <nav>
           <div className="navHeader">
             <h1>VirtualVista</h1>
           </div>
           <div className="navList">
              <p onClick={()=>{
               window.location.href="/auth"
               }}>Join As Guest</p>
              <p onClick={()=>navigate("/auth")}>Register</p>
              <button onClick={()=>navigate("/auth")}>Login</button>
           </div>
        </nav>
        <div className="landingMainContainer">
           <div> 
            <h1><span style={{color:"#ff9839"}}>Connect</span> with your loved ones</h1>
            <p>Cover a distance by VirtualVista</p>
            <div role="button"> <Link to="/lobby">Get Started</Link></div>
           </div>
            <div>   
                <img src="./mobile.png" alt=""  />
            </div>
        </div>
     </div>
  )
}

export default LandingPage