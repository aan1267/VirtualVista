import React, { createContext,useContext,useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import {io} from "socket.io-client"

 const serverurl=import.meta.env.Server_Url
 const SocketContext=createContext(null)
 
 export const useSocket=()=>{
    const socket=useContext(SocketContext)
    return socket
  }

const SocketProvider=() =>{
  //connection create
  const socket=useMemo(()=>io(`${serverurl}`),[])

  
    return(
    <SocketContext.Provider value={socket}>
        <Outlet/>
    </SocketContext.Provider>
    )
}

export default SocketProvider