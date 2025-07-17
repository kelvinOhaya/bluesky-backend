const LeaveIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Door */}
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8v-2H6V4h8V2z" />
    {/* Door knob */}
    <circle cx="9" cy="12" r="1" />
    {/* Arrow */}
    <path d="M19 12l-4-4v3H10v2h5v3l4-4z" />
  </svg>
);

export default LeaveIcon;
