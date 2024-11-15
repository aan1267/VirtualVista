import React, { useCallback, useEffect } from "react"
import "../style/lobby.css"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketProvider"
import { useUserContext } from "../context/UserProvider"
import Button from "@mui/material/Button"

function Lobby() {
  //  const [username, setUsername] = useState("")
  // const [room, setRoom] = useState("")

  const navigate = useNavigate()
  const socket = useSocket()
  const { setUsername, username, room, setRoom } = useUserContext()
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault()
      socket.emit("roomjoined", { username, room })
    },
    [username, room, socket]
  )

  const handleJoinRoom = useCallback(
    (data) => {
      const { username, room } = data
      // console.log(data)
      console.log(username, room)
      navigate(`/room/${room}`)
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("roomjoined", handleJoinRoom)
    return () => {
      socket.off("roomjoined", handleJoinRoom)
    }
  }, [socket, handleJoinRoom])
  return (
    <div className="Lobby">
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="enter username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          placeholder="enter room number"
          id="room"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />
        <br />
        <div className="join-btn">
          <Button type="submit" variant="contained">
            Join
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Lobby
