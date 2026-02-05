import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataService from '../services/dataService';

function ProjectCard({ project }) {
  const navigate = useNavigate();

  // 动态计算完成数量
  const tasks = dataService.getTasks(project.id);
  const completedCount = tasks.filter(t => t.status === 'Done').length;
  const progress = project.taskCount > 0
    ? Math.round((completedCount / project.taskCount) * 100)
    : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="
        rounded-[16px]
        shadow-[0_4px_20px_rgba(0,0,0,0.3)]
        p-[22px]
        cursor-pointer
        transition-all
        duration-300
        border-2
        border-transparent
        hover:border-[#D4AF37]
        hover:shadow-[0_4px_24px_rgba(212,175,55,0.2)]
        hover:-translate-y-1
      "
      style={{ flex: '0 0 calc((100% - 64px) / 3)', minWidth: '320px', background: 'linear-gradient(90deg, #1A1A1A 0%, #2A2A2A 100%)' }}
    >
      {/* Title */}
      <h3 className="font-serif text-[24px] text-white font-semibold mb-4 leading-tight select-none">
        {project.title}
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-[#333333] rounded-[4px] overflow-hidden">
          <div
            className="h-full bg-[#FFD700] rounded-[4px] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="flex flex-row justify-between items-center">
        {/* Left: Task count & Updated time */}
        <div className="flex flex-col gap-1">
          <span className="text-[#888888] text-sm">
            {project.taskCount} tasks
          </span>
          <span className="text-[#666666] text-xs">
            Updated {formatDate(project.lastUpdated)}
          </span>
        </div>

        {/* Right: Status badge */}
        <div className={`
          px-3 py-1 rounded-lg text-sm font-medium
          ${project.status === 'On Track' || project.status === 'Done'
            ? 'bg-[#6DD47E33] text-[#6DD47E]'
            : 'bg-[#FFD93D33] text-[#FFD93D]'
          }
        `}>
          {project.status === 'On Track' ? 'On Track' : project.status}
        </div>
      </div>
    </div>
  );
}

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(dataService.getProjects());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-[64px] py-[48px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[40px]">
        <h2 className="font-serif text-[48px] font-semibold text-white select-none">
          Projects
        </h2>
        <button
          className="
            bg-[#FFD93D]
            text-[#0A0A0A]
            text-[14px]
            font-semibold
            px-6
            py-3
            rounded-[8px]
            shadow-[0_2px_8px_rgba(255,215,61,0.4)]
            hover:shadow-[0_0_12px_rgba(255,215,61,0.6)]
            active:shadow-[0_1px_4px_rgba(212,175,55,0.3)]
            transition-all
            cursor-pointer
            bg-[linear-gradient(135deg,#FFD93D_0%,#FFC700_100%)]
            hover:bg-[linear-gradient(135deg,#FFE44D_0%,#FFD700_100%)]
            active:bg-[linear-gradient(135deg,#E5C100_0%,#E6B800_100%)]
          "
        >
          New Project
        </button>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-wrap gap-[32px]">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectsList;
