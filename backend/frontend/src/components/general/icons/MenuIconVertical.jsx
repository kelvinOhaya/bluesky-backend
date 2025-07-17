import React from "react";

const MenuIconVertical = ({ size = 24, color = "currentColor", className }) => (
  <div className={className}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left line */}
      <rect x="6" y="4" width="2" height="16" rx="1" fill={color} />
      {/* Middle shorter line */}
      <rect x="11" y="8" width="2" height="8" rx="1" fill={color} />
      {/* Right line */}
      <rect x="16" y="4" width="2" height="16" rx="1" fill={color} />
    </svg>
  </div>
);

export default MenuIconVertical;
