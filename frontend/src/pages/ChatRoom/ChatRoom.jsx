import styles from "./chatRoom.module.css";
import { useState } from "react";
import "../../styles/global.css";
import { motion } from "framer-motion";
import MenuIconVertical from "../../components/general/icons/MenuIconVertical";
import Header from "../../components/chatRoomComponents/Header/Header";
import ChatsTab from "../../components/chatRoomComponents/ChatsTab/ChatsTab";
import Display from "../../components/chatRoomComponents/Display/Display";
import Textbar from "../../components/chatRoomComponents/textBar/Textbar";

function ChatRoom() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const animationWidth = sidebarIsOpen ? "16.2%" : "0";
  return (
    <div className={styles.container}>
      <motion.nav
        initial={{ width: "0" }}
        animate={{
          width: animationWidth,
          pointerEvents: sidebarIsOpen ? "all" : "none",
        }}
        transition={{ duration: "0.3" }}
        className={styles.nav}
      >
        <ChatsTab
          isOpen={sidebarIsOpen}
          className={styles.chatsTab}
          width={animationWidth}
        />
      </motion.nav>
      <button
        onClick={() => setSidebarIsOpen((prev) => !prev)}
        className={styles.sidebarButton}
      >
        <MenuIconVertical size={15} />
      </button>
      <main className={styles.main}>
        <Header className={styles.header} />
        <Display className={styles.display} />
        <Textbar className={styles.textbar} />
      </main>
    </div>
  );
}

export default ChatRoom;
