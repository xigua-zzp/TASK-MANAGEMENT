import React from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

/**
 * 缩进指示线组件 - 在每个层级左侧显示垂直连接线
 * @param {number} level - 当前层级深度
 */
export function IndentLine({ level }) {
  const lines = [];
  for (let i = 0; i < level; i++) {
    lines.push(
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: '16px',
          height: '100%',
          borderRight: '1px solid #444',
          marginRight: '8px',
          verticalAlign: 'middle',
        }}
      />
    );
  }
  return <>{lines}</>;
}

/**
 * 带展开图标的缩进组件
 * @param {Object} props
 * @param {number} props.level - 当前层级深度
 * @param {boolean} props.expandable - 是否有子项
 * @param {boolean} props.expanded - 是否展开
 * @param {Function} props.onExpand - 展开回调
 * @param {Object} props.record - 当前行数据
 */
export function TreeIcon({ level, expandable, expanded, onExpand, record }) {
  return (
    <span
      style={{
        width: `${level * 24 + 24}px`,
      }}
    >
      <IndentLine level={level} />
      {expandable && (
        <span
          onClick={(e) => onExpand(record, e)}
          style={{
            cursor: 'pointer',
            color: expanded ? '#FFD93D' : '#888',
            marginLeft: '8px',
          }}
        >
          {expanded ? <DownOutlined /> : <RightOutlined />}
        </span>
      )}
    </span>
  );
}

export default { IndentLine, TreeIcon };
