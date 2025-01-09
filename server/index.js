const express=require("express")
const app = express()
const {Server}=require("socket.io")
const http=require("http")
const cors=require("cors")


const allowedOrigin = process.env.NODE_ENV === 'production' 
   ? [process.env.FRONTEND_URL_PROD]
  : [process.env.FRONTEND_URL_DEV]

const corsOptions={
  origin:allowedOrigin, 
credentials: true,  
}
//middleware
app.use(cors(corsOptions))

const httpServer=http.createServer(app)

const io=new Server(httpServer,{
    cors: {
        origin: allowedOrigin, 
        methods: ['GET', 'POST'], 
    }
})

const usernameToSocketId = {}
const socketIdToUsername = {}



io.on("connection" ,(socket)=>{
    //  console.log(`User Connected:${socket.id}`)
     socket.on("roomjoined",(data)=>{
     const {username,room}=data
    //  console.log(username,room)
     usernameToSocketId[username]=socket.id
     socketIdToUsername[socket.id]=username
    //join room
    socket.join(room)
    io.to(room).emit("userjoined",{username,id:socket.id})
    io.to(socket.id).emit("roomjoined", data)

    socket.on("chat-message", ({room,message,username})=>{
        // console.log("Chat message received:", { room, message, username })
         io.to(room).emit("chat-message",{id:socket.id, message, username ,room})
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      })
    })



socket.on("usercall", ({ to, offer }) => {
    io.to(to).emit("incomingcall", { from : socket.id, offer });
})

socket.on("callaccepted",({to ,ans})=>{
  io.to(to).emit("callaccepted",{from:socket.id,ans})
})

socket.on("peernegoneeded",({to ,offer})=>{
    io.to(to).emit("peernegoneeded",{from:socket.id,offer})
  })

socket.on("peernegodone",({to,ans})=>{
    // console.log("peernego",ans)
    io.to(to).emit("peernegofinal",{from:socket.id,ans})
})

})

httpServer.listen( process.env.PORT || 3000,'0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`)
})


