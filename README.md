# Task Management Application

一个轻量级的任务管理应用，支持多项目管理、任务层级结构、进度追踪等功能。

## 功能特性

### 项目管理
- 创建和管理多个项目
- 项目卡片展示任务数量、完成进度、最后更新时间
- 支持按状态筛选（On Track / Done / Behind Schedule）

### 任务管理
- 创建、编辑、删除任务
- 支持三级任务层级结构（父任务 -> 子任务 -> 孙任务）
- 任务字段：
  - 标题（必填）
  - 描述（可选）
  - 状态（Not Started / In Progress / Blocked / Done）
  - 优先级（High / Medium / Low）
  - 进度（0-100% 滑块）
  - 预估工时（Estimate）
  - 预算（Budget）

### 任务层级
- 树形表格展示任务层级结构
- 支持展开/折叠子任务
- 父任务选择器限制为第一层和第二层任务
- 可视化缩进和连接线

### 数据持久化
- 本地存储（localStorage）
- 数据自动持久化

## 技术栈

### 前端框架
- **React 18** - UI 组件库
- **React Router DOM** - 路由管理

### UI 组件库
- **Ant Design (antd)** - 表格、对话框等组件
- **Radix UI** - 可访问性组件
- **Tailwind CSS** - 原子化 CSS
- **class-variance-authority** - CSS 变体管理
- **Lucide React** - 图标库
- **@ant-design/icons** - Ant Design 图标

### 构建工具
- **Webpack 5** - 模块打包
- **Babel** - JavaScript 转译
- **PostCSS** - CSS 处理
- **Tailwind CSS** - CSS 框架

### 开发工具
- **Hot Module Replacement** - 热更新

## 项目结构

```
src/
├── components/          # React 组件
│   ├── TaskModal.jsx       # 任务弹窗
│   ├── TaskTable.jsx       # 任务表格
│   ├── ProgressRingWithText.jsx  # 进度环形组件
│   └── ...
├── pages/              # 页面组件
│   ├── ProjectsList.jsx    # 项目列表
│   └── ProjectDetail.jsx   # 项目详情
├── services/           # 数据服务
│   └── dataService.js      # 本地数据管理
├── lib/                # 工具函数
│   └── dataTransform.js    # 数据转换
├── styles/             # 样式文件
│   └── index.css          # 全局样式
└── sample-data.json    # 初始数据
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## License

MIT
