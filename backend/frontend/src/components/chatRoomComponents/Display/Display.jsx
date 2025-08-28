import styles from "./Display.module.css";
import TextBar from "./TextBar/TextBar";
import Message from "./Message/Message";
import Header from "./Header/Header";
import { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday, isSameDay, isSameWeek } from "date-fns";
import useChatRoom from "../../../contexts/chatRoom/useChatRoom";
import useAuth from "../../../contexts/auth/useAuth";

function Display({ className }) {
  const bottomTextMessageRef = useRef(null);
  const { messages } = useChatRoom();
  const { user, accessToken } = useAuth();
  const currentDate = new Date();

  // console.log(accessToken);

  useEffect(() => {
    bottomTextMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={className}>
      <Header />
      <div className={styles.messageContainer}>
        {messages?.map((message, index) => {
          const currentDate = new Date(message.createdAt);
          const prevDate =
            index > 0 ? new Date(messages[index - 1].createdAt) : null;
          const showDivider = !prevDate || !isSameDay(prevDate, currentDate); //show the divider if the days are different or it its the first message

          return (
            <>
              <span
                style={{
                  textAlign: "center",
                  color: "grey",
                  fontSize: "0.9rem",
                }}
              >
                {showDivider === true
                  ? isToday(currentDate)
                    ? "Today"
                    : isYesterday(currentDate)
                    ? "Yesterday"
                    : isSameWeek(currentDate)
                    ? format(currentDate, "EEEE")
                    : format(currentDate, "MMMM dd, yyyy")
                  : null}
              </span>
              <Message
                key={message._id || index}
                isSender={user.username === message.sender.username}
                ref={bottomTextMessageRef}
                message={message}
              />
            </>
          );
        })}
      </div>
      <TextBar />
    </div>
  );
}

export default Display;
