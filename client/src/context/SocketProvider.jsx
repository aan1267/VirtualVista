import React, { createContext,useContext,useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import {io} from "socket.io-client"

const isProduction = process.env.NODE_ENV === 'production';
 const serverurl= isProduction ? import.meta.env.VITE_SERVER_URL_PRO: "http://localhost:3000"
 const SocketContext=createContext(null)
 
 export const useSocket=()=>{
    const socket=useContext(SocketContext)
    return socket
  }

const SocketProvider=() =>{
  //connection create
  const socket=useMemo(()=>io(serverurl),{
    transports: ["websocket"], 
    pingInterval: 50000,      
    pingTimeout: 40000,       
    reconnectionAttempts: 10,   
    maxPayload: 1000000,      
  },[serverurl])

  
    return(
    <SocketContext.Provider value={socket}>
        <Outlet/>
    </SocketContext.Provider>
    )
}

export default SocketProvider