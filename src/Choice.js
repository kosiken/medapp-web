import React, { useState } from "react";

import Chat2 from "./pages/Chat2";

const Choice = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("MyRoom");
  const [show, setShow] = useState(false)

  if (!show) {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          onChange={(e) => {
            if (e.target.value) setName(e.target.value);
          }}
        />
        <input
          type="text"
          onChange={(e) => {
            if (e.target.value) setRoom(e.target.value);
          }}
        />
        <button onClick={e => {
            setShow(true)
        }}>
            Submit
        </button>
      </form>

    
    );

    
  }

  return <Chat2 room={room}  name={name} />
};

export default Choice;
