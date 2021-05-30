import React, { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import IconButton from "../components/IconButton/IconButton";
import MessageBox from "../components/MessagBox/MessageBox";
import TypingBox from "../components/TypingBox/TypingBox";
import av from 'animate-value';
 

const Chat = () => {
  const chatRef = React.useRef(null);
  const containerRef = React.useRef(null)
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
useEffect(()=> {
  // if(containerRef.current) {
  //   containerRef.current.addEventListener("scroll", e => {
  //     console.log(containerRef.current.scrollHeight, containerRef.current.scrollTop)
  //   })
  // }
}, [])
  useEffect(() => {
    av()
    if (message.content) {
      setMessages(messages.concat([message]));
    }
    if(chatRef.current && containerRef.current) {
      if(chatRef.current.clientHeight > containerRef.current.clientHeight - 100) {
        if(!window.hasSetHeight) {
          // document.querySelector("#lol").classList.add("scroll-y")
          containerRef.current.classList.add("scroll-y");
          setTimeout(()=> {
            av({
              from: containerRef.current.scrollTop,
              to: containerRef.current.scrollHeight,
              duration:300,
               change: value => {
                containerRef.current.scrollTop = value;
               }
            })
            containerRef.current.scrollTop = containerRef.current.scrollHeight
          }, 300)
        //  containerRef.current.scroll({
        //    top: 100,
        //    left: 0,
        //    behaviour: "smooth"
        //  })
         console.log("liiil")
      
        }
      }
    } 
  }, [message]);
  const addMessage = () => {
 
 
  };

  const sendIt = (content) => {
    setMessage({
      content,
      time: Date.now(),
      recieved: false
    })
  } 

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
      <div className="video-box">
        <p>video box</p>
        <button onClick={addMessage}>generate</button>
      </div>
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
            {"John Egwumike"}
          </p>
          <IconButton borderless>
            <BiDotsVerticalRounded />
          </IconButton>
        </div>
        <div className="overflow-hidden" style={{ flex: 1, height: "100%", overflow: "hidden" }} ref={containerRef} >
          <div className="chat-box" ref={chatRef}>{RenderMessages()}</div>
        </div>

        <TypingBox onSubmit={sendIt}/>
        <div></div>
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
