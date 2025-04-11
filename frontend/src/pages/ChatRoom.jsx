import styles from "./ChatRoom.module.css";
import Header from "../components/chatRoom/Header";
import ChatHistory from "../components/chatRoom/ChatHistory";
import Display from "../components/chatRoom/Display";
import Profile from "../components/chatRoom/Profile";
import Textbar from "../components/chatRoom/Textbar";

function ChatRoom() {
  return (
    <div className={styles.container}>
      <Header className={styles.header} />
      <ChatHistory className={styles.chatHistory}></ChatHistory>
      <Display className={styles.display}></Display>
      <Textbar className={styles.div4}></Textbar>
    </div>
  );
}

export default ChatRoom;
