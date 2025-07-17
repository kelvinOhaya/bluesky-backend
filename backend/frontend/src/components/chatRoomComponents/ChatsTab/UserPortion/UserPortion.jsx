import styles from "./UserPortion.module.css";
import UserLabel from "../../../general/UserLabel/UserLabel";
import useAuth from "../../../../contexts/auth/useAuth";

function UserPortion({ className }) {
  const { user } = useAuth();

  return (
    <div className={className}>
      <div className={styles.container}>
        <UserLabel
          imgStyling={styles.profilePic}
          className={styles.userLabel}
          name={user.username}
          imgSize={37}
          src={user.profilePicture?.url}
        />
      </div>
    </div>
  );
}

export default UserPortion;
