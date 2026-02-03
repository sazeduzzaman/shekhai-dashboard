import React, { useState, useEffect } from 'react';

const EditInstructorTab = ({ 
  courseData, 
  updateCourseData, 
  errors = {}, 
  setErrors,
  instructors = [],
  userRole,
  userId,
  isSubmitting = false 
}) => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  
  // Initialize instructor selection
  useEffect(() => {
    console.log("EditInstructorTab - Initializing:", {
      courseDataInstructor: courseData?.instructor,
      instructorsCount: instructors?.length,
      userRole,
      userId
    });

    // For instructors: auto-select themselves
    if (userRole === "instructor" && userId) {
      const currentInstructor = instructors.find(inst => inst.value === userId);
      if (currentInstructor) {
        console.log("Auto-selecting instructor (instructor role):", currentInstructor);
        setSelectedInstructor(currentInstructor);
        if (updateCourseData) {
          updateCourseData('instructor', currentInstructor);
        }
      } else if (instructors.length > 0) {
        // Fallback: use first instructor if current user not found
        console.log("Using first instructor as fallback:", instructors[0]);
        setSelectedInstructor(instructors[0]);
        if (updateCourseData) {
          updateCourseData('instructor', instructors[0]);
        }
      }
    }
    // For admins: use existing course instructor or first available
    else if (userRole === "admin") {
      if (courseData?.instructor?.value) {
        console.log("Using course data instructor:", courseData.instructor);
        setSelectedInstructor(courseData.instructor);
      } else if (instructors.length > 0) {
        console.log("Using first instructor (admin role):", instructors[0]);
        setSelectedInstructor(instructors[0]);
        if (updateCourseData) {
          updateCourseData('instructor', instructors[0]);
        }
      }
    }
  }, [courseData?.instructor, instructors, userRole, userId, updateCourseData]);

  const handleInstructorChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Instructor changed to:", selectedValue);
    
    const instructor = instructors.find(inst => inst.value === selectedValue);
    if (instructor) {
      setSelectedInstructor(instructor);
      if (updateCourseData) {
        updateCourseData('instructor', instructor);
      }
      
      // Clear error for this field
      if (errors?.instructor && setErrors) {
        setErrors(prev => ({ ...prev, instructor: '' }));
      }
    }
  };

  // For instructors: show read-only view with all instructors
  if (userRole === "instructor") {
    return (
      <div className="card p-4">
        <div className="mb-4">
          <h3 className="mb-3">Instructor Information</h3>
          <div className="alert alert-info">
            <i className="bi bi-person-check me-2"></i>
            <strong>You are assigned as the instructor for this course.</strong>
            <p className="mb-0 mt-1">Below you can see all available instructors for reference.</p>
          </div>
        </div>

        {/* Current Instructor Info */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Current Instructor</h5>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-1">{selectedInstructor?.label || "You"}</h6>
                    <p className="text-muted mb-0">
                      <i className="bi bi-shield-check me-1"></i>
                      Auto-assigned based on your account
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Instructors List */}
        <div className="row">
          <div className="col-12">
            <h5 className="mb-3">All Available Instructors</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Current Selection</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map(instructor => (
                    <tr 
                      key={instructor.value}
                      className={selectedInstructor?.value === instructor.value ? 'table-primary' : ''}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                              <i className="bi bi-person"></i>
                            </div>
                          </div>
                          {instructor.label}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${selectedInstructor?.value === instructor.value ? 'bg-success' : 'bg-secondary'}`}>
                          {selectedInstructor?.value === instructor.value ? 'Selected' : 'Available'}
                        </span>
                      </td>
                      <td>
                        {selectedInstructor?.value === instructor.value ? (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        ) : (
                          <i className="bi bi-circle text-muted"></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="form-text mt-2">
              <i className="bi bi-info-circle me-1"></i>
              As an instructor, you cannot change the course instructor. Only administrators can reassign instructors.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For admins: show editable dropdown
  return (
    <div className="card p-4">
      <div className="mb-4">
        <h3 className="mb-3">Select Instructor</h3>
        <div className="alert alert-info">
          <i className="bi bi-people me-2"></i>
          Select the instructor for this course from the dropdown below.
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label className="form-label fw-bold">Instructor {userRole === "admin" ? "*" : ""}</label>
            <select
              className={`form-select form-select-lg ${errors.instructor ? 'is-invalid' : ''}`}
              value={selectedInstructor?.value || ""}
              onChange={handleInstructorChange}
              disabled={isSubmitting || userRole === "instructor"}
              required={userRole === "admin"}
            >
              <option value="">Select an instructor...</option>
              {instructors.map(instructor => (
                <option 
                  key={instructor.value} 
                  value={instructor.value}
                >
                  {instructor.label}
                  {selectedInstructor?.value === instructor.value ? " (Current)" : ""}
                </option>
              ))}
            </select>
            {errors.instructor && <div className="invalid-feedback d-block">{errors.instructor}</div>}
            
            {/* Selected Instructor Info */}
            {selectedInstructor && (
              <div className="alert alert-success mt-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>
                    <strong>Selected Instructor:</strong> {selectedInstructor.label}
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Count */}
            <div className="mt-2">
              <span className="badge bg-info">
                {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <i className="bi bi-person-badge me-2"></i>
              Current Selection
            </div>
            <div className="card-body">
              {selectedInstructor ? (
                <>
                  <h5 className="card-title">{selectedInstructor.label}</h5>
                  <p className="card-text text-muted">
                    <small>ID: {selectedInstructor.value}</small>
                  </p>
                </>
              ) : (
                <p className="card-text text-muted">No instructor selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInstructorTab;