import React, { useEffect, useState } from "react";
import {
  BiDotsVerticalRounded,
  BiVideoRecording,
  BiVideoOff,
} from "react-icons/bi";
import IconButton from "../components/IconButton/IconButton";
import MessageBox from "../components/MessagBox/MessageBox";
import TypingBox from "../components/TypingBox/TypingBox";
import av from "animate-value";
import ChatApi2 from "../Api/ChatApi2";
import ChatApiText from "../Api/ChatApiText";
import OverLayLoader from "../components/OverlayLoader";
import Slider from "../components/Slider/Slider";

const prod = true;
const url = prod ? "https://kosy.herokuapp.com" : "http://127.0.0.1:8000";

const Chat2 = ({ videoChat = true, room, name }) => {
  const chatRef = React.useRef(null);
  const _chatRef = React.useRef(
    new ChatApi2({
      name,
      room,
    })
  );
  const containerRef = React.useRef(null);
  const [users, setUsers] = useState([]);

  const chatMessageRef = React.useRef(
    new ChatApiText(
      {
        id: 1,
        FirstName: "Kosy",
        LastName: "Allison",
        Role: "Physician",
      },
      {
        maxPeers: 2,
      }
    )
  );

  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("Connecting...");
  const [showOverlay, setShowOverlay] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  useEffect(() => {
    const _chat = chatMessageRef.current;
    _chat.onAddPeer = OnAddPeer;
    _chat.OnMessage = OnMessage;
    _chat.OnDisconnect = OnDisconnect;
    _chat.initialize(url);
    Initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Initialize = () => {
    const _chat = _chatRef.current;
    _chat.onMediaLoaded = OnMediaLoaded;
    _chat.onParticipantAdded = setUser;

    _chat.initialize(url).then(console.log);
  };
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

  const OnAddPeer = (config) => {
    // let m = config
    setUser(config.Name);
    console.log(users.concat([config]));
    setUsers(users.concat([config]));
    setShowOverlay(videoChat && true);
  };

  const sendIt = (content) => {
    setMessage({
      content,
      time: Date.now(),
      recieved: false,
    });
    if (users.length)
      chatMessageRef.current.message(
        users[0].id,
        JSON.stringify({
          user: "Kosy Allison",
          content,
        })
      );
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

  const OnMediaLoaded = () => {
    setShowOverlay(false);
  };

  const OnMessage = (data) => {
    let m = JSON.parse(data);
    setMessage({
      content: m.content,
      time: Date.now(),
      recieved: true,
    });
  };

  const OnDisconnect = () => {
    setUsers([]);
    setUser("Disconnected");
  };

  return (
    <Slider>
      <div
        className="video-box"
        style={{ position: "relative" }}
        onDragStart={preventDefault}
        id="media-div"
      >
        {showOverlay && (
          <OverLayLoader color={"#ffffff"} backgroundColor={"#000000"} />
        )}
      </div>

      <div
        className="message-box-wrapper"
        onDragStart={preventDefault}
        style={{ paddingBottom: "10px" }}
      >
        <div className="message-box flex column">
          <div
            className="chat-header flex space-btwn "
            style={{
              padding: "20px 10px",
            }}
          >
            {videoChat && (
              <IconButton
                onClick={() => {
                  //   chat.toggleVideo();
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
            )}{" "}
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
    </Slider>
  );
};

export default Chat2;
