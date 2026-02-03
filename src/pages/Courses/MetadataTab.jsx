"use client";

import React, { useState } from "react";
import { Plus, X, Tag, CheckCircle, Book, Globe } from "react-feather";

const MetadataTab = ({ data, onUpdate }) => {
  const [tempTag, setTempTag] = useState("");
  const [tempLearn, setTempLearn] = useState("");
  const [tempPrerequisite, setTempPrerequisite] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");

  const addTag = () => {
    if (tempTag.trim() && !data.tags.includes(tempTag.trim())) {
      const newTags = [...data.tags, tempTag.trim()];
      onUpdate("tags", newTags);
      setTempTag("");
    }
  };

  const removeTag = (index) => {
    const newTags = data.tags.filter((_, i) => i !== index);
    onUpdate("tags", newTags);
  };

  const addLearnItem = () => {
    if (tempLearn.trim()) {
      const newItems = [...data.whatYoullLearn, tempLearn.trim()];
      onUpdate("whatYoullLearn", newItems);
      setTempLearn("");
    }
  };

  const removeLearnItem = (index) => {
    const newItems = data.whatYoullLearn.filter((_, i) => i !== index);
    onUpdate("whatYoullLearn", newItems);
  };

  const addPrerequisite = () => {
    if (tempPrerequisite.trim()) {
      const newPrerequisites = [...data.prerequisites, tempPrerequisite.trim()];
      onUpdate("prerequisites", newPrerequisites);
      setTempPrerequisite("");
    }
  };

  const removePrerequisite = (index) => {
    const newPrerequisites = data.prerequisites.filter((_, i) => i !== index);
    onUpdate("prerequisites", newPrerequisites);
  };

  const addSubtitle = () => {
    if (tempSubtitle.trim()) {
      const newSubtitles = [...data.subtitles, tempSubtitle.trim()];
      onUpdate("subtitles", newSubtitles);
      setTempSubtitle("");
    }
  };

  const removeSubtitle = (index) => {
    const newSubtitles = data.subtitles.filter((_, i) => i !== index);
    onUpdate("subtitles", newSubtitles);
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (type) {
        case "tag":
          addTag();
          break;
        case "learn":
          addLearnItem();
          break;
        case "prerequisite":
          addPrerequisite();
          break;
        case "subtitle":
          addSubtitle();
          break;
      }
    }
  };

  return (
    <div className="metadata-tab">
      <div className="tab-header mb-4">
        <h4 className="mb-1">Metadata</h4>
        <p className="text-muted mb-0">
          Add tags, learning outcomes, and other metadata to improve discoverability
        </p>
      </div>

      <div className="row g-4">
        {/* Tags */}
        <div className="col-md-12">
          <div className="card border">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <Tag size={16} className="me-2" />
                <h6 className="mb-0">Tags</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label fw-semibold">
                  Course Tags
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    placeholder="Add a tag (e.g., react, javascript)"
                    onKeyPress={(e) => handleKeyPress(e, "tag")}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addTag}
                    disabled={!tempTag.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {data.tags.map((tag, index) => (
                    <span key={index} className="badge bg-primary-subtle text-primary d-flex align-items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-sm"
                        onClick={() => removeTag(index)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
                <div className="form-text mt-2">
                  Tags help students find your course. Add relevant keywords.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="col-md-12">
          <div className="card border">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <CheckCircle size={16} className="me-2" />
                <h6 className="mb-0">What You'll Learn</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label fw-semibold">
                  Learning Outcomes
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={tempLearn}
                    onChange={(e) => setTempLearn(e.target.value)}
                    placeholder="Add a learning outcome"
                    onKeyPress={(e) => handleKeyPress(e, "learn")}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addLearnItem}
                    disabled={!tempLearn.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="learn-items">
                  {data.whatYoullLearn.map((item, index) => (
                    <div key={index} className="learn-item">
                      <div className="learn-icon">
                        <CheckCircle size={14} />
                      </div>
                      <div className="learn-content">
                        {item}
                      </div>
                      <button
                        type="button"
                        className="learn-remove"
                        onClick={() => removeLearnItem(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="form-text mt-2">
                  List clear, measurable skills students will gain
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="col-md-12">
          <div className="card border">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <Book size={16} className="me-2" />
                <h6 className="mb-0">Prerequisites</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label fw-semibold">
                  Requirements
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={tempPrerequisite}
                    onChange={(e) => setTempPrerequisite(e.target.value)}
                    placeholder="Add a prerequisite"
                    onKeyPress={(e) => handleKeyPress(e, "prerequisite")}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addPrerequisite}
                    disabled={!tempPrerequisite.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="prerequisites-list">
                  {data.prerequisites.map((item, index) => (
                    <div key={index} className="prerequisite-item">
                      <div className="prerequisite-content">
                        {item}
                      </div>
                      <button
                        type="button"
                        className="prerequisite-remove"
                        onClick={() => removePrerequisite(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="form-text mt-2">
                  What students should know before taking this course
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        <div className="col-md-12">
          <div className="card border">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <Globe size={16} className="me-2" />
                <h6 className="mb-0">Subtitles</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label fw-semibold">
                  Subtitle Languages
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={tempSubtitle}
                    onChange={(e) => setTempSubtitle(e.target.value)}
                    placeholder="Add a subtitle language"
                    onKeyPress={(e) => handleKeyPress(e, "subtitle")}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addSubtitle}
                    disabled={!tempSubtitle.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {data.subtitles.map((subtitle, index) => (
                    <span key={index} className="badge bg-info-subtle text-info d-flex align-items-center gap-1">
                      {subtitle}
                      <button
                        type="button"
                        className="btn-close btn-close-sm"
                        onClick={() => removeSubtitle(index)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
                <div className="form-text mt-2">
                  Languages for video subtitles (if available)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .metadata-tab {
          animation: fadeIn 0.3s ease;
        }

        .tab-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .card {
          margin-bottom: 1.5rem;
        }

        .card-header {
          background: #f8f9fa !important;
          border-bottom: 1px solid #e9ecef;
        }

        .learn-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .learn-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .learn-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .learn-content {
          flex: 1;
          font-size: 14px;
        }

        .learn-remove {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .learn-remove:hover {
          opacity: 1;
        }

        .prerequisites-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .prerequisite-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .prerequisite-content {
          font-size: 14px;
        }

        .prerequisite-remove {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          padding: 0;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .prerequisite-remove:hover {
          opacity: 1;
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

export default MetadataTab;