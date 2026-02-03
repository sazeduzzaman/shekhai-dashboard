import React, { useState, useEffect } from 'react';

const EditMediaTab = ({ 
  courseData, 
  updateCourseData, 
  errors = {}, 
  setErrors,
  isSubmitting = false 
}) => {
  const [localBanner, setLocalBanner] = useState(null);
  const [localThumbnails, setLocalThumbnails] = useState([]);
  const [newThumbnails, setNewThumbnails] = useState([]);
  const [removedThumbnails, setRemovedThumbnails] = useState([]);
  const [hasRemovedBanner, setHasRemovedBanner] = useState(false);

  // Initialize with existing data
  useEffect(() => {
    console.log('MediaTab - Initial Data:', {
      courseDataBannerUrl: courseData.bannerUrl,
      courseDataBannerImage: courseData.bannerImage,
      courseDataThumbnailUrls: courseData.thumbnailUrls,
      courseDataThumbnails: courseData.thumbnails
    });

    // Handle banner
    const bannerSource = getBannerSource();
    setLocalBanner(bannerSource);

    // Handle thumbnails
    const thumbnailSources = getThumbnailSources();
    setLocalThumbnails(thumbnailSources);

    // Initialize new thumbnails from formData.thumbnails
    if (courseData.thumbnails && courseData.thumbnails.length > 0) {
      setNewThumbnails(courseData.thumbnails.filter(thumb => 
        typeof thumb === 'string' && thumb.startsWith('data:image')
      ));
    }
  }, [courseData]);

  const getBannerSource = () => {
    // Priority: New banner > Existing banner
    if (courseData.bannerImage && typeof courseData.bannerImage === 'string') {
      if (courseData.bannerImage.startsWith('data:image')) {
        return { type: 'new', data: courseData.bannerImage };
      }
    }
    
    // Check for existing banner URL
    if (courseData.bannerUrl) {
      if (courseData.bannerUrl.startsWith('data:image')) {
        return { type: 'existing', data: courseData.bannerUrl };
      }
      // If it's a regular URL, construct full URL
      const fullUrl = courseData.bannerUrl.startsWith('http') 
        ? courseData.bannerUrl 
        : `https://shekhai-server.onrender.com${courseData.bannerUrl.startsWith('/') ? '' : '/'}${courseData.bannerUrl}`;
      return { type: 'existing', data: fullUrl };
    }
    
    return null;
  };

  const getThumbnailSources = () => {
    const sources = [];
    
    // Get existing thumbnails from thumbnailUrls
    if (courseData.thumbnailUrls && Array.isArray(courseData.thumbnailUrls)) {
      courseData.thumbnailUrls.forEach((thumbnail, index) => {
        if (!thumbnail) return;
        
        let thumbnailData = null;
        
        if (typeof thumbnail === 'string') {
          if (thumbnail.startsWith('data:image')) {
            thumbnailData = thumbnail;
          } else {
            // URL
            thumbnailData = thumbnail.startsWith('http') 
              ? thumbnail 
              : `https://shekhai-server.onrender.com${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`;
          }
        } else if (thumbnail && thumbnail.data) {
          if (thumbnail.data.startsWith('data:image')) {
            thumbnailData = thumbnail.data;
          } else {
            thumbnailData = thumbnail.data;
          }
        }
        
        if (thumbnailData) {
          sources.push({
            id: `existing_${index}`,
            data: thumbnailData,
            type: 'existing',
            index
          });
        }
      });
    }
    
    return sources;
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalBanner({ type: 'new', data: reader.result });
      setHasRemovedBanner(false);
      updateCourseData('bannerImage', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailsUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 4 - (localThumbnails.filter((_, idx) => !removedThumbnails.includes(idx)).length + newThumbnails.length);
    const allowedFiles = files.slice(0, maxFiles);
    
    allowedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedThumbnails = [...newThumbnails, reader.result];
        setNewThumbnails(updatedThumbnails);
        updateCourseData('thumbnails', updatedThumbnails);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingThumbnail = (index) => {
    setRemovedThumbnails(prev => [...prev, index]);
  };

  const restoreExistingThumbnail = (index) => {
    setRemovedThumbnails(prev => prev.filter(i => i !== index));
  };

  const removeNewThumbnail = (index) => {
    const updatedThumbnails = [...newThumbnails];
    updatedThumbnails.splice(index, 1);
    setNewThumbnails(updatedThumbnails);
    updateCourseData('thumbnails', updatedThumbnails);
  };

  const removeBanner = () => {
    setLocalBanner(null);
    setHasRemovedBanner(true);
    updateCourseData('bannerImage', null);
  };

  const restoreBanner = () => {
    const banner = getBannerSource();
    setLocalBanner(banner);
    setHasRemovedBanner(false);
    updateCourseData('bannerImage', banner?.data);
  };

  const getActiveThumbnails = () => {
    const activeExistingThumbnails = localThumbnails
      .filter((_, index) => !removedThumbnails.includes(index))
      .map(thumb => ({
        ...thumb,
        type: 'existing'
      }));
    
    const newThumbnailsList = newThumbnails.map((thumb, index) => ({
      id: `new_${index}`,
      data: thumb,
      type: 'new',
      index
    }));
    
    return [...activeExistingThumbnails, ...newThumbnailsList];
  };

  const activeThumbnails = getActiveThumbnails();

  return (
    <div className="card p-4">
      <div className="mb-4">
        <h3 className="mb-3">Edit Course Media</h3>
        <div className="alert alert-info mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Update course banner and thumbnail images. 
          Total thumbnails: {activeThumbnails.length}/4
        </div>
      </div>

      <div className="row g-4">
        {/* Banner Image */}
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Banner Image</h6>
              {localBanner && !hasRemovedBanner && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={removeBanner}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-trash me-1"></i>
                  Remove
                </button>
              )}
            </div>
            <div className="card-body">
              {/* Current Banner */}
              {localBanner && !hasRemovedBanner && (
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block mb-2">
                    Current Banner
                  </label>
                  <div className="position-relative" style={{ maxWidth: "100%" }}>
                    <img
                      src={localBanner.data}
                      alt="Current Banner"
                      className="img-fluid rounded border"
                      style={{
                        maxHeight: 200,
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Banner image failed to load:', localBanner.data);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="alert alert-danger p-2">
                            <i class="bi bi-image me-2"></i>
                            Failed to load banner image
                          </div>
                        `;
                      }}
                    />
                  </div>
                  <div className="form-text mt-2">
                    To replace, upload a new banner below
                  </div>
                </div>
              )}

              {/* Removed Banner Notice */}
              {hasRemovedBanner && (
                <div className="alert alert-warning mb-4 d-flex align-items-center justify-content-between">
                  <div>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Current banner marked for removal.
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={restoreBanner}
                    disabled={isSubmitting}
                  >
                    Restore
                  </button>
                </div>
              )}

              {/* No Banner Warning */}
              {!localBanner && !hasRemovedBanner && (
                <div className="alert alert-warning mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No banner image set. Please upload a banner for better course presentation.
                </div>
              )}

              {/* New Banner Upload */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {localBanner && !hasRemovedBanner ? 'Replace Banner' : 'Upload Banner'}
                </label>
                <div 
                  className="upload-area border rounded p-4 text-center"
                  onClick={() => !isSubmitting && document.getElementById('bannerInput').click()}
                  style={{ 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    backgroundColor: isSubmitting ? '#f8f9fa' : '#f8fafc',
                    borderStyle: 'dashed',
                    minHeight: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <input
                    type="file"
                    id="bannerInput"
                    accept="image/*"
                    className="d-none"
                    onChange={handleBannerUpload}
                    disabled={isSubmitting}
                  />
                  {courseData.bannerImage ? (
                    <div className="image-preview position-relative">
                      <img 
                        src={courseData.bannerImage} 
                        alt="New Banner Preview" 
                        className="img-fluid rounded"
                        style={{ 
                          maxHeight: '150px',
                          maxWidth: '100%',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.error('New banner image failed to load');
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => {
                          setLocalBanner(null);
                          updateCourseData('bannerImage', null);
                        }}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <i className="bi bi-cloud-upload display-6 text-muted mb-3"></i>
                      <p className="mb-2">
                        {localBanner && !hasRemovedBanner ? 'Replace Banner' : 'Upload Banner'}
                      </p>
                      <small className="text-muted d-block">
                        1200×400 pixels recommended
                      </small>
                      <small className="text-muted">Max 5MB</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light">
              <h6 className="mb-0">Thumbnail Images (Max 4)</h6>
            </div>
            <div className="card-body">
              {/* No Thumbnails Warning */}
              {localThumbnails.length === 0 && newThumbnails.length === 0 && (
                <div className="alert alert-warning mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No thumbnail images set. Thumbnails help attract students to your course.
                </div>
              )}

              {/* Thumbnails Grid */}
              <div className="row g-2">
                {/* Existing Thumbnails */}
                {localThumbnails.map((thumbnail, index) => {
                  const isRemoved = removedThumbnails.includes(index);
                  
                  return (
                    <div key={`existing-${index}`} className="col-6 col-md-3 mb-3">
                      <div className="position-relative">
                        {isRemoved ? (
                          <div className="thumbnail-removed">
                            <img 
                              src={thumbnail.data} 
                              alt={`Thumbnail ${index + 1}`}
                              className="img-fluid rounded border"
                              style={{ 
                                filter: 'grayscale(100%) brightness(0.7)',
                                opacity: 0.5,
                                height: '120px',
                                width: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              onError={(e) => {
                                console.error('Thumbnail image failed to load');
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
                              <i className="bi bi-x-circle text-white fs-4 mb-2"></i>
                              <small className="text-white mb-2">Removed</small>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                onClick={() => restoreExistingThumbnail(index)}
                                disabled={isSubmitting}
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="image-preview position-relative">
                            <img 
                              src={thumbnail.data} 
                              alt={`Thumbnail ${index + 1}`}
                              className="img-fluid rounded border"
                              style={{ 
                                height: '120px',
                                width: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              onError={(e) => {
                                console.error('Thumbnail image failed to load');
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                              onClick={() => removeExistingThumbnail(index)}
                              disabled={isSubmitting}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                      <small className="text-muted d-block mt-1 text-center">
                        Existing {index + 1}
                      </small>
                    </div>
                  );
                })}

                {/* New Thumbnails */}
                {newThumbnails.map((thumbnail, index) => (
                  <div key={`new-${index}`} className="col-6 col-md-3 mb-3">
                    <div className="image-preview position-relative">
                      <img 
                        src={thumbnail} 
                        alt={`New Thumbnail ${index + 1}`}
                        className="img-fluid rounded border"
                        style={{ 
                          height: '120px',
                          width: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          console.error('New thumbnail failed to load');
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={() => removeNewThumbnail(index)}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <small className="text-muted d-block mt-1 text-center">
                      New {index + 1}
                    </small>
                  </div>
                ))}

                {/* Upload new thumbnail */}
                {activeThumbnails.length < 4 && (
                  <div className="col-6 col-md-3 mb-3">
                    <div 
                      className="thumbnail-upload border rounded d-flex flex-column align-items-center justify-content-center"
                      onClick={() => !isSubmitting && document.getElementById('thumbnailInput').click()}
                      style={{ 
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        backgroundColor: isSubmitting ? '#f8f9fa' : '#f8fafc',
                        borderStyle: 'dashed',
                        height: '120px'
                      }}
                    >
                      <input
                        type="file"
                        id="thumbnailInput"
                        accept="image/*"
                        className="d-none"
                        multiple
                        onChange={handleThumbnailsUpload}
                        disabled={isSubmitting}
                      />
                      <i className="bi bi-plus-circle text-muted fs-4"></i>
                      <small className="text-muted mt-2">Add Thumbnail</small>
                    </div>
                    <small className="text-muted d-block mt-1 text-center">
                      Upload
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="col-12">
          <div className="card border">
            <div className="card-header bg-light">
              <h6 className="mb-0">Image Guidelines</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Banner:</strong> 1200×400 pixels, JPG or PNG format
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Thumbnails:</strong> 400×300 pixels, up to 4 images
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Max Size:</strong> 5MB per image
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Format:</strong> Use high-quality, relevant images
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMediaTab;