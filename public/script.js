//const { Peer } = require("peerjs");

const socket = io("/");

const videoGrid = document.getElementById("video-grid");

const myvideo = document.createElement("video");

myvideo.muted = true;

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030"
});

let myvideostream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  }).then((stream) => {
    myvideostream = stream;
    addvideostream(myvideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (uservideostream) => {
        addvideostream(video, uservideostream);
      })
})
    socket.on("user-connected", (userid) => {
      connectToNewUser(userid, stream);
    })

    let text = $("input");

    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        
        socket.emit("message", text.val());
        text.val("");
      }
    });
    socket.on("createMessage", (message) => {
      console.log("creating message",message);
      $('.messages').append(`<li class="message"><b>user</br><br/>${message}</li>`);
    })
}) 
  
peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});
    //socket.emit('join-room',ROOM_ID);
  
const connectToNewUser = (userid, stream) => {
  const call = peer.call(userid, stream);
  const video = document.createElement("video");
  call.on("stream", (uservideostream) => {
    addvideostream(video, uservideostream);
  });
};

const addvideostream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
