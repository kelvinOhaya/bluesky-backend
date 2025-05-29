// ProfilePic.jsx
// This component displays a user's profile picture in a circular frame.
// Props:
// - src: Image source URL
// - alt: Alt text for the image
// - className: Optional class for outer div styling

function ProfilePic({ src, alt, size = 24 }) {
  return (
    <img
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid black",
      }}
      src={src}
      alt={alt}
    />
  );
}

export default ProfilePic;
