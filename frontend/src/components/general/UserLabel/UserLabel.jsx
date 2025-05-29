import styles from "./UserLabel.module.css";
import ProfilePic from "../ProfilePic/ProfilePic";
import DefaultProfile from "../../../assets/defaultProfile.jpg";

function UserLabel({ className, src, alt, name, orientation, imgSize }) {
  return (
    <div className={className}>
      <div
        className={
          orientation === "vertical"
            ? styles.containerVertical
            : styles.containerHorizontal
        }
      >
        <ProfilePic alt={alt} src={src ? src : DefaultProfile} size={imgSize} />
        <p>{name}</p>
      </div>
    </div>
  );
}

export default UserLabel;
