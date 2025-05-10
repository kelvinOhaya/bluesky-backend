import styles from "./Textbar.module.css";
import SendIcon from "../../general/icons/sendIcon/SendIcon";
import "../../../styles/global.css";
import { useState } from "react";

function Textbar({ className }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className={className}>
      <div className={styles.container}>
        <form action="#">
          <input type="text" />
          <button
            className={styles.sendButton}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <SendIcon color={isHovering ? "#FFFFFF" : "#0D4AE2"} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Textbar;
