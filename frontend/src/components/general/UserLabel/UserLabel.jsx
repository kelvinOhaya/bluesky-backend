import styles from "./UserLabel.module.css";
import ProfilePic from "../ProfilePic/ProfilePic";
import DefaultProfile from "../../../assets/defaultProfile.jpg";

function UserLabel({ className, src, alt, name, orientation, imgStyling }) {
  return (
    <div className={className}>
      <div
        className={
          orientation === "vertical"
            ? styles.containerVertical
            : styles.containerHorizontal
        }
      >
        <ProfilePic
          className={imgStyling}
          alt={alt}
          src={src ? src : DefaultProfile}
        />
        <h1>{name}</h1>
      </div>
    </div>
  );
}

export default UserLabel;
