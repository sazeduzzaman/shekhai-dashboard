"use client";

import React from "react";
import Select from "react-select";
import { User, Info } from "react-feather";

const InstructorTab = ({ data, onUpdate, instructors, userRole, userId }) => {
  const handleSelectChange = (name, value) => {
    onUpdate(name, value);
  };

  return (
    <div className="instructor-tab">
      <div className="tab-header mb-4">
        <h4 className="mb-1">Instructor</h4>
        <p className="text-muted mb-0">
          {userRole === "instructor" 
            ? "This course will be assigned to you" 
            : "Assign an instructor to this course"}
        </p>
      </div>

      {userRole === "admin" ? (
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold">
                Select Instructor <span className="text-danger">*</span>
              </label>
              <Select
                value={data.instructor}
                onChange={(val) => handleSelectChange("instructor", val)}
                options={instructors}
                placeholder="Search and select instructor..."
                isClearable
                isDisabled={instructors.length === 0}
              />
              {instructors.length === 0 ? (
                <div className="alert alert-warning mt-3">
                  <Info size={16} className="me-2" />
                  No instructors found. Please add instructors first.
                </div>
              ) : (
                <div className="form-text">
                  Choose the instructor who will teach this course
                </div>
              )}
            </div>
          </div>

          {data.instructor && (
            <div className="col-md-12">
              <div className="card bg-light border mt-3">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "48px", height: "48px" }}>
                      <User size={20} />
                    </div>
                    <div>
                      <h6 className="mb-1">{data.instructor.label}</h6>
                      <small className="text-muted">
                        Selected as course instructor
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : userRole === "instructor" ? (
        <div className="row">
          <div className="col-md-12">
            <div className="card bg-primary-subtle border-primary">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "60px", height: "60px" }}>
                    <User size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">You are the instructor</h5>
                    <p className="text-muted mb-0">
                      This course will be automatically assigned to you. Students will see your name
                      and profile as the instructor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info mt-4">
              <Info size={16} className="me-2" />
              <strong>Note:</strong> As the instructor, you will have full access to manage this course,
              including content updates, student progress tracking, and grading.
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-warning">
              <Info size={16} className="me-2" />
              Loading user information...
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .instructor-tab {
          animation: fadeIn 0.3s ease;
        }

        .tab-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .form-group {
          margin-bottom: 1.5rem;
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

export default InstructorTab;