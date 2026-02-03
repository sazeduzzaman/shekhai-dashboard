import React, { useState, useEffect } from 'react';

const EditBasicInfoTab = ({ 
  courseData, 
  updateCourseData, 
  errors = {}, 
  setErrors,
  categories = [],
  isSubmitting = false 
}) => {
  const [localData, setLocalData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: null,
    price: '',
    promotionalPrice: '',
    level: 'Beginner',
    language: 'English',
    enrollmentDeadline: '',
    published: false,
    accessType: 'lifetime',
    certificateIncluded: false,
  });

  // Initialize with existing course data
  useEffect(() => {
    if (courseData) {
      setLocalData({
        title: courseData.title || '',
        shortDescription: courseData.shortDescription || '',
        longDescription: courseData.longDescription || '',
        category: courseData.category || null,
        price: courseData.price || '',
        promotionalPrice: courseData.promotionalPrice || '',
        level: courseData.level || 'Beginner',
        language: courseData.language || 'English',
        enrollmentDeadline: courseData.enrollmentDeadline || '',
        published: courseData.published || false,
        accessType: courseData.accessType || 'lifetime',
        certificateIncluded: courseData.certificateIncluded || false,
      });
    }
  }, [courseData]);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    
    // Update parent data
    if (updateCourseData) {
      updateCourseData(field, value);
    }
    
    // Clear error for this field
    if (errors && errors[field] && setErrors) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field, selectedOption) => {
    setLocalData(prev => ({ ...prev, [field]: selectedOption }));
    
    // Update parent data
    if (updateCourseData) {
      updateCourseData(field, selectedOption);
    }
    
    // Clear error for this field
    if (errors && errors[field] && setErrors) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field, checked) => {
    setLocalData(prev => ({ ...prev, [field]: checked }));
    
    // Update parent data
    if (updateCourseData) {
      updateCourseData(field, checked);
    }
  };

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Arabic'];
  const accessTypes = ['lifetime', 'subscription', 'trial'];

  return (
    <div className="card p-4">
      <div className="mb-4">
        <h3 className="mb-3">Edit Basic Information</h3>
        <div className="alert alert-info mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Update your course basic information. Fields marked with * are required.
        </div>
      </div>
      
      <div className="row">
        {/* Course Title */}
        <div className="col-12 mb-3">
          <div className="form-group">
            <label className="form-label">Course Title *</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={localData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
        </div>

        {/* Short Description */}
        <div className="col-12 mb-3">
          <div className="form-group">
            <label className="form-label">Short Description *</label>
            <input
              type="text"
              className={`form-control ${errors.shortDescription ? 'is-invalid' : ''}`}
              value={localData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.shortDescription && <div className="invalid-feedback">{errors.shortDescription}</div>}
          </div>
        </div>

        {/* Long Description */}
        <div className="col-12 mb-3">
          <div className="form-group">
            <label className="form-label">Long Description</label>
            <textarea
              className={`form-control ${errors.longDescription ? 'is-invalid' : ''}`}
              value={localData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
              disabled={isSubmitting}
              rows="4"
            />
            {errors.longDescription && <div className="invalid-feedback">{errors.longDescription}</div>}
          </div>
        </div>

        {/* Category */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
              value={localData.category?.value || ''}
              onChange={(e) => {
                const selected = categories.find(cat => cat.value === e.target.value);
                handleSelectChange('category', selected);
              }}
              disabled={isSubmitting}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            {localData.category && (
              <div className="form-text">Selected: {localData.category.label}</div>
            )}
          </div>
        </div>

        {/* Level */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Level</label>
            <select
              className="form-select"
              value={localData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              disabled={isSubmitting}
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Fields */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              value={localData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isSubmitting}
              min="0"
              step="0.01"
            />
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Promotional Price ($) - Optional</label>
            <input
              type="number"
              className="form-control"
              value={localData.promotionalPrice}
              onChange={(e) => handleInputChange('promotionalPrice', e.target.value)}
              disabled={isSubmitting}
              min="0"
              step="0.01"
            />
            <div className="form-text">Set a promotional price for sales</div>
          </div>
        </div>

        {/* Language & Access Type */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={localData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              disabled={isSubmitting}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Access Type</label>
            <select
              className="form-select"
              value={localData.accessType}
              onChange={(e) => handleInputChange('accessType', e.target.value)}
              disabled={isSubmitting}
            >
              {accessTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Enrollment Deadline */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label">Enrollment Deadline (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={localData.enrollmentDeadline}
              onChange={(e) => handleInputChange('enrollmentDeadline', e.target.value)}
              disabled={isSubmitting}
            />
            <div className="form-text">Leave empty for no deadline</div>
          </div>
        </div>

        {/* Certificate & Published */}
        <div className="col-md-6 mb-3">
          <div className="form-group">
            <label className="form-label d-block">Options</label>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="certificateIncluded"
                checked={localData.certificateIncluded}
                onChange={(e) => handleCheckboxChange('certificateIncluded', e.target.checked)}
                disabled={isSubmitting}
              />
              <label className="form-check-label" htmlFor="certificateIncluded">
                Certificate Included
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="published"
                checked={localData.published}
                onChange={(e) => handleCheckboxChange('published', e.target.checked)}
                disabled={isSubmitting}
              />
              <label className="form-check-label" htmlFor="published">
                Published (Make course visible to students)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBasicInfoTab;