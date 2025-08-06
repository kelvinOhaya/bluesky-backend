import styles from "./ChatRoom.module.css";
import { useState, useEffect } from "react";
import "../../styles/global.css";
import { motion } from "framer-motion";
import useChatRoom from "../../contexts/chatRoom/useChatRoom";
import useSocket from "../../contexts/socket/useSocket";
import useAuth from "../../contexts/auth/useAuth";
import MenuIconVertical from "../../components/general/icons/MenuIconVertical";
import ChatsTab from "../../components/chatRoomComponents/ChatsTab/ChatsTab";
import Display from "../../components/chatRoomComponents/Display/Display";

function ChatRoom() {
  const { isLoading, loadChatRooms, currentChat } = useChatRoom();
  const { user, accessToken, fetchUser } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    // loadMessage()

    const fetchChatRooms = async () => {
      if (!isLoading && user && accessToken && socket != null) {
        await loadChatRooms();
      }
    };
    fetchChatRooms();
  }, []);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const [activeGroupChat, setActiveGroupChat] = useState(0);
  const animationWidth = sidebarIsOpen ? "300px" : "0";
  return (
    <div className={styles.container}>
      <motion.nav
        initial={{ width: "300px" }}
        style={{
          pointerEvents: sidebarIsOpen ? "all" : "none",
        }}
        animate={{ width: animationWidth }}
        transition={{ duration: 0.3 }}
        className={styles.nav}
      >
        <ChatsTab
          isOpen={sidebarIsOpen}
          className={styles.chatsTab}
          width={animationWidth}
          activeGroupChat={activeGroupChat}
          setActiveGroupChat={setActiveGroupChat}
        />
      </motion.nav>
      <button
        onClick={() => setSidebarIsOpen((prev) => !prev)}
        className={styles.sidebarButton}
      >
        <MenuIconVertical size={15} />
      </button>
      <Display className={styles.display} />
    </div>
  );
}

export default ChatRoom;
