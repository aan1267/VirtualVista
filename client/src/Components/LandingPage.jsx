import React,{useState}from 'react'
import {Link, useNavigate} from "react-router-dom" 
import  "../style/landingpage.css"
import MenuIcon from "@mui/icons-material/Menu"
function LandingPage() {
   const [isopen,setIsOpen]=useState(false)
   const navigate=useNavigate()

   const toggleMenu=()=>{
      setIsOpen(!isopen)
   }
  return (
     <div className="landingPageContainer">
        <nav>
           <div className="navHeader">
             <h2>VirtualVista</h2>
           </div>
           <div className={`navList ${ isopen ? "active" : ""}`} onClick={toggleMenu}>
               <p onClick={()=>{
                window.location.href="/auth"}}>Join As Guest</p>
               <p onClick={()=>navigate("/auth")}>Register</p>
               <button onClick={()=>navigate("/auth")}>Login</button>
           </div>

          <div className="hamburger" onClick={toggleMenu}>
            <MenuIcon />
           </div>
        </nav>
        <div className="landingMainContainer">
           <div class="left-side"> 
            <h1><span style={{color:"#ff9839"}}>Connect</span> with your loved ones</h1>
            <p>Cover a distance by VirtualVista</p>
            <div class="btn-start"><Link to="/lobby">Get Started</Link></div>
           </div>
            <div class="right-side">   
                <img src="./mobile.png" alt="" />
            </div>
        </div>
     </div>
  )
}

export default LandingPage