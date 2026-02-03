"use client";

import React, { useState } from "react";
import { Plus, BookOpen, AlertCircle } from "react-feather";
import ModuleItem from "./ModuleItem";

const ContentTab = ({ modules, onUpdateModules, quizzes }) => {
  const [expandedModules, setExpandedModules] = useState([0]);

  const addModule = () => {
    const newModule = {
      title: "",
      description: "",
      order: modules.length + 1,
      status: modules.length === 0 ? "unlocked" : "locked",
      lessons: [
        {
          title: "",
          description: "",
          type: "video",
          videoUrl: "",
          duration: 0,
          order: 1,
          isPreview: modules.length === 0,
          status: modules.length === 0 ? "unlocked" : "locked",
          quizId: null,
          content: { instructions: "", resources: [] },
        },
      ],
    };
    
    const updatedModules = [...modules, newModule];
    onUpdateModules(updatedModules);
    setExpandedModules([...expandedModules, modules.length]);
  };

  const removeModule = (index) => {
    if (modules.length <= 1) return;
    
    const updatedModules = modules.filter((_, i) => i !== index);
    // Reorder modules
    const reorderedModules = updatedModules.map((mod, idx) => ({
      ...mod,
      order: idx + 1,
    }));
    
    onUpdateModules(reorderedModules);
    setExpandedModules(expandedModules.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    onUpdateModules(updatedModules);
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modules];
    const module = updatedModules[moduleIndex];
    const newLesson = {
      title: "",
      description: "",
      type: "video",
      videoUrl: "",
      duration: 0,
      order: module.lessons.length + 1,
      isPreview: false,
      status: "locked",
      quizId: null,
      content: { instructions: "", resources: [] },
    };
    
    module.lessons.push(newLesson);
    onUpdateModules(updatedModules);
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules];
    const module = updatedModules[moduleIndex];
    
    if (module.lessons.length <= 1) return;
    
    module.lessons = module.lessons.filter((_, i) => i !== lessonIndex);
    // Reorder lessons
    module.lessons = module.lessons.map((lesson, idx) => ({
      ...lesson,
      order: idx + 1,
    }));
    
    onUpdateModules(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules];
    
    if (field === null && value) {
      // Full lesson update
      updatedModules[moduleIndex].lessons[lessonIndex] = value;
    } else {
      // Single field update
      updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    }
    
    onUpdateModules(updatedModules);
  };

  const toggleModuleExpand = (index, isExpanded) => {
    if (isExpanded) {
      setExpandedModules([...expandedModules, index]);
    } else {
      setExpandedModules(expandedModules.filter(i => i !== index));
    }
  };

  // Calculate statistics
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalVideos = modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.type === "video").length, 0);
  const totalQuizzes = modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.type === "quiz").length, 0);
  const totalProjects = modules.reduce((sum, module) => 
    sum + module.lessons.filter(lesson => lesson.type === "project").length, 0);
  const totalDuration = modules.reduce((sum, module) => 
    sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0), 0);

  return (
    <div className="content-tab">
      <div className="tab-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">Course Content</h4>
            <p className="text-muted mb-0">Organize your course into modules and lessons</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addModule}
          >
            <Plus size={16} className="me-2" />
            Add Module
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">{modules.length}</div>
            <div className="stat-label">Modules</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">{totalLessons}</div>
            <div className="stat-label">Lessons</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">{totalDuration}</div>
            <div className="stat-label">Minutes</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-value">
              {totalVideos}V {totalQuizzes}Q {totalProjects}P
            </div>
            <div className="stat-label">Content</div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="modules-section">
        {modules.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="text-muted mb-3" />
            <h5>No modules yet</h5>
            <p className="text-muted">Start by adding your first module</p>
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addModule}
            >
              <Plus size={16} className="me-2" />
              Add First Module
            </button>
          </div>
        ) : (
          <div className="modules-list">
            {modules.map((module, index) => (
              <ModuleItem
                key={index}
                module={module}
                index={index}
                onUpdate={updateModule}
                onRemove={removeModule}
                onAddLesson={addLesson}
                onUpdateLesson={updateLesson}
                onRemoveLesson={removeLesson}
                quizzes={quizzes}
                isExpanded={expandedModules.includes(index)}
                onToggleExpand={toggleModuleExpand}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="alert alert-info mt-4">
        <AlertCircle size={16} className="me-2" />
        <strong>Tip:</strong> Organize content logically. Start with fundamentals, then progress to
        advanced topics. Use quizzes to test knowledge and projects for practical application.
      </div>

      <style jsx>{`
        .content-tab {
          animation: fadeIn 0.3s ease;
        }

        .tab-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .stat-card {
          background: #f8fafc;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: #6366f1;
          background: #f0f7ff;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #374151;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modules-section {
          margin-top: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: #f8fafc;
          border: 2px dashed #dee2e6;
          border-radius: 12px;
        }

        .modules-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ContentTab;