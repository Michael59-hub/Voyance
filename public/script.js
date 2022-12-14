const socket = io("/");
let username = "Michael";
const myPeer = new Peer(undefined, {
    host: "/https://scpex.herokuapp.com",
    port: "",
    path: "/",
});
const peers = {};
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

myPeer.on("open", id =>{
    socket.emit("join-room", roomID, id);
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream =>{
        addVideoStream(video, userVideoStream)
    });
    call.on("close", ()=>{
        video.remove();
    })
    peers[userId] = call;
}

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
       video.play();
       videoGrid.append(video);
    });
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream =>{
    addVideoStream(myVideo, stream);

    myPeer.on("call", call =>{
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream =>{
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on("user-connected", userId =>{
        connectToNewUser(userId, stream);
        alert("user connected");
    });
})
socket.on("user-disconnected", userId =>{
    console.log(`${userId} disconnected from the room`);
    if(peers[userId]){
        peers[userId].close();
    }
})









//The stuff on this page partains to the front end more than the server page.