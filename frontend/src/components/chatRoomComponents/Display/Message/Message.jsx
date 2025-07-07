import styles from "./Message.module.css";

function Message({ message, className, ref, isSender }) {
  const currentTime = new Date(message.createdAt)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return (
    <div
      className={styles.container}
      style={{ alignSelf: isSender ? "flex-end" : "flex-start" }}
    >
      <span className={isSender ? styles.senderDetails : styles.receiveDetails}>
        {isSender ? "me" : message.sender}
      </span>
      <div
        className={
          styles.message + " " + (isSender ? styles.sent : styles.received)
        }
        ref={ref}
      >
        <p>{message.content}</p>
      </div>
      <span className={isSender ? styles.senderDetails : styles.receiveDetails}>
        {currentTime}
      </span>
    </div>
  );
}

export default Message;
