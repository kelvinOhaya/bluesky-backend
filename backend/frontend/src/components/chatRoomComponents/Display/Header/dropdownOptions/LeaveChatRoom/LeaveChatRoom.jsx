import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import styles from "./LeaveChatRoom.module.css";
import { motion, AnimatePresence } from "framer-motion";

function LeaveChatRoom({ dropdownFeatures, setDropdownFeatures }) {
  const { leaveChatRoom, currentChat } = useChatRoom();

  const handleLeaveRoom = async () => {
    await leaveChatRoom();
    setDropdownFeatures({ dropdownFeatures, leaveRoom: false });
  };

  return (
    <AnimatePresence>
      {dropdownFeatures.leaveRoom && (
        <motion.div
          initial={{ left: "-50%" }}
          animate={{ left: "50%" }}
          exit={{ left: "150%", transition: { duration: "0.7" } }}
          transition={{ duration: "0.3" }}
          className={styles.container}
        >
          <p style={{ textAlign: "center" }}>
            {currentChat.isDm
              ? "Are you sure you want to leave this chat?"
              : "Are you sure you want to leave?"}
          </p>
          <p style={{ textAlign: "center" }}>
            {currentChat.memberCount === 1 &&
              "You are the last member. All messages will be lost forever!"}
          </p>
          <div className={styles.buttonContainer}>
            <button
              onClick={() =>
                setDropdownFeatures({ dropdownFeatures, leaveRoom: false })
              }
            >
              No
            </button>
            <button onClick={handleLeaveRoom}>Yes</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LeaveChatRoom;
