import styles from "./Message.module.css";
import UserLabel from "../../../general/UserLabel/UserLabel";
import useAuth from "../../../../contexts/auth/useAuth";

function Message({ message, className, ref, isSender }) {
  const { user } = useAuth();
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
      <UserLabel
        className={
          isSender
            ? styles.senderDetails + " " + styles.userLabel
            : styles.receiveDetails + " " + styles.userLabel
        }
        src={
          message.sender.profilePicture?.url
            ? message.sender.profilePicture.url
            : null
        }
        name={isSender ? "me" : message.sender.username}
      />
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
