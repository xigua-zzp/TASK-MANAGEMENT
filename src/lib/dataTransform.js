/**
 * 将 sample-data.json 的 tasks 数据转换为嵌套结构（用于 AntD Tree Table）
 * @param {Object} data - sample-data.json 格式的数据对象
 * @param {string} [projectId] - 可选的项目ID，传入则只返回该项目的任务
 * @returns {Array} 嵌套的任务数组
 */
export function transformTasksForTable(data, projectId = null) {
  let tasks = data.tasks;

  // 如果指定了 projectId，则过滤出该项目下的任务
  if (projectId) {
    tasks = tasks.filter(task => task.projectId === projectId);
  }

  // 构建嵌套结构
  const taskMap = {};
  const roots = [];

  // 先遍历所有任务，创建映射
  tasks.forEach(task => {
    taskMap[task.id] = { ...task, children: [] };
  });

  // 建立父子关系
  tasks.forEach(task => {
    if (task.parentId && taskMap[task.parentId]) {
      taskMap[task.parentId].children.push(taskMap[task.id]);
    } else {
      roots.push(taskMap[task.id]);
    }
  });

  // 递归设置层级和标记最后一个节点
  const setLevel = (items, level = 0) => {
    items.forEach((item, index) => {
      item.level = level;
      // 标记是否为当前层的最后一个节点
      item.isLastInLevel = index === items.length - 1;
      if (item.children && item.children.length > 0) {
        setLevel(item.children, level + 1);
      }
    });
  };

  setLevel(roots);

  return roots;
}
