const express=require("express")
const {Server}=require("socket.io")
const http=require("http")
const cors=require("cors")

const app=express()
app.use(cors({ origin: '*'}))

const httpServer=http.createServer(app)

const io=new Server(httpServer,{
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'], 
    }
})

const usernameToSocketId = {}
const socketIdToUsername = {}



io.on("connection" ,(socket)=>{
    //  console.log(`User Connected:${socket.id}`)
     socket.on("roomjoined",(data)=>{
     const {username,room}=data
     console.log(username,room)
     usernameToSocketId[username]=socket.id
     socketIdToUsername[socket.id]=username
    //join room
    socket.join(room)
    io.to(room).emit("userjoined",{username,id:socket.id})
    io.to(socket.id).emit("roomjoined", data)

    socket.on("chat-message",({room,message})=>{
        console.log(`Message from ${socket.id} in room ${room}: ${message}`)
         io.to(room).emit("chat-message",{id: socket.id,message})
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
    io.to(to).emit("peernegofinal",{from:socket.id,ans})
})

})

httpServer.listen(8080,()=>{
    console.log("Server is running on port 8080")
})


