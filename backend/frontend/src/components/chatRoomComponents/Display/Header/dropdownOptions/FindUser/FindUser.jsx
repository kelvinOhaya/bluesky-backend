import styles from "./FindUser.module.css";
import { motion, AnimatePresence } from "framer-motion";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import { useEffect, useState } from "react";
import useSocket from "../../../../../../contexts/socket/useSocket";
import useAuth from "../../../../../../contexts/auth/useAuth";

function FindUser({ dropdownFeatures, setDropdownFeatures }) {
  const { verifyJoinCode, findUser, currentChat, checkIfDmExists } =
    useChatRoom();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [userDoesNotExist, setUserDoesNotExist] = useState(false);
  const [alreadyInDm, setAlreadyInDm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    setIsEmpty(false);
    setUserDoesNotExist(false);
    setAlreadyInDm(false);
    setJoinCode("");
  }, [dropdownFeatures]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    if (joinCode.trim() === "") {
      setIsSearching(false);
      setIsEmpty(true);
      return;
    }

    const dmExists = checkIfDmExists(joinCode);
    console.log(dmExists);
    if (dmExists) {
      setIsSearching(false);
      setAlreadyInDm(true);
      return;
    }

    // vFrOqPjN
    try {
      await findUser(joinCode);

      setDropdownFeatures({ dropdownFeatures, userSearch: false });
    } catch (error) {
      setUserDoesNotExist(true);
      console.log("Error trying to find other users: ", error);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <AnimatePresence>
      {dropdownFeatures.userSearch && (
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
                placeholder="Type the user's join code here"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className={styles.inputField}
              />
              {isSearching && <p>Searching...</p>}
              {userDoesNotExist && (
                <p>*A User does not exist with that join code</p>
              )}
              {alreadyInDm && <p>*You already have a room with this user</p>}
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

export default FindUser;
