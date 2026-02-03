"use client";

import React from "react";
import { CheckCircle, FileText, User, BookOpen, Tag, Image } from "react-feather";

const steps = [
  { key: "basic", label: "Basic Info", icon: <FileText size={18} /> },
  { key: "instructor", label: "Instructor", icon: <User size={18} /> },
  { key: "content", label: "Course Content", icon: <BookOpen size={18} /> },
  { key: "metadata", label: "Metadata", icon: <Tag size={18} /> },
  { key: "media", label: "Media", icon: <Image size={18} /> },
];

const CourseStepper = ({ activeTab, setActiveTab, completedSteps = [] }) => {
  return (
    <div className="stepper-sidebar">
      <div className="stepper-header">
        <h5 className="mb-0">Create Course</h5>
        <p className="text-muted small mb-4">Complete all steps to create your course</p>
      </div>

      <div className="stepper-steps">
        {steps.map((step, index) => {
          const isActive = activeTab === step.key;
          const isCompleted = completedSteps.includes(step.key);
          const stepNumber = index + 1;

          return (
            <div
              key={step.key}
              className={`stepper-step ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
              onClick={() => setActiveTab(step.key)}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <div className="step-icon completed">
                    <CheckCircle size={16} />
                  </div>
                ) : (
                  <div className={`step-icon ${isActive ? "active" : ""}`}>
                    {stepNumber}
                  </div>
                )}
                <div className="step-line"></div>
              </div>

              <div className="step-content">
                <div className="d-flex align-items-center gap-2">
                  {step.icon}
                  <h6 className="step-title mb-0">{step.label}</h6>
                </div>
                {isActive && (
                  <div className="step-status">
                    <span className="badge bg-primary">Current</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .stepper-sidebar {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          height: 100%;
        }

        .stepper-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 1.5rem;
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

        .stepper-step.active {
          background: #f0f7ff;
        }

        .step-indicator {
          position: relative;
          flex-shrink: 0;
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
        }

        .step-icon:not(.completed) {
          background: #e9ecef;
          color: #6c757d;
          border: 2px solid #e9ecef;
        }

        .step-icon.active {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }

        .step-icon.completed {
          background: #10b981;
          color: white;
          border-color: #10b981;
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

        .stepper-step:last-child .step-line {
          display: none;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .stepper-step.active .step-title {
          color: #6366f1;
        }

        .stepper-step.completed .step-title {
          color: #10b981;
        }

        .step-status {
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default CourseStepper;