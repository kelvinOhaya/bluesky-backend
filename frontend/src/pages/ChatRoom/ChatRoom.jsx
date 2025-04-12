import styles from "./chatRoom.module.css";
import "../../styles/global.css";
import Header from "../../components/chatRoomComponents/Header/Header";
import ChatsTab from "../../components/chatRoomComponents/ChatsTab/ChatsTab";
import Display from "../../components/chatRoomComponents/Display/Display";
import Textbar from "../../components/chatRoomComponents/textBar/Textbar";
import UserPortion from "../../components/chatRoomComponents/UserPortion/UserPortion";

function ChatRoom() {
  return (
    <div className={styles.container}>
      <UserPortion className={styles.userPortion} />
      <Header className={styles.header} />
      <ChatsTab className={styles.chatsTab}></ChatsTab>
      <Display className={styles.display}></Display>
      <Textbar className={styles.textbar}></Textbar>
    </div>
  );
}

export default ChatRoom;
