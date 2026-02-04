import sampleData from '../sample-data.json';

const STORAGE_KEY = 'taskManagementApp';

class DataService {
  constructor() {
    this.data = null;
    this.initialize();
  }

  initialize() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.data = JSON.parse(stored);
      // Migrate existing data to include new fields
      this.migrateData();
    } else {
      this.data = this.processSampleData(sampleData);
      this.save();
    }
  }

  migrateData() {
    let needsSave = false;
    // Add progress field to tasks if missing
    this.data.tasks.forEach(task => {
      if (task.progress === undefined) {
        task.progress = 0;
        needsSave = true;
      }
      if (task.estimate === undefined) {
        task.estimate = null;
        needsSave = true;
      }
      if (task.budget === undefined) {
        task.budget = null;
        needsSave = true;
      }
    });
    if (needsSave) {
      this.save();
    }
  }

  processSampleData(data) {
    return {
      projects: data.projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        taskCount: p.taskCount,
        completedCount: p.completedCount,
        status: p.status,
        lastUpdated: p.lastUpdated
      })),
      tasks: data.tasks.map(t => ({
        id: t.id,
        projectId: t.projectId,
        parentId: t.parentId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        progress: t.progress,
        estimate: t.estimate,
        budget: t.budget
      }))
    };
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getProjects() {
    return this.data.projects;
  }

  getProject(id) {
    return this.data.projects.find(p => p.id == id);
  }

  getTasks(projectId) {
    // 使用 == 兼容 projectId 可能是字符串或数字
    return this.data.tasks.filter(t => t.projectId == projectId);
  }

  getTask(id) {
    return this.data.tasks.find(t => t.id === id);
  }

  getChildTasks(parentId) {
    return this.data.tasks.filter(t => t.parentId === parentId);
  }

  createTask(task) {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      projectId: task.projectId,
      parentId: task.parentId || null
    };
    this.data.tasks.push(newTask);

    // Update project task count and lastUpdated
    const project = this.getProject(task.projectId);
    if (project) {
      project.taskCount += 1;
      project.lastUpdated = new Date().toISOString();
    }

    this.save();
    return newTask;
  }

  updateTask(id, updates) {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldTask = this.data.tasks[index];
    const newTask = { ...oldTask, ...updates };
    this.data.tasks[index] = newTask;

    this.save();
    return newTask;
  }

  deleteTask(id) {
    const task = this.getTask(id);
    if (!task) return false;

    // Delete all child tasks recursively
    const deleteRecursive = (taskId) => {
      const children = this.getChildTasks(taskId);
      children.forEach(child => deleteRecursive(child.id));
      const index = this.data.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        this.data.tasks.splice(index, 1);
        const project = this.getProject(task.projectId);
        if (project) {
          project.taskCount -= 1;
        }
      }
    };

    deleteRecursive(id);

    // Update project lastUpdated
    if (task) {
      const project = this.getProject(task.projectId);
      if (project) {
        project.lastUpdated = new Date().toISOString();
      }
    }

    this.save();
    return true;
  }

  getRootTasks(projectId) {
    return this.data.tasks.filter(t => t.projectId == projectId && !t.parentId);
  }

  buildTaskTree(projectId) {
    const rootTasks = this.getRootTasks(projectId);
    return rootTasks.map(task => ({
      ...task,
      children: this.buildTaskChildren(task.id)
    }));
  }

  buildTaskChildren(parentId) {
    const children = this.getChildTasks(parentId);
    return children.map(child => ({
      ...child,
      children: this.buildTaskChildren(child.id)
    }));
  }

  getAvailableParents(projectId, excludeTaskId = null) {
    const tasks = this.getTasks(projectId);
    const result = [];

    // 遍历任务，获取第一层和第二层
    const traverse = (task, depth) => {
      if (task.id === excludeTaskId) return;
      // depth 0: 第一层, depth 1: 第二层, depth >= 2: 不添加
      if (depth < 2) {
        result.push({ id: task.id, title: task.title, level: depth });
      }
      if (depth < 2) {
        const children = this.getChildTasks(task.id);
        children.forEach(child => traverse(child, depth + 1));
      }
    };

    // 从第一层任务开始
    tasks.filter(t => !t.parentId).forEach(t => traverse(t, 0));

    return result;
  }
}

export const dataService = new DataService();
export default dataService;
