import React, { useEffect, useState } from "react";
import {
  BiDotsVerticalRounded,
  BiVideoRecording,
  BiVideoOff,
  BiMessageDetail,
} from "react-icons/bi";
import IconButton from "../components/IconButton/IconButton";
import MessageBox from "../components/MessagBox/MessageBox";
import TypingBox from "../components/TypingBox/TypingBox";
import av from "animate-value";
import ChatApi from "../Api/ChatApi";
import { useMediaQuery } from 'react-responsive'
import OverLayLoader from "../components/OverlayLoader";
 

const prod = true;
const url = prod ? "/" : "http://127.0.0.1:8000";



const Chat = ({videoChat = true}) => {
  const chatRef = React.useRef(null);
  const [chat, setChat] = useState(null);
  const containerRef = React.useRef(null);
  const localVideoref = React.useRef(null);
  const remoteVideoref = React.useRef(null);
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("Connecting...");
  const [users, setUsers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const isMobileDevice = useMediaQuery({
    query: '(max-device-width: 768px)'
  })

  useEffect(() => {
    const _chat = new ChatApi(
      {
        id: 1,
        FirstName: "Kosy",
        LastName: "Allison",
        Role: "Physician",
      },
      {
        video: true,
        audio: true,
        onAddPeer: OnAddPeer,
        OnMessage: OnMessage,
        onAddStream: OnAddStream,
        OnDisconnect: OnDisconnect,
        addLocalStream: false,
        maxPeers: 2,
      }
    );

  if(videoChat) _chat.addLocalStream = true;
    _chat.initialize(url);
    setChat(_chat);
    if(isMobileDevice) {
      alert("lol")
      let node = document.querySelector("#lion");
      // node.scrollLeft = node.scrollWidth;
      av({
        from: node.scrollLeft,
        to: node.scrollWidth,
        duration: 500,
        change: (value) => {
          node.scrollLeft = value;
        },
      });

    }

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
        containerRef.current.clientHeight - 400
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
    setShowOverlay(videoChat && true);
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
      setShowOverlay(false);
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

  const preventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relic-chat" id="lion">
      <div
        className="video-box"
        style={{ position: "relative" }}
        onDragStart={preventDefault}
      >
        {showOverlay && (
          <OverLayLoader color={"#ffffff"} backgroundColor={"#000000"} />
        )}

        <div style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",zIndex: 999,
        }}>
        <IconButton
          className="center none"
          borderless
          onClick={() => {
            if(isMobileDevice){chat.toggleVideo();
            setVideoOn(false)}
            
            let node = document.querySelector("#lion");
            // node.scrollLeft = node.scrollWidth;
            av({
              from: node.scrollLeft,
              to: node.scrollWidth,
              duration: 500,
              change: (value) => {
                node.scrollLeft = value;
              },
            });
          }}
          style={{
            backgroundColor: "white",
            width: 50,
            height: 50,
            display:"inline-flex",
            
            opacity: "0.6",
          
            
          }}
        >
          <BiMessageDetail />
        </IconButton>

        </div>

       
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

      <div className="message-box-wrapper" onDragStart={preventDefault}>
        <div className="message-box flex column">
          <div
            className="chat-header flex space-btwn "
            style={{
              padding: "20px 10px",
            }}
          >
          {videoChat && (  <IconButton
              onClick={() => {
                chat.toggleVideo();
                setVideoOn(!videoOn);
                let node = document.querySelector("#lion");
                // node.scrollLeft = node.scrollWidth;
                av({
                  from: node.scrollLeft,
                  to: 0,
                  duration: 500,
                  change: (value) => {
                    node.scrollLeft = value;
                  },
                });
              }}
            >
              {videoOn ? <BiVideoRecording /> : <BiVideoOff />}
            </IconButton>
          )}  <p
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
