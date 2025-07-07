import styles from "./Display.module.css";
import TextBar from "./TextBar/TextBar";
import Message from "./Message/Message";
import Header from "./Header/Header";
import { useState, useRef, useEffect } from "react";
import useChatRoom from "../../../contexts/chatRoom/useChatRoom";
import useAuth from "../../../contexts/auth/useAuth";

function Display({ className }) {
  const bottomTextMessageRef = useRef(null);
  const { messages } = useChatRoom();
  const { user } = useAuth();

  useEffect(() => {
    bottomTextMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={className}>
      <Header />
      <div className={styles.messageContainer}>
        {messages?.map((message) => {
          return (
            <Message
              key={message._id}
              isSender={user.username === message.sender}
              ref={bottomTextMessageRef}
              message={message}
            />
          );
        })}
      </div>
      <TextBar />
    </div>
  );
}

export default Display;
