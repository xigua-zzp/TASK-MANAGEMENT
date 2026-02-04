import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import { TaskTable } from '../components/AntdTaskTable';
import { transformTasksForTable } from '../lib/dataTransform';
import ProgressRingWithText from '../components/ProgressRingWithText';
import dataService from '../services/dataService';

// 项目概览卡片组件
function OverviewCard({ label, value, progress }) {
  return (
    <div className="overview-card">
      <div className="overview-content">
        {progress !== undefined ? (
          <div className="overview-progress">
            <ProgressRingWithText progress={progress} size={70} strokeWidth={7} fontSize="24px" fontFamily="'Playfair Display', serif" />
          </div>
        ) : (
          <div className="overview-value">{value}</div>
        )}
        <div className="overview-label">{label}</div>
      </div>
    </div>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // 初始化项目数据和任务数据
  useEffect(() => {
    const proj = dataService.getProject(id);
    const tasks = dataService.getTasks(id);
    const { totalCount, completedCount, totalBudget } = calculateStats(tasks);

    if (proj) {
      setProject({
        ...proj,
        taskCount: totalCount,
        completedCount,
        budget: totalBudget
      });
    }
    setTaskData(transformTasksForTable({ tasks }));
  }, [id]);

  // 计算统计数据
  const calculateStats = (tasks) => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'Done').length;
    // 使用 Number() 转换确保是数值相加，避免字符串拼接
    const totalBudget = tasks.reduce((sum, t) => sum + Number(t.budget || 0), 0);
    return { totalCount, completedCount, totalBudget };
  };

  // 保存/删除后刷新数据
  const refreshData = () => {
    const tasks = dataService.getTasks(id);
    const { totalCount, completedCount, totalBudget } = calculateStats(tasks);

    setProject(prev => ({
      ...prev,
      taskCount: totalCount,
      completedCount,
      budget: totalBudget
    }));
    setTaskData(transformTasksForTable({ tasks }));
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = () => {
    if (selectedTaskId) {
      const task = dataService.getTask(selectedTaskId);
      setEditingTask(task);
      setShowModal(true);
    }
  };

  const handleDoubleClickTask = (record) => {
    const task = dataService.getTask(record.id);
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      dataService.updateTask(editingTask.id, taskData);
    } else {
      dataService.createTask({
        ...taskData,
        projectId: id,
        status: 'Not Started'
      });
    }
    refreshData();
    setShowModal(false);
    setSelectedTaskId(null);
  };

  const handleDeleteTask = (taskId) => {
    if (taskId) {
      dataService.deleteTask(taskId);
      refreshData();
      setSelectedTaskId(null);
    }
  };

  if (!project) {
    return (
      <div className="project-detail">
        <div className="not-found">Project not found</div>
      </div>
    );
  }

  const progress = project.taskCount > 0
    ? Math.round((project.completedCount / project.taskCount) * 100)
    : 0;

  const formatBudget = (amount) => {
    if (!amount) return '$0';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="project-detail">
      <main className="detail-content">
        {/* 面包屑导航 */}
        <nav className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/projects')}>Projects</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{project.title}</span>
        </nav>

        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title">{project.title}</h1>
          <button className="add-task-btn" onClick={handleAddTask}>Add Task</button>
        </div>
        <div className="title-underline" />

        {/* 项目概览 */}
        <div className="overview-section">
          <OverviewCard
            label="COMPLETE"
            progress={progress}
          />
          <OverviewCard
            label="Total Budget"
            value={formatBudget(project.budget || 45000)}
          />
          <OverviewCard
            label="TOTAL Tasks"
            value={project.taskCount}
          />
        </div>

          <TaskTable
            dataSource={taskData}
            onRow={(record) => ({
              onClick: () => setSelectedTaskId(record.id === selectedTaskId ? null : record.id),
            })}
            onDoubleClick={handleDoubleClickTask}
          />
      </main>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          projectId={id}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetail;
