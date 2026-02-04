import React from 'react';

function PriorityBadge({ priority }) {
  const priorityConfig = {
    'High': {
      className: 'w-2 h-2 rounded-full bg-red-500',
      label: 'High'
    },
    'Medium': {
      className: 'w-2 h-2 rounded-full bg-orange-500',
      label: 'Medium'
    },
    'Low': {
      className: 'w-2 h-2 rounded-full bg-green-500',
      label: 'Low'
    }
  };

  const config = priorityConfig[priority] || priorityConfig['Medium'];

  return (
    <div className="flex items-center gap-1.5" title={config.label}>
      <span className={config.className} />
    </div>
  );
}

export default PriorityBadge;
