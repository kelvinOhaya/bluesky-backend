import styles from "./TextBar.module.css";
import SendIcon from "../../../general/icons/SendIcon";
import "../../../../styles/global.css";
import useChatRoom from "../../../../contexts/chatRoom/useChatRoom";
import useAuth from "../../../../contexts/auth/useAuth";
import { useState } from "react";

function TextBar({ className }) {
  const { user } = useAuth();
  const { sendMessage, currentChat } = useChatRoom();
  const [isHovering, setIsHovering] = useState(false);
  const [textValue, setTextValue] = useState("");
  return (
    <div className={className}>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (textValue === "") return;
            sendMessage(currentChat._id, textValue);
            setTextValue("");
          }}
        >
          <input
            type="text"
            className={styles.textBar}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <button
            type="submit"
            className={styles.sendButton}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <SendIcon isHovering={isHovering} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default TextBar;
