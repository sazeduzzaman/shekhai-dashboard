"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Plus, Lock, Unlock } from "react-feather";
import LessonItem from "./LessonItem";

const ModuleItem = ({
  module,
  index,
  onUpdate,
  onRemove,
  onAddLesson,
  onUpdateLesson,
  onRemoveLesson,
  quizzes,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleChange = (field, value) => {
    onUpdate(index, field, value);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    handleChange("status", newStatus);
    
    // If unlocking module and it has lessons, unlock first lesson
    if (newStatus === "unlocked" && module.lessons.length > 0) {
      const updatedLessons = [...module.lessons];
      updatedLessons[0].status = "unlocked";
      onUpdate(index, "lessons", updatedLessons);
    }
  };

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggleExpand) onToggleExpand(index, newExpanded);
  };

  return (
    <div className="module-card">
      <div className="module-header" onClick={toggleExpand}>
        <div className="module-title-section">
          <div className="module-toggle">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          <div className="module-badge">
            <span className="badge bg-light text-dark">Module {module.order}</span>
          </div>
          <div className="module-title">
            <h6 className="mb-0">
              {module.title || `Module ${module.order}`}
            </h6>
            <small className="text-muted">
              {module.lessons.length} lesson(s)
            </small>
          </div>
        </div>

        <div className="module-actions">
          <select
            className="form-select form-select-sm module-status"
            value={module.status}
            onChange={handleStatusChange}
          >
            <option value="unlocked">
              <Unlock size={12} className="me-1" />
              Unlocked
            </option>
            <option value="locked">
              <Lock size={12} className="me-1" />
              Locked
            </option>
          </select>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(index);
            }}
          >
            <Plus size={14} />
          </button>
          {onRemove && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="module-body">
          <div className="row g-3 mb-4">
            <div className="col-md-12">
              <label className="form-label">
                Module Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={module.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Module Title"
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={module.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Module description"
                rows={2}
              />
            </div>
          </div>

          <div className="lessons-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Lessons</h6>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => onAddLesson(index)}
              >
                <Plus size={14} className="me-1" /> Add Lesson
              </button>
            </div>

            <div className="lessons-list">
              {module.lessons.map((lesson, lessonIndex) => (
                <LessonItem
                  key={lessonIndex}
                  lesson={lesson}
                  moduleIndex={index}
                  lessonIndex={lessonIndex}
                  onUpdate={onUpdateLesson}
                  onRemove={onRemoveLesson}
                  quizzes={quizzes}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .module-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .module-card:hover {
          border-color: #6366f1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .module-header:hover {
          background: #f1f5f9;
        }

        .module-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .module-toggle {
          color: #6c757d;
        }

        .module-badge {
          flex-shrink: 0;
        }

        .module-title {
          flex: 1;
        }

        .module-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .module-status {
          width: auto;
          min-width: 120px;
        }

        .module-body {
          padding: 1.25rem;
          border-top: 1px solid #e9ecef;
          animation: slideDown 0.3s ease;
        }

        .lessons-section {
          margin-top: 1.5rem;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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

export default ModuleItem;