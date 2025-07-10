import styles from "./NewGroupForm.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useAuth from "../../../../../../contexts/auth/useAuth";
import useChatRoom from "../../../../../../contexts/chatRoom/useChatRoom";

function NewGroupForm({ dropdownFeatures, setDropdownFeatures }) {
  const [groupName, setGroupName] = useState("");
  const { createGroup } = useChatRoom();

  const toggleSearchOff = (e) => {
    e.preventDefault();
    setDropdownFeatures({ ...dropdownFeatures, createGroupChat: false });
    setGroupName("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    await createGroup(groupName);
    setGroupName("");
    setDropdownFeatures({ ...dropdownFeatures, createGroupChat: false });
  };

  return (
    <AnimatePresence>
      {dropdownFeatures.createGroupChat && (
        <motion.div
          initial={{ left: "-50%" }}
          animate={{ left: "50%" }}
          exit={{ left: "150%", transition: { duration: "0.7" } }}
          transition={{ duration: "0.3" }}
          className={styles.container}
        >
          <form onSubmit={handleCreateGroup}>
            <label>What will be your group name? </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                console.log(groupName);
              }}
            />
            <span>
              <button onClick={toggleSearchOff}>Cancel</button>
              <button type="submit">Make Group</button>
            </span>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NewGroupForm;
