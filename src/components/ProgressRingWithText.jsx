function ProgressRingWithText({ progress, size = 40, strokeWidth = 3, fontSize, fontFamily }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (progress === 0) return '#999999';
    if (progress < 33) return '#FF6B6B';
    if (progress < 99) return '#FFD93D';
    return '#10B981';
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`progress-gradient-${progress}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getColor()} stopOpacity="1" />
            <stop offset="100%" stopColor={getColor()} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle
          stroke="#2A2A2A"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
        />
        <circle
          stroke={`url(#progress-gradient-${progress})`}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke 0.3s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fontSize || '11px',
          fontWeight: 600,
          color: '#E5E5E5',
          fontFamily: fontFamily || 'inherit'
        }}
      >
        {progress}%
      </div>
    </div>
  );
}

export default ProgressRingWithText;
