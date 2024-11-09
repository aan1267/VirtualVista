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

    // const handleMessage=(msg)=>{
    //   console.log("Received message:", msg)
    //     setMessages((prevMessages)=>{
    //       const updatedMessages = [...prevMessages, msg];
    //     console.log("Updated messages:", updatedMessages); // Log updated messages
    //     return updatedMessages;
    //   })
    // }
    useEffect(()=>{
      const handleMessage = (msg) => {
        console.log("Received message:", msg); // Debugging line
        setMessages((prevMessages) => [...prevMessages, msg]);
    };

        socket.on("chat-message",handleMessage)
        return ()=>{
            socket.off("chat-message",handleMessage)
        }
    },[socket])

  

    const handleSubmitForm = useCallback(
      (e) => {
          e.preventDefault();
          if(input){
            socket.emit("chat-message", { username:username, message:input ,room})
            setInput("")
          }
      },
      [username,input, socket]
  )

  return (
    <div className="chattingRoom">
      <h1>Chat</h1>
      {messages.map((msg, index) => (
                    <p key={index}>
                        {msg.username}<br/>{msg.message}
                    </p>
                ))}
      <form className="chattingbox" onSubmit={handleSubmitForm}>
        <input  placeholder="enter your chat" type="text" id="chattingArea" onChange={(e)=>setInput(e.target.value)} value={input} />
        <Button type="submit" variant="contained" >
          Send
        </Button>
      </form>
    </div>
  )
}

export default Message
