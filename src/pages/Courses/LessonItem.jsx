"use client";

import React, { useState } from "react";
import { Video, FileText, CheckSquare, Code, Book, Trash2 } from "react-feather";
import Select from "react-select";

const lessonTypeOptions = [
  { value: "video", label: "Video", icon: <Video size={16} />, color: "#3b82f6" },
  { value: "practice", label: "Practice", icon: <Code size={16} />, color: "#f59e0b" },
  { value: "quiz", label: "Quiz", icon: <CheckSquare size={16} />, color: "#10b981" },
  { value: "project", label: "Project", icon: <Video size={16} />, color: "#8b5cf6" },
  { value: "reading", label: "Reading", icon: <Book size={16} />, color: "#6366f1" },
];

const LessonItem = ({
  lesson,
  moduleIndex,
  lessonIndex,
  onUpdate,
  onRemove,
  quizzes = [],
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field, value) => {
    onUpdate(moduleIndex, lessonIndex, field, value);
  };

  const handleTypeChange = (option) => {
    const newLesson = { ...lesson, type: option.value };
    
    // Reset quizId if not a quiz
    if (option.value !== "quiz") {
      newLesson.quizId = null;
    }
    
    // Reset content for practice/project
    if (option.value === "practice" || option.value === "project") {
      newLesson.content = { instructions: "", resources: [] };
    }
    
    onUpdate(moduleIndex, lessonIndex, null, newLesson);
  };

  const getTypeIcon = (type) => {
    const option = lessonTypeOptions.find(opt => opt.value === type);
    return option?.icon || <FileText size={16} />;
  };

  const getTypeColor = (type) => {
    const option = lessonTypeOptions.find(opt => opt.value === type);
    return option?.color || "#6c757d";
  };

  const typeOption = lessonTypeOptions.find(opt => opt.value === lesson.type);

  return (
    <div className="lesson-card" style={{ borderLeft: `3px solid ${getTypeColor(lesson.type)}` }}>
      <div className="lesson-header" onClick={() => setExpanded(!expanded)}>
        <div className="lesson-info">
          <div className="lesson-type-badge" style={{ background: getTypeColor(lesson.type) + '20', color: getTypeColor(lesson.type) }}>
            {getTypeIcon(lesson.type)}
            <span className="ms-1">{typeOption?.label}</span>
          </div>
          <div className="lesson-title">
            <h6 className="mb-0">{lesson.title || `Lesson ${lesson.order}`}</h6>
            {lesson.description && (
              <small className="text-muted d-block">{lesson.description}</small>
            )}
          </div>
        </div>
        
        <div className="lesson-actions">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={lesson.isPreview}
              onChange={(e) => handleChange("isPreview", e.target.checked)}
              id={`preview-${moduleIndex}-${lessonIndex}`}
              onClick={(e) => e.stopPropagation()}
            />
            <label className="form-check-label small" htmlFor={`preview-${moduleIndex}-${lessonIndex}`}>
              Preview
            </label>
          </div>
          {onRemove && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(moduleIndex, lessonIndex);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="lesson-body">
          <div className="row g-3">
            <div className="col-md-12">
              <label className="form-label">
                Lesson Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={lesson.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Lesson title"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Type</label>
              <Select
                value={typeOption}
                onChange={handleTypeChange}
                options={lessonTypeOptions}
                formatOptionLabel={({ label, icon }) => (
                  <div className="d-flex align-items-center gap-2">
                    {icon}
                    {label}
                  </div>
                )}
                isClearable={false}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={lesson.duration}
                onChange={(e) => handleChange("duration", Number(e.target.value))}
                min="0"
                placeholder="Duration in minutes"
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={lesson.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Lesson description"
                rows={2}
              />
            </div>

            {lesson.type === "video" && (
              <div className="col-md-12">
                <label className="form-label">Video URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={lesson.videoUrl}
                  onChange={(e) => handleChange("videoUrl", e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {lesson.type === "quiz" && (
              <div className="col-md-12">
                <label className="form-label">
                  Select Quiz <span className="text-danger">*</span>
                </label>
                <Select
                  value={quizzes.find(q => q.value === lesson.quizId)}
                  onChange={(option) => handleChange("quizId", option?.value || null)}
                  options={quizzes}
                  placeholder="Select a quiz..."
                  isClearable
                  required={lesson.type === "quiz"}
                />
              </div>
            )}

            {(lesson.type === "practice" || lesson.type === "project") && (
              <div className="col-md-12">
                <label className="form-label">Instructions</label>
                <textarea
                  className="form-control"
                  value={lesson.content?.instructions || ""}
                  onChange={(e) => {
                    const newContent = { ...lesson.content, instructions: e.target.value };
                    handleChange("content", newContent);
                  }}
                  placeholder="Instructions for the practice/project"
                  rows={3}
                />
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={lesson.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="unlocked">Unlocked</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .lesson-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .lesson-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          cursor: pointer;
          background: #f8fafc;
        }

        .lesson-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .lesson-type-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .lesson-title {
          flex: 1;
        }

        .lesson-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .lesson-body {
          padding: 1.25rem;
          border-top: 1px solid #e9ecef;
          animation: slideDown 0.3s ease;
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

export default LessonItem;