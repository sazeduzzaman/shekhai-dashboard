import { CheckCircle, ChevronDown, ChevronRight, Lock, Clock, FileText, Play } from 'lucide-react';
import React, { useEffect } from 'react';

const Syllabus = ({ 
  syllabusModules = [], 
  currentLessonId,
  expandedModules = [], 
  onToggleModule, 
  onSelectLesson,
  getCompletedLessons,
  getTotalLessons 
}) => {
  
  // Helper functions inside the component
  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusIcon = (status, type) => {
    if (status === "completed") {
      return <CheckCircle size={18} className="text-success" />;
    } else if (status === "unlocked") {
      return <Play size={16} className="text-primary" />;
    } else {
      return <Lock size={16} className="text-muted" />;
    }
  };

  const getTypeBadge = (type) => {
    const config = {
      video: { label: "Video", color: "primary" },
      practice: { label: "Practice", color: "warning" },
      quiz: { label: "Quiz", color: "danger" },
      project: { label: "Project", color: "success" },
    };
    const { label, color } = config[type] || config.video;
    return (
      <span
        className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle px-2 py-1 small`}
      >
        {label}
      </span>
    );
  };

  // Handle module toggle with auto-close functionality
  const handleToggleModule = (moduleId, moduleStatus) => {
    if (moduleStatus === "locked") return;
    
    // Check if this module is currently expanded
    const isCurrentlyExpanded = expandedModules.includes(moduleId);
    
    if (isCurrentlyExpanded) {
      // If it's expanded, just close it
      onToggleModule(moduleId);
    } else {
      // If it's not expanded, we need to close all others first
      // Since we can only call onToggleModule for one module at a time,
      // we need to close all currently expanded modules first
      
      // First, close all currently expanded modules
      expandedModules.forEach(expandedId => {
        if (expandedId !== moduleId) {
          onToggleModule(expandedId);
        }
      });
      
      // Then open the new module
      // Use setTimeout to ensure the close operations complete first
      setTimeout(() => {
        onToggleModule(moduleId);
      }, 10);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Course Syllabus</h4>
        <span className="badge bg-primary-subtle text-primary">
          {getCompletedLessons()}/{getTotalLessons()}
        </span>
      </div>

      <div className="accordion" style={{ maxHeight: "780px", overflowY: "auto" }}>
        {syllabusModules.map((module) => (
          <div key={module._id} className="accordion-item border-0 mb-2">
            {/* Module Header */}
            <div
              className={`accordion-header p-3 rounded-3 cursor-pointer transition-all ${
                module.status === "unlocked"
                  ? "bg-primary-subtle border border-primary-subtle"
                  : module.lessons?.every(l => l.status === "completed")
                  ? "bg-light"
                  : "bg-white border"
              } ${module.status === "locked" ? "opacity-50" : ""}`}
              onClick={() => handleToggleModule(module._id, module.status)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="flex-shrink-0">
                    {module.lessons?.every(l => l.status === "completed") ? (
                      <CheckCircle size={20} className="text-success" />
                    ) : module.status === "unlocked" ? (
                      <div className="current-dot-lg"></div>
                    ) : (
                      <Lock size={18} className="text-muted" />
                    )}
                  </div>
                  <div>
                    <h6 className={`fw-bold mb-1 ${module.status === "unlocked" ? "text-primary" : ""}`}>
                      {module.title}
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">
                        {module.lessons?.length || 0} lessons • {formatDuration(module.totalDuration)}
                      </small>
                      {module.lessons?.every(l => l.status === "completed") && (
                        <span className="badge bg-success-subtle text-success small">Completed</span>
                      )}
                      {module.status === "unlocked" && !module.lessons?.every(l => l.status === "completed") && (
                        <span className="badge bg-primary-subtle text-primary small">In Progress</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {expandedModules.includes(module._id) ? (
                    <ChevronDown size={20} className="text-muted" />
                  ) : (
                    <ChevronRight size={20} className="text-muted" />
                  )}
                </div>
              </div>
            </div>

            {/* Module Items (Collapsible) */}
            {expandedModules.includes(module._id) && (
              <div className="accordion-body p-0 mt-2">
                <div className="ms-4 ps-2 border-start border-2 border-light">
                  {module.lessons?.map((item) => (
                    <div
                      key={item._id}
                      className={`list-group-item border-0 rounded-3 mb-2 cursor-pointer transition-all p-3 ${
                        item._id === currentLessonId
                          ? "bg-primary-subtle border border-primary-subtle"
                          : item.status === "completed"
                          ? "bg-light"
                          : "bg-white border"
                      } ${item.status === "locked" ? "opacity-50" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (item.status !== "locked") {
                          onSelectLesson(item);
                        }
                      }}
                    >
                      {/* Lesson content */}
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0 me-3 mt-1">
                          {getStatusIcon(item.status, item.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className={`fw-bold mb-1 ${item._id === currentLessonId ? "text-primary" : ""}`}>
                              {item.title}
                            </h6>
                            <div className="d-flex align-items-center gap-1">
                              <Clock size={12} className="text-muted" />
                              <small className="text-muted">{formatDuration(item.duration)}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {getTypeBadge(item.type)}
                            {item.content?.resources?.length > 0 && (
                              <small className="text-muted d-flex align-items-center gap-1">
                                <FileText size={12} />
                                {item.content.resources.length} resources
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add custom styles */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        
        .current-dot-lg {
          width: 20px;
          height: 20px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }
        
        .border-light {
          border-color: #e9ecef !important;
        }
      `}</style>
    </>
  );
};

export default Syllabus;