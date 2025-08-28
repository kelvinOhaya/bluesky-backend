import styles from "./JoinRoom.module.css";
import { motion, AnimatePresence } from "framer-motion";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import { useEffect, useState } from "react";

function JoinRoom({ dropdownFeatures, setDropdownFeatures }) {
  const { verifyJoinCode, joinRoom, checkIfRoomExists } = useChatRoom();
  const [roomDoesNotExist, setRoomDoesNotExist] = useState(false);
  const [roomAlreadyExists, setRoomAlreadyExists] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    setIsEmpty(false);
    setRoomDoesNotExist(false);
    setJoinCode("");
  }, [dropdownFeatures]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsEmpty(false);
    setRoomDoesNotExist(false);
    setRoomAlreadyExists(false);

    if (joinCode.trim() === "") {
      setIsSearching(false);
      setIsEmpty(true);
      return;
    }

    const roomAlreadyExists = checkIfRoomExists(joinCode);
    if (roomAlreadyExists) {
      setIsSearching(false);
      setRoomAlreadyExists(true);
      return;
    }

    const isValid = await verifyJoinCode(joinCode);
    if (isValid) {
      await joinRoom(joinCode);
      setIsSearching(false);
      setDropdownFeatures({ dropdownFeatures, roomSearch: false });
    } else {
      setIsSearching(false);
      setRoomDoesNotExist(true);
    }
  };
  return (
    <AnimatePresence>
      {dropdownFeatures.roomSearch && (
        <motion.div
          className={styles.container}
          initial={{ left: "-400px" }}
          animate={{ left: "50%" }}
          exit={{ left: " 105%" }}
          transition={{ duration: "0.3" }}
        >
          <form className={styles.formContainer} onSubmit={handleSearch}>
            <span className={styles.inputErrorContainer}>
              <input
                type="text"
                name="searchBar"
                placeholder="Type Join Code Here: "
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className={styles.inputField}
              />
              {isSearching && <p>Searching...</p>}
              {roomDoesNotExist && (
                <p>*A room does not exist with that join code</p>
              )}
              {roomAlreadyExists && (
                <p>*You are already in a room with that joinCode</p>
              )}
              {isEmpty && <p>*Please enter a join code</p>}
            </span>
            <button type="submit" className={styles.submitBtn}>
              Search
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default JoinRoom;
