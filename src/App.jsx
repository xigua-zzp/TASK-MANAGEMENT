import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
}

export default App;
