import styles from "./ProfilePic.module.css";

function ProfilePic({ src, alt, className }) {
  return (
    <div className={className}>
      <img className={styles.profileImg} src={src} alt={alt} />
    </div>
  );
}

export default ProfilePic;
