import React, { createContext,useContext, useState } from 'react'

const UserContext = createContext()
export const useUserContext=()=>{
    return useContext(UserContext)
  }

export const UserProvider = ({children}) => {
    const [username, setUsername] = useState("")
    const [room, setRoom] = useState("")
    
    return (
        <UserContext.Provider value={{ username, setUsername,room,setRoom}}>
           {children}
        </UserContext.Provider>
    )
}