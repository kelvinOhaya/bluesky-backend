import styles from "./UserPortion.module.css";
import UserLabel from "../../general/UserLabel/UserLabel";
function UserPortion({ className }) {
  return (
    <div className={className}>
      <div className={styles.container}>
        <UserLabel
          imgStyling={styles.profilePic}
          className={styles.userLabel}
          name={"Username"}
          imgSize={45}
        />
      </div>
    </div>
  );
}

export default UserPortion;
