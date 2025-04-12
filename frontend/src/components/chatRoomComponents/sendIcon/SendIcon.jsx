import styles from "./SendIcon.module.css";
function SendIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.SendIcon}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
    </svg>
  );
}

export default SendIcon;
