import styles from "./SlidingNavbar.module.css";

function SlidingNavbar({ isOpen, onClose, children }) {
  return (
    <div className={`${styles.slidingNavbar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.overlay} onClick={onClose} />
      <nav className={styles.navbarContent}>{children}</nav>
    </div>
  );
}

export default SlidingNavbar;
