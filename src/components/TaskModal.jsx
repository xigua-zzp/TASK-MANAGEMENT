import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import dataService from '../services/dataService';

/**
 * 任务弹窗组件
 * @param {Object} props
 * @param {Object|null} props.task - 编辑时传入的任务对象，为空表示新建
 * @param {Array} props.dataSource - 任务数据源（嵌套数组）
 * @param {Function} props.onSave - 保存回调
 * @param {Function} props.onClose - 关闭回调
 * @param {Function} props.onDelete - 删除回调（编辑模式）
 */
function TaskModal({ task, projectId, onSave, onClose, onDelete }) {
  // 获取可选的父任务列表（扁平结构，只包含 level 0 和 level 1）
  const availableParents = useMemo(() => {
    if (!projectId) return [];
    return dataService.getAvailableParents(projectId, task?.id);
  }, [projectId, task?.id]);

  // 辅助函数：去除 estimate 值中的 'h' 后缀，用于输入框显示
  const stripEstimateH = (value) => {
    if (!value) return '';
    return String(value).replace(/h$/, '');
  };

  const [formData, setFormData] = useState(() => ({
    title: '',
    description: '',
    status: task?.status || 'Not Started',
    priority: 'Medium',
    parentId: task?.parentId || null,
    progress: task?.progress ?? 0,
    estimate: stripEstimateH(task?.estimate),
    budget: task?.budget ?? ''
  }));
  const [errors, setErrors] = useState({});
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const parentRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        parentId: task.parentId || null,
        progress: task.progress ?? 0,
        estimate: stripEstimateH(task.estimate),
        budget: task.budget ?? ''
      });
    }
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (parentRef.current && !parentRef.current.contains(e.target)) {
        setIsParentOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    const estimateValue = String(formData.estimate || '').replace(/h$/, '');

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!estimateValue.trim()) {
      newErrors.estimate = 'Estimate is required';
    } else if (parseInt(estimateValue) <= 0) {
      newErrors.estimate = 'Estimate must be greater than 0';
    }
    if (!String(formData.budget || '').trim()) {
      newErrors.budget = 'Budget is required';
    } else if (parseInt(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 去除 estimate 中可能存在的 'h' 后缀，避免重复添加
    const estimateValue = String(formData.estimate || '').replace(/h$/, '');

    onSave({
      ...formData,
      // estimate 存储为带 'h' 后缀的字符串
      estimate: estimateValue ? `${estimateValue}h` : '',
      parentId: formData.parentId || null
    });
  };

  const handleChange = (field, value) => {
    let newValue = value;
    let newProgress = formData.progress;
    let newStatus = formData.status;

    // 输入限制
    if (field === 'title') {
      newValue = value.slice(0, 100); // 最多100个字符
    } else if (field === 'description') {
      newValue = value.slice(0, 500); // 最多500个字符
    } else if (field === 'estimate') {
      // 只能是数字，最多8位
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
      if (parseInt(newValue) > 99999999) newValue = '99999999';
    } else if (field === 'budget') {
      // 只能是数字，最多10位
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      if (parseInt(newValue) > 9999999999) newValue = '9999999999';
    }

    // 状态与进度联动逻辑
    if (field === 'status') {
      newStatus = value;
      if (value === 'Done') {
        newProgress = 100;
      } else if (value === 'Not Started') {
        newProgress = 0;
      }
    } else if (field === 'progress') {
      newProgress = value;
      if (value === 100) {
        newStatus = 'Done';
      } else if (value === 0) {
        newStatus = 'Not Started';
      } else if (newStatus === 'Done' || newStatus === 'Not Started') {
        newStatus = 'In Progress';
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: newValue,
      progress: newProgress,
      status: newStatus
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#121212] border-[#333333] p-0 w-[560px] max-w-[560px]">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-[32px] pt-[28px] pb-[16px]">
          <DialogTitle className="text-[26px] font-serif font-semibold text-white leading-none">
            {task ? 'Edit Task' : 'New Task'}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-[20px] px-[32px] pb-[28px]">
          {/* Task Name */}
          <div>
            <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
              Task Name
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full h-[44px] bg-[#1E1E1E] border ${errors.title ? 'border-red-500' : 'border-[#333333]'} rounded-[8px] px-[16px] py-[14px] text-[#CCCCCC] text-[14px] leading-[1.4] focus:outline-none focus:border-[#D4AF37] focus:bg-[#222222] transition-all placeholder:text-[#666666]`}
              placeholder="Enter task name"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-[#666666] text-xs mt-1 text-right">{formData.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#999999] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
              Description <span className="text-[#666666]">(Optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full h-[100px] bg-[#1E1E1E] border border-[#333333] rounded-[8px] px-[16px] py-[14px] text-[#CCCCCC] text-[14px] leading-[1.4] focus:outline-none focus:border-[#D4AF37] focus:bg-[#222222] transition-all resize-none placeholder:text-[#666666]"
              placeholder="Enter description"
            />
            <p className="text-[#666666] text-xs mt-1 text-right">{formData.description.length}/500</p>
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
              Status
            </label>
            <div className="flex gap-[12px] h-[40px]">
              {['Not Started', 'In Progress', 'Blocked', 'Done'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChange('status', status);
                  }}
                  className={`
                    px-[20px] py-[10px] rounded-[8px] text-[14px] cursor-pointer transition-all outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                    ${formData.status === status
                      ? 'bg-[#4B410F] text-[#D4AF37] font-medium border-2 border-[#D4AF37]'
                      : 'bg-[#1E1E1E] text-[#888888] font-normal border-2 border-[#333333] hover:bg-[#2A2A2A] hover:text-[#AAAAAA]'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Parent Task */}
          <div ref={parentRef} className="relative">
            <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
              Parent Task
            </label>
            <div
              onClick={() => setIsParentOpen(!isParentOpen)}
              className="w-full h-[44px] bg-[#1E1E1E] border border-[#333333] rounded-[8px] px-[16px] flex items-center justify-between cursor-pointer hover:border-[#D4AF37] transition-colors"
            >
              <span className="text-[#CCCCCC] text-[14px]">
                {formData.parentId
                  ? availableParents.find(p => p.id === formData.parentId)?.title || 'Select parent'
                  : 'No parent'}
              </span>
              {isParentOpen ? (
                <CaretDownOutlined style={{ fontSize: 12, color: '#666' }} />
              ) : (
                <CaretRightOutlined style={{ fontSize: 12, color: '#666' }} />
              )}
            </div>

            {/* Dropdown */}
            {isParentOpen && (
              <div className="absolute top-full left-0 right-0 mt-[4px] bg-[#1E1E1E] border border-[#333333] rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.3)] z-10 overflow-hidden max-h-[200px] overflow-y-auto">
                <div
                  onClick={() => {
                    handleChange('parentId', null);
                    setIsParentOpen(false);
                  }}
                  className="h-[40px] px-[16px] flex items-center text-[#CCCCCC] text-[14px] hover:bg-[#FFD93D33] hover:text-[#FFD93D] cursor-pointer transition-colors"
                >
                  No parent
                </div>
                {availableParents.map((parent) => (
                  <div
                    key={parent.id}
                    onClick={() => {
                      handleChange('parentId', parent.id);
                      setIsParentOpen(false);
                    }}
                    className="h-[40px] px-[16px] flex items-center text-[#CCCCCC] text-[14px] hover:bg-[#FFD93D33] hover:text-[#FFD93D] cursor-pointer transition-colors"
                    style={{ paddingLeft: parent.level === 1 ? '32px' : '16px' }}
                  >
                    {parent.level === 1 && (
                      <span className="mr-[8px] text-[#666]">└─</span>
                    )}
                    {parent.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
              Progress
            </label>
            <div className="flex items-center gap-[16px]">
              <div className="relative flex-1 h-[6px] bg-[#2A2A2A] rounded-[3px]">
                <div
                  className="absolute h-full bg-[#D4AF37] rounded-[3px]"
                  style={{ width: `${formData.progress}%` }}
                />
                <div
                  className="absolute w-[12px] h-[12px] bg-[#D4AF37] rounded-full cursor-pointer"
                  style={{ left: `calc(${formData.progress}% - 6px)`, top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[#D4AF37] text-[14px] font-medium w-[48px] text-right">{formData.progress}%</span>
            </div>
          </div>

          {/* Estimate & Budget */}
          <div className="flex gap-[16px]">
            <div className="flex-1">
              <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
                Estimate (hours) <span className="text-[#FF6B6B]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimate}
                onChange={(e) => handleChange('estimate', e.target.value)}
                className={`w-full h-[44px] bg-[#1E1E1E] border ${errors.estimate ? 'border-red-500' : 'border-[#333333]'} rounded-[8px] px-[16px] py-[14px] text-[#CCCCCC] text-[14px] focus:outline-none focus:border-[#D4AF37] focus:bg-[#222222] transition-all placeholder:text-[#666666] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none`}
                placeholder="Required"
              />
              {errors.estimate && (
                <p className="text-red-500 text-sm mt-1">{errors.estimate}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[#D4AF37] text-[12px] font-medium uppercase tracking-wide mb-[8px]">
                Budget ($) <span className="text-[#FF6B6B]">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className={`w-full h-[44px] bg-[#1E1E1E] border ${errors.budget ? 'border-red-500' : 'border-[#333333]'} rounded-[8px] px-[16px] py-[14px] text-[#CCCCCC] text-[14px] focus:outline-none focus:border-[#D4AF37] focus:bg-[#222222] transition-all placeholder:text-[#666666] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none`}
                placeholder="Required"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-[16px]">
            <div className="flex gap-[12px]">
              {task && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-[32px] py-[14px] bg-[#FF6B6B1A] text-[#FF6B6B] text-[14px] font-medium rounded-[8px] border-2 border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-[#121212] hover:border-[#FF6B6B] transition-all cursor-pointer"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-[32px] py-[14px] bg-[#1E1E1E] text-[#888888] text-[14px] font-medium rounded-[8px] border-2 border-transparent hover:border-[#FFD93D] hover:text-[#AAAAAA] active:bg-[#FFD93D] active:text-[#121212] active:border-[#FFD93D] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <button
              type="submit"
              className="px-[32px] py-[14px] text-[#121212] text-[14px] font-semibold rounded-[8px] shadow-[0_2px_8px_rgba(255,215,61,0.4)] hover:shadow-[0_0_12px_rgba(255,215,61,0.6)] transition-all cursor-pointer bg-[linear-gradient(135deg,#FFD93D_0%,#FFC700_100%)] hover:bg-[linear-gradient(135deg,#FFE44D_0%,#FFD700_100%)] active:bg-[linear-gradient(135deg,#E5C100_0%,#E6B800_100%)]"
            >
              Save Task
            </button>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#1E1E1E] border border-[#333333] rounded-[12px] p-[24px] w-[360px]">
              <h3 className="text-[18px] font-semibold text-white mb-[8px]">Delete Task</h3>
              <p className="text-[#888888] text-[14px] mb-[24px]">
                Are you sure you want to delete "{task?.title}"? This action cannot be undone and will also delete all child tasks.
              </p>
              <div className="flex justify-end gap-[12px]">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-[24px] py-[10px] bg-[#1E1E1E] text-[#888888] text-[14px] font-medium rounded-[8px] border-2 border-[#333333] hover:border-[#888888] hover:text-[#AAAAAA] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onClose();
                    onDelete?.(task.id);
                  }}
                  className="px-[24px] py-[10px] bg-[#FF6B6B] text-[#121212] text-[14px] font-semibold rounded-[8px] hover:bg-[#E55555] transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TaskModal;
