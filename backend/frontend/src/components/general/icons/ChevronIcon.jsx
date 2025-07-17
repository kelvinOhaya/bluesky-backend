const ChevronIcon = ({
  direction = "right",
  size = 24,
  color = "currentColor",
  className,
}) => {
  const rotations = {
    right: "0",
    down: "90",
    left: "180",
    up: "270",
  };

  const rotation = rotations[direction] || "0";

  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: `rotate(${rotation}deg)` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
};

export default ChevronIcon;
