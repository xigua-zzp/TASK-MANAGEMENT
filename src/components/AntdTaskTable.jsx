import { useState } from 'react';
import { Table } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import ProgressRingWithText from './ProgressRingWithText';

/**
 * AntD Tree Table 任务表格组件
 * @param {Array} dataSource - 数据源，嵌套结构（包含 children）
 * @param {Object} props - 其他 antd Table 支持的属性
 */
export function TaskTable({ dataSource = [], selectedTaskId, onRow, onDoubleClick, ...props }) {
  // 展开状态管理 - 使用数组配合 AntD 的 expandedRowKeys
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // 切换展开/折叠 - 由 AntD Table 调用
  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(prev => {
      if (expanded) {
        return [...prev, record.id];
      } else {
        return prev.filter(key => key !== record.id);
      }
    });
  };

  // 状态颜色配置
  const statusConfig = {
    'Done': { color: '#10B981', bgColor: '#10B98133' },
    'In Progress': { color: '#FFD93D', bgColor: '#FFD93D33' },
    'Blocked': { color: '#FF6B6B', bgColor: '#FF6B6B33' },
    'Not Started': { color: '#999999', bgColor: '#99999933' },
    'Todo': { color: '#999999', bgColor: '#99999933' }
  };

  // 缩进配置
  const INDENT_SIZE = 24;

  // 表格列定义
  const columns = [
    {
      title: 'TASK NAME',
      dataIndex: 'title',
      key: 'title',
      width: 700,
      className: 'header-yellow',
      render: (text, record) => {
        const level = record.level || 0;
        const hasChildren = record.children && record.children.length > 0;
        const isLastInLevel = record.isLastInLevel;
        const isExpanded = expandedRowKeys.includes(record.id);
        // 最后一层的最后一个节点只显示半根垂直线
        const showHalfLine = level > 0 && isLastInLevel && !hasChildren;
        return (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* 缩进占位 - level-1 层 */}
            {level > 0 &&<span style={{ width: `${level * INDENT_SIZE}px`, flexShrink: 0 }} />}
            {/* 垂直连接线 - 最后一层最后节点显示半根，否则完整 */}
            {level > 0 && (
              <span
                style={{
                  width: '1px',
                  height: showHalfLine ? '18px' : '40px',
                  backgroundColor: '#444',
                  marginRight: '0px',
                  alignSelf: 'flex-start',
                }}
              />
            )}
            {/* 水平连接线 - 连接垂直线和展开图标，在顶部形成 L 型 */}
            {level > 0 && (
              <span
                style={{
                  width: '24px',
                  height: '1px',
                  backgroundColor: '#444',
                  marginRight: '4px',
                  alignSelf: 'flex-start',
                  marginTop: '18px',
                }}
              />
            )}
            {/* 缩进占位 */}
            <span style={{ width: `${INDENT_SIZE - 16}px`, flexShrink: 0 }} />
            {/* 展开/折叠图标或占位 */}
            <span style={{ width: '20px', flexShrink: 0, marginRight: '4px' }}>
              {hasChildren ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand(!isExpanded, record);
                  }}
                  style={{ cursor: 'pointer', color: '#888' }}
                >
                  {isExpanded ? <DownOutlined /> : <RightOutlined />}
                </span>
              ) : (
                <span style={{ width: '12px', display: 'inline-block' }} />
              )}
            </span>

            {/* 任务名称 */}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#E5E5E5' }}>
              {text}
            </span>
          </span>
        );
      }
    },
    
    {
      title: 'ESTIMATE',
      dataIndex: 'estimate',
      key: 'estimate',
      width: 90,
      align: 'right',
      className: 'header-yellow',
      render: (value,record) =>
      <div style={{ display: 'flex',justifyContent: 'flex-end',gap:'20px', alignItems: 'center' }}>
          <div style={{ width: 80, height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${record.progress}%`, height: '100%', backgroundColor: '#D4AF37', borderRadius: 3 }} />
          </div>
        <span style={{width: 50, fontSize: 13,font:'font family/Font 4', color: '#888' }}>{value ? (value.toString().endsWith('h') ? value : value + 'h') : '-'}</span>
      </div>
    },
     {
      title: 'BUDGET',
      dataIndex: 'budget',
      key: 'budget',
      width: 70,
      align: 'right',
      className: 'header-yellow',
      render: (value) => {
        if (!value) return '-';

        // 根据预算金额设置颜色
        let bgColor, color;
        if (value < 5000) {
          bgColor = '#10B98133';
          color = '#10B981';
        } else if (value < 8000) {
          bgColor = '#FFD93D33';
          color = '#FFD93D';
        } else {
          bgColor = '#FF6B6B33';
          color = '#FF6B6B';
        }

        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '5px 0',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 12px',
                borderRadius: 50,
                backgroundColor: bgColor,
                color: color
              }}
            >
              ${value.toLocaleString()}
            </span>
          </div>
        );
      }
    },
    {
      key: 'progressRing',
      title: 'PROGRESS',
      dataIndex: 'progress',
      key: 'progress',
      width: 70,
      align: 'center',
      className: 'header-yellow',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProgressRingWithText progress={record.progress || 0} size={36} strokeWidth={4} fontSize={10} />
        </div>
      )
    },

   
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      className: 'header-yellow',
      render: (status) => {
        const config = statusConfig[status] || statusConfig['Not Started'];
        return (
          <span
            className="task-status-badge"
            data-status={status}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 50,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              backgroundColor: config.bgColor,
              color: config.color
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', marginRight: 8, backgroundColor: config.color }} />
            {status}
          </span>
        );
      }
    }
  ];


  return (
    <div className="task-table-wrapper">
      <Table
        {...props}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{height:'calc(100vh - 500px)'}}
        scroll={{y:'calc(100vh - 580px)'}}
        indentSize={0}
        expandIconColumnIndex={-1}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        stripe
        className="task-table"
        onRow={(record) => ({
          ...onRow?.(record),
          style: { maxHeight: 48,padding: 'unset' },
          onDoubleClick: () => onDoubleClick?.(record)
        })}
      />
    </div>
  );
}

export default TaskTable;
