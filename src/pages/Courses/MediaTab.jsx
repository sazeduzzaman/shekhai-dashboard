"use client";

import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "react-feather";

const MediaTab = ({ formData, onUpdate, onFileChange }) => {
  const [uploadMethod, setUploadMethod] = useState("base64"); // "base64" or "url"
console.log(formData, "formData")
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }

    if (uploadMethod === "base64") {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(field, reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For URL method, you would upload to server and get URL
      // This is a placeholder for actual upload implementation
      onFileChange(field, file);
    }
  };

  const removeImage = (field) => {
    onUpdate(field, null);
  };

  const ImagePreview = ({ src, onRemove }) => {
    if (!src) return null;

    return (
      <div className="image-preview">
        <img src={src} alt="Preview" />
        <button type="button" className="remove-btn" onClick={onRemove}>
          <X size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="media-tab">
      <div className="row g-4">
        {/* Upload Method Selector */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <label className="form-label fw-semibold">Upload Method</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${uploadMethod === "base64" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setUploadMethod("base64")}
                >
                  <Upload size={16} className="me-2" />
                  Base64 (Simple)
                </button>
                <button
                  type="button"
                  className={`btn ${uploadMethod === "url" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setUploadMethod("url")}
                >
                  <ImageIcon size={16} className="me-2" />
                  Server Upload
                </button>
              </div>
              <div className="alert alert-info mt-3">
                <AlertCircle size={16} className="me-2" />
                {uploadMethod === "base64"
                  ? "Base64 images are stored directly in the database. Best for small images."
                  : "Images will be uploaded to server and URLs stored. Better for large files."}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Banner Image</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Course Banner <span className="text-muted">(Optional)</span>
                </label>
                <div className="upload-area" onClick={() => document.getElementById('bannerInput').click()}>
                  <input
                    type="file"
                    id="bannerInput"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => handleImageUpload(e, "bannerImage")}
                  />
                  {formData.bannerImage ? (
                    <ImagePreview
                      src={formData.bannerImage}
                      onRemove={() => removeImage("bannerImage")}
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={48} className="text-muted mb-3" />
                      <p className="mb-2">Click to upload banner image</p>
                      <small className="text-muted">
                        1200×400 pixels, max 5MB
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Thumbnail Images</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Course Thumbnails <span className="text-muted">(Optional, Max 4)</span>
                </label>

                <div className="thumbnails-grid">
                  {formData.thumbnails?.map((thumbnail, index) => (
                    <div key={index} className="thumbnail-item">
                      <ImagePreview
                        src={thumbnail}
                        onRemove={() => {
                          const newThumbnails = [...formData.thumbnails];
                          newThumbnails.splice(index, 1);
                          onUpdate("thumbnails", newThumbnails);
                        }}
                      />
                    </div>
                  ))}

                  {(!formData.thumbnails || formData.thumbnails.length < 4) && (
                    <div
                      className="thumbnail-upload"
                      onClick={() => document.getElementById('thumbnailInput').click()}
                    >
                      <input
                        type="file"
                        id="thumbnailInput"
                        accept="image/*"
                        className="d-none"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const allowedFiles = files.slice(0, 4 - (formData.thumbnails?.length || 0));

                          if (uploadMethod === "base64") {
                            allowedFiles.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const newThumbnails = [...(formData.thumbnails || []), reader.result];
                                onUpdate("thumbnails", newThumbnails);
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />
                      <Upload size={24} className="text-muted" />
                      <small className="text-muted mt-2">Add Thumbnail</small>
                    </div>
                  )}
                </div>

                <div className="form-text">
                  Recommended: 400×300 pixels, max 5MB each
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .media-tab {
          animation: fadeIn 0.3s ease;
        }

        .upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .upload-area:hover {
          border-color: #6366f1;
          background: #f0f7ff;
        }

        .upload-placeholder {
          color: #6c757d;
        }

        .image-preview {
          position: relative;
          display: inline-block;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #dc3545;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #bb2d3b;
          transform: scale(1.1);
        }

        .thumbnails-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .thumbnail-item {
          aspect-ratio: 4/3;
        }

        .thumbnail-item .image-preview img {
          width: 100%;
          height: 100%;
        }

        .thumbnail-upload {
          aspect-ratio: 4/3;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .thumbnail-upload:hover {
          border-color: #6366f1;
          background: #f0f7ff;
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

export default MediaTab;