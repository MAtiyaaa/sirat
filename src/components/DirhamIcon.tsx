interface DirhamIconProps {
  className?: string;
  size?: number;
}

export const DirhamIcon = ({ className = "", size = 20 }: DirhamIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* New UAE Dirham Symbol - Stylized د.إ */}
      <path d="M20 30 L20 70 L30 70 L30 40 L50 40 L50 30 Z" />
      <circle cx="42" cy="75" r="3" />
      <path d="M60 30 L60 50 Q60 65 70 70 L80 70 L80 30 L70 30 L70 62 Q65 58 65 50 L65 30 Z" />
    </svg>
  );
};
