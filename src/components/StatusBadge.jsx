import React from 'react';

function StatusBadge({ status }) {
  const statusConfig = {
    'On Track': {
      className: 'bg-status-on-track text-white',
      label: 'On Track'
    },
    'At Risk': {
      className: 'bg-status-at-risk text-white',
      label: 'At Risk'
    },
    'Done': {
      className: 'bg-green-600 text-white',
      label: 'Done'
    },
    'In Progress': {
      className: 'bg-blue-500 text-white',
      label: 'In Progress'
    },
    'Not Started': {
      className: 'bg-gray-400 text-white',
      label: 'Not Started'
    },
    'Blocked': {
      className: 'bg-red-500 text-white',
      label: 'Blocked'
    }
  };

  const config = statusConfig[status] || {
    className: 'bg-gray-400 text-white',
    label: status
  };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
