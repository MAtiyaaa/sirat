interface DirhamIconProps {
  className?: string;
  size?: number;
}

export const DirhamIcon = ({ className = "", size = 20 }: DirhamIconProps) => {
  return (
    <span 
      className={`inline-block ${className}`}
      style={{ 
        fontFamily: 'UAESymbol, sans-serif',
        fontSize: `${size}px`,
        fontWeight: 'bold',
        lineHeight: 1
      }}
    >
      {'\u00EA'}
    </span>
  );
};
