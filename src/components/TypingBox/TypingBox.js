import React from "react";
import IconButton from "../IconButton/IconButton";
import { BiSend as SendIcon } from "react-icons/bi";
import classNames from "classnames";
import styles from "./TypingBox.module.css";

const TypingBox = ({ onSubmit = () => null }) => {
  const ref = React.useRef(null);
  const classes = classNames(styles["typing-box"]);
  const inputSpanClasses = classNames(styles["input-span"]);

  const inputClasses = classNames(styles["input"]);
  const [placeholder, setPlaceholder] = React.useState(true);
  const onSend = function () {
    if (ref.current) {
      if (onSubmit) onSubmit(ref.current.textContent);

      ref.current.textContent = "";
      setPlaceholder(true);
    }
  };

  return (
    <div
      className={classes}

    >
      <div
        className={inputClasses}
        onClick={() => {
       
            document.getElementById("message").focus()
     //     }}



          setPlaceholder(false);
        }}
      >
        {placeholder && (
          <span className={"feint"} id={"placeholder"}>
           
            Write a message… 
          </span>
        )} 
        <span contentEditable ref={ref} id="message" className={inputSpanClasses} />
      </div>
      <IconButton borderless onClick={onSend} role="icon" aria-label="send" >
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default TypingBox;
