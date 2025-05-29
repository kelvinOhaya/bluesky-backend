const ProfileIcon = ({ size = 48, color = "white", className }) => (
  <div className={className}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="12" cy="8" r="4" fill={color} />
      {/* Shoulders */}
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill={color} />
    </svg>
  </div>
);

export default ProfileIcon;
