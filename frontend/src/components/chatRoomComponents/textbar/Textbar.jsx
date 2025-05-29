import styles from "./Textbar.module.css";
import SendIcon from "../../general/icons/SendIcon";
import "../../../styles/global.css";
import { useState } from "react";

function Textbar({ className }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className={className}>
      <div className={styles.container}>
        <form className={styles.form} action="#">
          <input type="text" className={styles.textBar} />
          <button
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

export default Textbar;
