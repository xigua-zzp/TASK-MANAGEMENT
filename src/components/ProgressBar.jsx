import React from 'react';

function ProgressBar({ progress = 0, showLabel = false, size = 'medium' }) {
  const heights = {
    small: 'h-1.5',
    medium: 'h-2',
    large: 'h-3'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className={`progress-bar ${heights[size]} bg-cream-200 rounded-full overflow-hidden`}>
        <div
          className="progress-bar-fill bg-brown-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-brown-500 mt-1">{Math.round(clampedProgress)}%</span>
      )}
    </div>
  );
}

export default ProgressBar;
