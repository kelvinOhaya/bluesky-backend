import styles from "./ProfilePic.module.css";

function ProfilePic({ src, alt, className }) {
  return <img className={className} src={src} alt={alt} />;
}

export default ProfilePic;
