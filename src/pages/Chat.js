import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import IconButton from "../components/IconButton/IconButton";
import MessageBox from "../components/MessagBox/MessageBox";
import TypingBox from "../components/TypingBox/TypingBox";
import av from "animate-value";
import ChatApi from "../Api/ChatApi";
import FadeLoader from "react-spinners/FadeLoader";




let image = `data:image/png;base64,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`;

const prod = true
 const url =prod? '/' : "http://127.0.0.1:8000";

const OverLayLoader = ({ color, backgroundColor }) => {
  return (
    <div
      className="flex center"
      style={{
        color,
        backgroundColor,
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url("${image}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        left: 0,
        opacity: 0.7
      }}
    >
      <p style={{
        position:"absolute",
        top: 5,
        left: 0,
        width: "100%",
        textAlign: "center"
      }}>Loading Video Stream</p>
      
      <FadeLoader color={color} />
      <br/>
      
    </div>
  );
};

const Chat = () => {
  const chatRef = React.useRef(null);
  const [chat, setChat] = useState(null);
  const containerRef = React.useRef(null);
  const localVideoref = React.useRef(null);
  const remoteVideoref = React.useRef(null);
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const _chat = new ChatApi(
      {
        id: 1,
        FirstName: "Kosy",
        LastName: "Allison",
        Role: "Physician",
      },
      OnAddPeer,
      true,
      true,
      OnMessage,
      OnAddStream,
      OnDisconnect,
      {
        addLocalStream: false,
        maxPeers: 2,
        //   servers: Servers,
      }
    );

      _chat.config.addLocalStream = true
    _chat.initialize(url);
    setChat(_chat);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    av();
    if (message.content) {
      setMessages(messages.concat([message]));
    }
    if (chatRef.current && containerRef.current) {
      if (
        chatRef.current.clientHeight >
        containerRef.current.clientHeight - 100
      ) {
        if (!window.hasSetHeight) {
          // document.querySelector("#lol").classList.add("scroll-y")
          containerRef.current.classList.add("scroll-y");
          setTimeout(() => {
            av({
              from: containerRef.current.scrollTop,
              to: containerRef.current.scrollHeight,
              duration: 300,
              change: (value) => {
                containerRef.current.scrollTop = value;
              },
            });
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }, 300);
          //  containerRef.current.scroll({
          //    top: 100,
          //    left: 0,
          //    behaviour: "smooth"
          //  })
          console.log("liiil");
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  
  const sendIt = (content) => {
    setMessage({
      content,
      time: Date.now(),
      recieved: false,
    });
    if (users.length)
      chat.message(
        users[0].id,
        JSON.stringify({
          user: "Kosy Allison",
          content,
        })
      );
  };

  const OnAddPeer = (config) => {
    // let m = config
    setUser(config.Name);
    console.log(users.concat([config]));
    setUsers(users.concat([config]));
    setShowOverlay(true)
  };

  const OnMessage = (data) => {
    let m = JSON.parse(data);
    setMessage({
      content: m.content,
      time: Date.now(),
      recieved: true,
    });
  };

  const OnAddStream = (type, stream, id) => {
    if (type === "local") {
      console.log("here");
      localVideoref.current.srcObject = stream;
    } else {
      remoteVideoref.current.srcObject = stream;
      if (remoteVideoref.current.paused) remoteVideoref.current.play();
      setShowOverlay(false)
    }
  };
  const OnDisconnect = () => {
    setUsers([]);
    setUser("Disconnected");
    // localVideoref.current.pause()
    let obj = remoteVideoref.current;
    if (obj.readyState >= 2) obj.pause();
  };
  const RenderMessages = () => {
    if (!messages.length)
      return (
        <p style={{ textAlign: "center", fontSize: 12 }}>No messages yet</p>
      );

    return messages.map((m, id) => (
      <MessageBox message={m} key={"relic-message" + id} />
    ));
  };

  return (
    <div className="relic-chat">
      <div className="video-box" style={{ position: "relative" }}>
       {showOverlay && (  <OverLayLoader color={"#ffffff"} backgroundColor={"#000000"} />
       )}
        <video
          autoPlay
          ref={remoteVideoref}
          controls={false}
          playsInline
          style={{
            height: "100%",

            width: "100%",
          }}
        />
        {/* <button onClick={addMessage}>generate</button> */}
        <video
          autoPlay
          volume={0}
          ref={localVideoref}
          muted
          playsInline
          style={{
            width: "120px",
            height: "200px",
            position: "absolute",
            left: 0,
            bottom: 0,
          }}
        />
      </div>

<div className="message-box-wrapper none">
<div className="message-box flex column">

  
        <div
          className="chat-header flex space-btwn "
          style={{
            padding: "20px 10px",
          }}
        >
          <p
            style={{
              margin: 0,
              flex: 1,
              textAlign: "center",
            }}
          >
            {user}
          </p>
          <IconButton borderless>
            <BiDotsVerticalRounded />
          </IconButton>
        </div>
        <div
          className="overflow-hidden"
          style={{ flex: 1, height: "100%", overflow: "hidden" }}
          ref={containerRef}
        >
          <div className="chat-box" ref={chatRef}>
            {RenderMessages()}
          </div>
        </div>

        <TypingBox onSubmit={sendIt} />
        <div></div>
      </div>
   
</div>
  </div>
  );
};

export default Chat;
// <div key={"relic-message" + id}  className={"mb flex column" + (m.recieved ? " right-div" : " left-div")}>
// <div className={"gradients message " +
//  (m.recieved ? "right": "left")}>
//     <p style={{
//         margin: 0
//     }}>
//         {m.content}
//     </p>
// </div>

// <small style={{color: "#6B779A"}}> {moment(m.time).format("h:mm a")}</small>
// </div>
