import React from 'react';

/**
 * StatusButton - 专门用于 Task Modal 中的状态选择按钮
 * 解决抖动问题：使用统一的 border + box-shadow 方案
 */
export function StatusButton({ status, isSelected, onClick }) {
  const statusConfig = {
    'Not Started': { label: 'Not Started', color: '#999999', bgColor: '#99999933' },
    'In Progress': { label: 'In Progress', color: '#FFD93D', bgColor: '#FFD93D33' },
    'Blocked': { label: 'Blocked', color: '#FF6B6B', bgColor: '#FF6B6B33' },
    'Done': { label: 'Done', color: '#10B981', bgColor: '#10B98133' }
  };

  const config = statusConfig[status] || statusConfig['Not Started'];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #333333',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.15s ease',
        backgroundColor: isSelected ? config.bgColor : '#1E1E1E',
        color: isSelected ? config.color : '#888888',
        boxShadow: isSelected ? `inset 0 0 0 1px ${config.color}` : 'none',
        minWidth: 'unset',
        height: '40px',
        boxSizing: 'border-box'
      }}
    >
      {config.label}
    </button>
  );
}

export default StatusButton;
