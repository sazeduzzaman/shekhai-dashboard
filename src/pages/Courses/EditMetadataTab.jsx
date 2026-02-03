import React, { useState, useEffect } from 'react';

const EditMetadataTab = ({ 
  courseData, 
  updateCourseData, 
  errors = {}, 
  setErrors,
  isSubmitting = false 
}) => {
  const [localData, setLocalData] = useState({
    tags: [],
    whatYoullLearn: [],
    prerequisites: [],
    subtitles: [],
    newTag: '',
    newLearningItem: '',
    newPrerequisite: '',
    newSubtitle: '',
    status: 'draft',
    certificateIncluded: false,
  });

  // Initialize with existing course data
  useEffect(() => {
    if (courseData) {
      setLocalData({
        tags: courseData.tags || [],
        whatYoullLearn: courseData.whatYoullLearn || [],
        prerequisites: courseData.prerequisites || [],
        subtitles: courseData.subtitles || [],
        newTag: '',
        newLearningItem: '',
        newPrerequisite: '',
        newSubtitle: '',
        status: courseData.published ? 'published' : 'draft',
        certificateIncluded: courseData.certificateIncluded || false,
      });
    }
  }, [courseData]);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    
    // Update parent data for immediate fields
    if (field === 'status') {
      updateCourseData('published', value === 'published');
    } else if (field === 'certificateIncluded') {
      updateCourseData('certificateIncluded', value);
    }
  };

  const handleArrayAdd = (arrayField, valueField, newItemField) => {
    const newItem = localData[newItemField].trim();
    if (!newItem) return;

    const updatedArray = [...localData[arrayField], newItem];
    setLocalData(prev => ({ 
      ...prev, 
      [arrayField]: updatedArray,
      [newItemField]: '' 
    }));
    
    // Update parent data
    updateCourseData(arrayField, updatedArray);
  };

  const handleArrayRemove = (arrayField, index) => {
    const updatedArray = localData[arrayField].filter((_, i) => i !== index);
    setLocalData(prev => ({ ...prev, [arrayField]: updatedArray }));
    
    // Update parent data
    updateCourseData(arrayField, updatedArray);
  };

  const handleKeyPress = (event, callback) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };

  const handleStatusChange = (status) => {
    const isPublished = status === 'published';
    setLocalData(prev => ({ ...prev, status }));
    updateCourseData('published', isPublished);
  };

  const handleCertificateChange = (checked) => {
    setLocalData(prev => ({ ...prev, certificateIncluded: checked }));
    updateCourseData('certificateIncluded', checked);
  };

  return (
    <div className="card p-4">
      <div className="mb-4">
        <h3 className="mb-3">Edit Course Metadata</h3>
        <div className="alert alert-info mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Configure course settings, learning objectives, and requirements
        </div>
      </div>

      <div className="row">
        {/* Course Status */}
        <div className="col-md-6 mb-4">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">Course Status</h5>
              <div className="form-group">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${localData.status === 'draft' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleStatusChange('draft')}
                    disabled={isSubmitting}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    className={`btn ${localData.status === 'published' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleStatusChange('published')}
                    disabled={isSubmitting}
                  >
                    Published
                  </button>
                </div>
                <div className="form-text mt-2">
                  {localData.status === 'draft' 
                    ? 'Course is in draft mode and not visible to students.'
                    : 'Course is published and visible to students.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="col-md-6 mb-4">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">Certificate</h5>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="certificateIncluded"
                  checked={localData.certificateIncluded}
                  onChange={(e) => handleCertificateChange(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="certificateIncluded">
                  Include Certificate
                </label>
              </div>
              <div className="form-text mt-2">
                {localData.certificateIncluded
                  ? 'Students will receive a certificate upon course completion.'
                  : 'No certificate will be awarded for this course.'}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="col-12 mb-4">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">Tags</h5>
              <div className="row align-items-center mb-3">
                <div className="col-md-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., react, javascript, web development"
                      value={localData.newTag}
                      onChange={(e) => setLocalData(prev => ({ ...prev, newTag: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, () => handleArrayAdd('tags', 'newTag', 'newTag'))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleArrayAdd('tags', 'newTag', 'newTag')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Tag
                  </button>
                </div>
              </div>
              
              {localData.tags.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {localData.tags.map((tag, index) => (
                      <span key={index} className="badge bg-secondary p-2 d-flex align-items-center">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => handleArrayRemove('tags', index)}
                          disabled={isSubmitting}
                          aria-label="Remove"
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="col-12 mb-4">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">What You'll Learn</h5>
              <div className="row align-items-center mb-3">
                <div className="col-md-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Build responsive websites with HTML5 & CSS3"
                      value={localData.newLearningItem}
                      onChange={(e) => setLocalData(prev => ({ ...prev, newLearningItem: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, () => handleArrayAdd('whatYoullLearn', 'newLearningItem', 'newLearningItem'))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleArrayAdd('whatYoullLearn', 'newLearningItem', 'newLearningItem')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Item
                  </button>
                </div>
              </div>
              
              {localData.whatYoullLearn.length > 0 && (
                <div className="mb-3">
                  <ul className="list-group">
                    {localData.whatYoullLearn.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>• {item}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleArrayRemove('whatYoullLearn', index)}
                          disabled={isSubmitting}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="col-12 mb-4">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">Prerequisites</h5>
              <div className="row align-items-center mb-3">
                <div className="col-md-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Basic computer skills"
                      value={localData.newPrerequisite}
                      onChange={(e) => setLocalData(prev => ({ ...prev, newPrerequisite: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, () => handleArrayAdd('prerequisites', 'newPrerequisite', 'newPrerequisite'))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleArrayAdd('prerequisites', 'newPrerequisite', 'newPrerequisite')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Prerequisite
                  </button>
                </div>
              </div>
              
              {localData.prerequisites.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {localData.prerequisites.map((prereq, index) => (
                      <span key={index} className="badge bg-info p-2 d-flex align-items-center">
                        {prereq}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => handleArrayRemove('prerequisites', index)}
                          disabled={isSubmitting}
                          aria-label="Remove"
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtitles/Languages */}
        <div className="col-12">
          <div className="card border">
            <div className="card-body">
              <h5 className="card-title mb-3">Subtitles & Languages</h5>
              <div className="row align-items-center mb-3">
                <div className="col-md-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., English, Bengali, Spanish"
                      value={localData.newSubtitle}
                      onChange={(e) => setLocalData(prev => ({ ...prev, newSubtitle: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, () => handleArrayAdd('subtitles', 'newSubtitle', 'newSubtitle'))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleArrayAdd('subtitles', 'newSubtitle', 'newSubtitle')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Language
                  </button>
                </div>
              </div>
              
              {localData.subtitles.length > 0 && (
                <div className="mb-3">
                  <div className="d-flex flex-wrap gap-2">
                    {localData.subtitles.map((subtitle, index) => (
                      <span key={index} className="badge bg-success p-2 d-flex align-items-center">
                        <i className="bi bi-translate me-1"></i>
                        {subtitle}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => handleArrayRemove('subtitles', index)}
                          disabled={isSubmitting}
                          aria-label="Remove"
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMetadataTab;