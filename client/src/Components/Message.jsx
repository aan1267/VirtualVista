import React, { useEffect, useState,useCallback } from "react"
import "../style/message.css"
import Button from "@mui/material/Button"
import { useSocket } from "../context/SocketProvider"
import { useUserContext } from '../context/UserProvider'

function Message() {
    const [messages,setMessages]=useState([])
    const [input,setInput]=useState("")
    const socket=useSocket()
    const { username,room } =useUserContext()

    useEffect(()=>{
      const handleMessage = (msg) => {
        console.log("Received message:", msg) 
        setMessages((prevMessages) => [...prevMessages, msg])
    }

        socket.on("chat-message",handleMessage)
        return ()=>{
            socket.off("chat-message",handleMessage)
        }
    },[socket])

  

    const handleSubmitForm = useCallback(
      (e) => {
          e.preventDefault()
          if(input){
             socket.emit("chat-message", { username, message : input ,room})
            setInput("")
          }
      },
      [username,input, socket]
  )

  return (
    <div className="chattingRoom">
      <h1>Chat</h1>
      {/* <p className={messages.length === 0 ? "nochat":""}></p> */}
       <div className="messages">
       {messages.map((msg, index) => (
                    <p key={index}>
                        {msg.username}<br/>{msg.message}
                    </p>
                ))}
       </div>
      <form onSubmit={handleSubmitForm}>
        <div className="chattingbox">
        <input  placeholder="enter your chat" type="text"  onChange={(e) => setInput(e.target.value)} value={input} />
        <Button type="submit" variant="contained">Send</Button>
        </div>
      </form>
    </div>
  )
}

export default Message
