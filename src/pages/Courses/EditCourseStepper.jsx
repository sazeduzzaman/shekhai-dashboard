"use client";

import React from "react";

const EditCourseStepper = ({ activeTab, setActiveTab, completedSteps = [], courseTitle }) => {
  const steps = [
    { key: "basic", label: "Basic Info", icon: "bi-file-text" },
    { key: "instructor", label: "Instructor", icon: "bi-person" },
    { key: "content", label: "Course Content", icon: "bi-book" },
    { key: "metadata", label: "Metadata", icon: "bi-tag" },
    { key: "media", label: "Media", icon: "bi-images" },
  ];

  const getStepIndex = (stepKey) => {
    return steps.findIndex(step => step.key === stepKey);
  };

  const isStepActive = (stepKey) => {
    return activeTab === stepKey;
  };

  const isStepCompleted = (stepKey) => {
    return completedSteps.includes(stepKey);
  };

  return (
    <div className="stepper-card">
      <div className="stepper-header mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-pencil-square text-primary fs-5"></i>
          <h5 className="mb-0 fw-semibold">Edit Course</h5>
        </div>
        {courseTitle && (
          <div className="course-title-container mb-3">
            <p className="text-truncate text-muted small mb-0" title={courseTitle}>
              <i className="bi bi-book me-1"></i>
              {courseTitle}
            </p>
          </div>
        )}
        <p className="text-muted small mb-0">Update course details step by step</p>
      </div>

      <div className="stepper-steps">
        {steps.map((step, index) => {
          const isActive = isStepActive(step.key);
          const isCompleted = isStepCompleted(step.key);
          const stepNumber = index + 1;

          return (
            <div
              key={step.key}
              className={`stepper-step ${isActive ? "active-step" : ""} ${isCompleted ? "completed-step" : ""}`}
              onClick={() => setActiveTab(step.key)}
            >
              <div className="step-indicator">
                <div className={`step-icon ${isActive ? "active-icon" : ""} ${isCompleted ? "completed-icon" : ""}`}>
                  {isCompleted ? (
                    <i className="bi bi-check-circle-fill"></i>
                  ) : (
                    <span className="step-number">{stepNumber}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="step-line"></div>
                )}
              </div>

              <div className="step-content">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${step.icon} step-icon-symbol`}></i>
                  <h6 className="step-title mb-0">{step.label}</h6>
                </div>
                {isActive && (
                  <div className="step-status">
                    <span className="badge bg-primary">Editing</span>
                  </div>
                )}
                {isCompleted && !isActive && (
                  <div className="step-status">
                    <span className="badge bg-success">Completed</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .stepper-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .stepper-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .course-title-container {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 0.75rem;
          border: 1px solid #e9ecef;
        }

        .stepper-steps {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stepper-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .stepper-step:hover {
          background: #f8fafc;
        }

        .stepper-step.active-step {
          background: #f0f7ff;
        }

        .step-indicator {
          position: relative;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          z-index: 2;
          position: relative;
          border: 2px solid #e9ecef;
          background: #fff;
        }

        .step-icon:not(.active-icon):not(.completed-icon) {
          color: #6c757d;
        }

        .step-icon.active-icon {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }

        .step-icon.completed-icon {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .step-number {
          font-size: 12px;
          font-weight: 600;
        }

        .step-line {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: calc(100% + 1.5rem);
          background: #e9ecef;
          z-index: 1;
        }

        .stepper-step:last-child .step-indicator .step-line {
          display: none;
        }

        .step-content {
          flex: 1;
          min-width: 0;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .stepper-step.active-step .step-title {
          color: #6366f1;
        }

        .stepper-step.completed-step .step-title {
          color: #10b981;
        }

        .step-icon-symbol {
          font-size: 14px;
          color: #6c757d;
        }

        .stepper-step.active-step .step-icon-symbol {
          color: #6366f1;
        }

        .stepper-step.completed-step .step-icon-symbol {
          color: #10b981;
        }

        .step-status {
          margin-top: 0.25rem;
        }

        .step-status .badge {
          font-size: 10px;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default EditCourseStepper;