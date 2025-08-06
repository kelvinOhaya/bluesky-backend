import styles from "./FindUser.module.css";
import { motion, AnimatePresence } from "framer-motion";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";
import { useEffect, useState } from "react";

function FindUser({ dropdownFeatures, setDropdownFeatures }) {
  const { verifyJoinCode, findUser } = useChatRoom();
  const [userDoesNotExist, setUserDoesNotExist] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    setIsEmpty(false);
    setUserDoesNotExist(false);
    setJoinCode("");
  }, [dropdownFeatures]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsEmpty(false);
    setUserDoesNotExist(false);

    if (joinCode.trim() === "") {
      setIsSearching(false);
      setIsEmpty(true);
      return;
    }

    try {
      setIsSearching(true);
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
