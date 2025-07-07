import styles from "./ChangeName.module.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChatRoom from "../../../../../contexts/chatRoom/useChatRoom";
import api from "../../../../../utils/api";

function ChangeName({ dropdownFeatures, setDropdownFeatures }) {
  const { currentChat, changeName } = useChatRoom();
  const [newName, setNewName] = useState("");
  const [errors, setErrors] = useState({
    fieldIsEmpty: false,
    nameHasNotChanged: false,
  });

  useEffect(() => {
    setErrors({ fieldIsEmpty: false, nameHasNotChanged: false });
  }, [dropdownFeatures]);

  const handleNameChange = async (e) => {
    e.preventDefault();

    if (newName === "") {
      setErrors({ errors, fieldIsEmpty: true });
      return;
    }

    if (newName === currentChat.name) {
      setErrors({ errors, nameHasNotChanged: true });
      return;
    }

    await changeName(newName);
    setNewName("");
    setDropdownFeatures({ dropdownFeatures, changeName: false });
  };
  return (
    <AnimatePresence>
      {dropdownFeatures.changeName && (
        <motion.div
          initial={{ left: "400px" }}
          animate={{ left: "50%" }}
          exit={{ left: "105%" }}
          className={styles.container}
        >
          <p>Enter new name:</p>
          <form onSubmit={handleNameChange}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {errors.fieldIsEmpty && (
              <p className={styles.error}>*Please fill out the field first</p>
            )}
            {errors.nameHasNotChanged && (
              <p className={styles.error}>*This is the same name</p>
            )}
            <span className={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => {
                  setDropdownFeatures({ dropdownFeatures, changeName: false });
                  setNewName("");
                }}
              >
                Cancel
              </button>
              <button type="submit">Change Name</button>
            </span>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChangeName;
