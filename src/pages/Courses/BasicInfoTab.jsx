"use client";

import React from "react";
import Select from "react-select";

const BasicInfoTab = ({ data, onUpdate, categories, userRole }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onUpdate(name, type === "checkbox" ? checked : value);
    };

    const handleSelectChange = (name, value) => {
        onUpdate(name, value);
    };

    const levelOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
    ];

    const accessTypeOptions = [
        { value: "lifetime", label: "Lifetime Access" },
        { value: "subscription", label: "Subscription" },
        { value: "timed", label: "Timed Access" },
    ];

    const statusOptions = [
        { value: true, label: "Published" },
        { value: false, label: "Unpublished" },
    ];

    return (
        <div className="basic-info-tab h-100">
            <div className="tab-header mb-4">
                <h4 className="mb-1">Basic Information</h4>
                <p className="text-muted mb-0">Fill in the basic details of your course</p>
            </div>

            <div className="row g-4">
                <div className="col-md-12">
                    <div className="form-group">
                        <label className="form-label fw-semibold">
                            Course Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            required
                        />
                        <div className="form-text">
                            Make it descriptive and engaging
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label fw-semibold">
                            Short Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            name="shortDescription"
                            value={data.shortDescription}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Brief description (max 200 characters)"
                            maxLength={200}
                            required
                        />
                        <div className="form-text">
                            This appears in course listings and search results
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label fw-semibold">
                            Long Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            name="longDescription"
                            value={data.longDescription}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Detailed course description"
                            required
                        />
                        <div className="form-text">
                            Describe what students will learn, projects they'll build, and who this course is for
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">
                            Category <span className="text-danger">*</span>
                        </label>
                        <Select
                            value={data.category}
                            onChange={(val) => handleSelectChange("category", val)}
                            options={categories}
                            placeholder="Select Category..."
                            isClearable
                            required
                        />
                        <div className="form-text">
                            Choose the most relevant category
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">Level</label>
                        <Select
                            value={levelOptions.find(opt => opt.value === data.level)}
                            onChange={(val) => handleSelectChange("level", val.value)}
                            options={levelOptions}
                            isClearable={false}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">Price ($)</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={data.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-text">
                            Set 0 for free courses
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">
                            Enrollment Deadline
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            name="enrollmentDeadline"
                            value={data.enrollmentDeadline}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <div className="form-text">
                            Optional - leave empty for open enrollment
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">Language</label>
                        <input
                            type="text"
                            className="form-control"
                            name="language"
                            value={data.language}
                            onChange={handleChange}
                            placeholder="English"
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">Access Type</label>
                        <Select
                            value={accessTypeOptions.find(opt => opt.value === data.accessType)}
                            onChange={(val) => handleSelectChange("accessType", val.value)}
                            options={accessTypeOptions}
                            isClearable={false}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label fw-semibold">Status</label>
                        <Select
                            value={statusOptions.find(opt => opt.value === data.published)}
                            onChange={(val) => handleSelectChange("published", val.value)}
                            options={statusOptions}
                            isClearable={false}
                        />
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <div className="form-check form-switch mt-4 pt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="certificateIncluded"
                                checked={data.certificateIncluded}
                                onChange={handleChange}
                                id="certificateSwitch"
                            />
                            <label className="form-check-label fw-semibold" htmlFor="certificateSwitch">
                                Certificate Included
                            </label>
                        </div>
                        <div className="form-text">
                            Students receive a certificate upon completion
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .basic-info-tab {
                animation: fadeIn 0.3s ease;
                }

                .tab-header {
                padding-top: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e9ecef;
                }

                .form-group {
                margin-bottom: 1.5rem;
                }

                .form-label {
                font-size: 14px;
                margin-bottom: 0.5rem;
                }

                .form-text {
                font-size: 12px;
                color: #6c757d;
                margin-top: 0.375rem;
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
            `}
            </style>
        </div>
    );
};

export default BasicInfoTab;