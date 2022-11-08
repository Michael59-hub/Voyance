const express = require("express");
const app = express();
const server = require("http").Server(app);
const io= require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req,res) =>{
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req,res)=>{
    res.render("room", {roomId: req.params.room});
});

var ExpressPeerServer = require("peer").ExpressPeerServer;    
var options = {
  debug: true,
  allow_discovery: true,
};
let peerServer = ExpressPeerServer(server, options);
app.use("/", peerServer);

io.on("connection", socket =>{
    socket.on("join-room", (roomId, userId) =>{
        console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
        socket.on("disconnect", ()=>{
            socket.to(roomId).emit("user-disconnected", userId)
        })
    })
})

console.log("working");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
server.listen(port);

