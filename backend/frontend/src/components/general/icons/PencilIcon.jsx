const PencilIcon = ({ size = 24, className }) => {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={"currentColor"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.69 3.86l5.45 5.45-1.41 1.41-5.45-5.45 1.41-1.41zm-1.41 1.41L4 14.55V20h5.45l9.28-9.28-5.45-5.45zM3 21h6.25c.41 0 .75-.34.75-.75V15h-2v4.25H3v2z" />
      </svg>
    </div>
  );
};

export default PencilIcon;
