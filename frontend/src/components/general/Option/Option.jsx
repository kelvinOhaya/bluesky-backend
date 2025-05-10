import styles from "./Option.module.css";

function option({ className, children }) {
  return (
    <div className={className}>
      <div className={styles.container}>
        <button className={styles.container}>{children}</button>
      </div>
    </div>
  );
}

export default option;
