import React, { createContext,useContext,useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import {io} from "socket.io-client"

 const SocketContext=createContext(null)

 export const useSocket=()=>{
    const socket=useContext(SocketContext)
    return socket
  }

const SocketProvider=() =>{
  const socket=useMemo(()=>io("http://localhost:8080"),[])

  
    return(
    <SocketContext.Provider value={socket}>
        <Outlet/>
    </SocketContext.Provider>
    )
}

export default SocketProvider