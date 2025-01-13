import React, { useCallback, useState, useEffect,useRef } from "react"
import {useNavigate} from "react-router-dom"
import { IconButton } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined"
import MessageIcon from "@mui/icons-material/Message"
import MicOutlinedIcon from "@mui/icons-material/MicOutlined"
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import MicOffIcon from '@mui/icons-material/MicOff'
import "../style/room.css"
import { useSocket } from "../context/SocketProvider"
import peerService from "../service/peer"
import Message from "./Message"
import { ToastContainer, toast } from 'react-toastify';
import Badge from '@mui/material/Badge';
import "react-toastify/dist/ReactToastify.css"



function Room() {
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [mystream, setMyStream] = useState()
  const [remotestream, setRemoteStream] = useState()
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isopen,setIsOpen]=useState(false)
  const [msgcount,setMsgCount]=useState(0)
   

  const navigate=useNavigate()

  const socket = useSocket()
  const peerRef= useRef(null)

  const audioRef=useRef(null)
  const remoteaudioRef=useRef(null)

  const handleToggle = (e)=>{
       e.stopPropagation()
       setIsOpen(!isopen)
  }

  const initializePeerConnection = () => {
     peerRef.current = peerService.createPeerConnection()
    //  console.log(peerRef.current)
     if(peerRef.current){
      peerRef.current.addEventListener("track", onTrack)
      peerRef.current.addEventListener("negotiationneeded", handleNegoNeeded)
     }
  }

  const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true,audio:true})
        // console.log(stream)
        setMyStream(stream)
        setIsVideoEnabled(true)
        setIsAudioEnabled(true)
        return stream
      } catch (error) {
        console.error("Error accessing media devices", error)
      }
    };
  

  const handleUserJoined = useCallback(({ username, id }) => {
    console.log(`Username ${username}}joined room`)
    setRemoteSocketId(id)
  }, [])

  const handleCallUser = useCallback(async () => {
    const stream = await requestPermissions()
    setMyStream(stream)
    // Add tracks to the peer connection
    stream.getTracks().forEach(track => peerRef.current.addTrack(track, stream));
   const offer = await peerService.getOffer()
    // console.log("Created offer SDP:", offer.sdp)
    socket.emit("usercall", { to: remoteSocketId, offer })
  }, [remoteSocketId, socket])

  const handleIncomingCall = useCallback( async ({ from, offer }) => {
      setRemoteSocketId(from)
      const stream = await requestPermissions()
      if (!peerRef.current) {
        initializePeerConnection();
      }
       stream.getTracks().forEach(track => peerRef.current.addTrack(track, stream));
      const ans = await peerService.getAnswer(offer)
      socket.emit("callaccepted", { to: from, ans })
      setMyStream(stream)
    },
    [socket]
  );


  const handleCallAccepted = useCallback(async({ from , ans }) => {
     await peerRef.current.setRemoteDescription(ans)
    console.log("Call Accepted")
    },[])

  const handleNegoNeeded = useCallback(async () => {
    if (peerRef.current.signalingState === "stable") {
    const offer = await peerService.getOffer()
    socket.emit("peernegoneeded", { offer, to: remoteSocketId })
    }
  }, [remoteSocketId, socket])

  const handleNegoNeededIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peerService.getAnswer(offer);
      socket.emit("peernegodone", { to: from, ans })
    },
    [socket]
  )

  const handlenegofinal=useCallback(async({ ans })=>{
      await peerRef.current.setRemoteDescription(ans)
  },[])
  

  const handleCallEnd=useCallback(async()=>{
      if(mystream){
        mystream.getTracks().forEach((track) => track.stop())
        window.location.href="/"
      }
    if (peerRef.current ) {
        peerRef.current.close()
      }
    socket.emit("call-ended",remoteSocketId)
      setMyStream(null)
      setRemoteStream(null)
      setRemoteSocketId(null)
  },[mystream,remoteSocketId])

  const handlecallendremote=useCallback(async()=>{
    if(remotestream){
      remotestream.getTracks().forEach((track) => track.stop())
    }
    if (peerRef.current ) {
      peerRef.current.close()
    }
    setRemoteStream(null);
    setRemoteSocketId(null);
    toast.error("Opponent has disconnected. The call has ended.", {
      position: "top-center",     
      hideProgressBar: true, 
      closeOnClick: true,  
      pauseOnHover: true, 
    })
    setTimeout(()=>{
      console.log("Redirecting to /lobby...");
       navigate("/lobby")
     },3000)
},[remotestream])

  

  useEffect(() => {
    if (mystream && audioRef.current) {
        audioRef.current.srcObject = mystream;
        audioRef.current.muted = !isAudioEnabled;
        audioRef.current.play();
    }
  }, [mystream,isAudioEnabled])

   useEffect(() => {
   if(peerRef.current){
    peerRef.current.addEventListener("negotiationneeded", handleNegoNeeded)
   }
    return () => {
        if(peerRef.current){
          peerRef.current.removeEventListener("negotiationneeded", handleNegoNeeded)}
        }
    }, [handleNegoNeeded])

  const onTrack = useCallback((event) => {
    console.log("Got remote track:", event.track.kind)
      const remoteStream = event.streams[0]
      console.log("Received remote stream:", remoteStream);
      // console.log(event.streams[0])
      setRemoteStream(remoteStream)
      remoteStream.getTracks().forEach(track => {
          if (track.kind === "audio" && remoteaudioRef.current) {
            remoteaudioRef.current.srcObject = remoteStream;
            remoteaudioRef.current.play()
        }
      });
  }, [])

const handleVideoToggle=async()=>{
      if (mystream ) {
        const videoTracks = mystream.getVideoTracks()
    
        videoTracks.forEach((track)=>{
          track.enabled=!track.enabled
          
        setIsVideoEnabled((prev) => !prev)
        })
      }
    }
    
   const handleAudioToggle=()=>{
     if(mystream){
       mystream.getAudioTracks().forEach(track=>{
         track.enabled=!track.enabled 
         console.log(`Track ID: ${track.id}, Enabled: ${track.enabled}, Muted: ${track.muted}`);
       })
      setIsAudioEnabled(prev=>!prev)
     }
   }

   const handleUpdateBadge=useCallback(({id})=>{
        // console.log(id)
        if(id === remoteSocketId){
        setMsgCount(prevcount=>prevcount+1)
        }
   },[remoteSocketId])
    
  useEffect(() => {
    initializePeerConnection()
    const initStream = async () => {
        await requestPermissions()
      }
    
    initStream()

    socket.on("userjoined", handleUserJoined)
    socket.on("incomingcall", handleIncomingCall)
    socket.on("callaccepted", handleCallAccepted)
    socket.on("peernegoneeded", handleNegoNeededIncoming)
    socket.on("peernegodone",handlenegofinal)
    socket.on("call-ended",(remoteSocketId)=>{
      console.log(`call ended by ${remoteSocketId}`)
      handlecallendremote(remoteSocketId)
    })
    socket.on("chat-message",handleUpdateBadge)
   
    //cleanup
    return () => {
      socket.off("userjoined", handleUserJoined)
      socket.off("incomingcall", handleIncomingCall)
      socket.off("callaccepted", handleCallAccepted)
      socket.off("peernegoneeded", handleNegoNeededIncoming)
      socket.off("peernegodone",handlenegofinal)
      socket.off("call-ended")
      socket.off("chat-message",handleUpdateBadge)
    }
  }, [
    socket,
    handleIncomingCall,
    handleCallUser,
    handleCallAccepted,
    handleNegoNeeded,
    handlecallendremote,
  ])




  return (
    <>
      <div className="meetVideoContainer">
        <h1>Room</h1>
        <h4>{remoteSocketId ?  "connected" : "No one in room"}</h4>
        <button className="call-btn" onClick={handleCallUser}>Call</button>
        {mystream && (
          <div>
            {/* mystream */}
            <video
              playsInline
              autoPlay
              ref={(video)=>{
                 if(video) video.srcObject=mystream
              }}
              className={`local-stream ${remotestream  ? "small" :""}`}
            />
          </div>
        )}
        <div className="video-btns">
        <audio ref={audioRef} autoPlay  muted={isAudioEnabled ? false : true}/>
          { 
            <IconButton onClick={handleVideoToggle} className="call-btn">
              {isVideoEnabled ? <VideocamIcon style={{ fontSize: "35px", color: "white" }} />:<VideocamOffIcon style={{ fontSize: "35px", color: "white" }}/>}
            </IconButton>
          }
          { 
            <IconButton className="end-call-btn" onClick={handleCallEnd}>
              <CallEndOutlinedIcon style={{ color: "red", fontSize: "35px" }} />
            </IconButton>
          }
          { 
            <IconButton className="msg-btn" onClick={handleToggle}>
               {
                msgcount > 0 ?
                <Badge badgeContent={msgcount} color="primary">
                <MessageIcon style={{ fontSize: "35px", color: "white" }} color="action"/>
              </Badge>:  <MessageIcon style={{ fontSize: "35px", color: "white" }}/>
              }
            </IconButton>
          }
          {
            <IconButton className="mute-btn" onClick={handleAudioToggle}>
              { isAudioEnabled ? <MicOutlinedIcon style={{ fontSize: "35px", color: "white" }}/>:<MicOffIcon style={{ fontSize: "35px", color: "white" }}/> }
            </IconButton>
}
        </div>
        { remotestream && (
          <>
           {/* remotestream */}
           <video 
             playsInline
             autoPlay
             ref={(video)=>{
              if(video)
                video.srcObject= remotestream
             }}
              className="remote-stream"
             /> 
             <audio ref={remoteaudioRef} autoPlay/>
          </>
        )}
         <ToastContainer />
      </div>
      <Message onClick={(e)=>handleToggle(e)} isopen={isopen}  setIsOpen={setIsOpen}/>
    </>
  )
}

export default Room