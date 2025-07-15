import styles from "./UserPortion.module.css";
import UserLabel from "../../../general/UserLabel/UserLabel";
import useAuth from "../../../../contexts/auth/useAuth";
import { useEffect } from "react";
import { useState } from "react";
function UserPortion({ className }) {
  const { user, setUser } = useAuth();
  const [cacheBuster, setCacheBuster] = useState(Math.random());

  console.log(user);

  useEffect(() => {
    setCacheBuster(Math.random());
    console.log("[UserPortion] profilePicture URL:", user.profilePicture?.url);
  }, [user.profilePicture?.url]);

  return (
    <div className={className}>
      <div className={styles.container}>
        <UserLabel
          key={(user.profilePicture?.url || "") + cacheBuster}
          imgStyling={styles.profilePic}
          className={styles.userLabel}
          name={user.username}
          imgSize={37}
          src={
            user.profilePicture?.url
              ? user.profilePicture.url + "?t=" + cacheBuster
              : null
          }
        />
      </div>
    </div>
  );
}

export default UserPortion;
