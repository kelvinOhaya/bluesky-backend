import UserLabel from "../../general/UserLabel/UserLabel";
import UserPortion from "../UserPortion/UserPortion";
import styles from "./ChatsTab.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
function ChatsTab({ className }) {
  const [chats, setChats] = useState([
    { name: "Group 1", src: "" },
    { name: "Group 2", src: "" },
    { name: "Group 3", src: "" },
  ]);

  useEffect(() => {
    const handleDblClick = () => {
      setChats((prevChats) => [...prevChats, { name: "Pressed", src: "" }]);
      console.log("Added");
    };

    window.addEventListener("dblclick", handleDblClick);

    return () => {
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, []);

  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <UserPortion />
      {chats.map((chat, key) => {
        return (
          <button className={styles.tabButton} style={{ overflow: "hidden" }}>
            <UserLabel
              key={key}
              className={styles.userLabel}
              name={chat.name}
              orientation={"horizontal"}
            />
          </button>
        );
      })}
    </div>
  );
}

export default ChatsTab;
