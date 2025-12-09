"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const statusOptions = [
  { value: true, label: "Published" },
  { value: false, label: "Unpublished" },
];

const AddCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    instructor: null,
    price: "",
    category: null,
    level: "Beginner",
    enrollmentDeadline: "",
    published: false,
  });
  const [modules, setModules] = useState([
    { title: "", description: "", videoUrl: "", duration: "" },
  ]);

  // Fetch categories & instructors with token
  useEffect(() => {
    document.title = "Add Course | LMS Dashboard";
    const stored = localStorage.getItem("authUser");
    const token = stored ? JSON.parse(stored)?.token : null;
    if (!token) return toast.error("You are not logged in.");

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://shekhai-server.up.railway.app/api/v1/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const options = res.data.categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategories(options);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories.");
      }
    };

    const fetchInstructors = async () => {
      try {
        const res = await axios.get(
          "https://shekhai-server.up.railway.app/api/v1/users?role=instructor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const options = res.data.users.map((user) => ({
          value: user._id,
          label: user.name,
        }));
        setInstructors(options);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch instructors.");
      }
    };

    fetchCategories();
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const addModule = () =>
    setModules((prev) => [
      ...prev,
      { title: "", description: "", videoUrl: "", duration: "" },
    ]);
  const removeModule = (index) =>
    setModules((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stored = localStorage.getItem("authUser");
    const token = stored ? JSON.parse(stored)?.token : null;
    if (!token) {
      toast.error("You are not logged in.");
      setLoading(false);
      return;
    }

    if (!form.instructor || !form.category) {
      toast.error("Instructor and Category are required.");
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      longDescription: form.longDescription.trim(),
      instructor: form.instructor.value,
      price: Number(form.price),
      category: form.category.value,
      level: form.level,
      enrollmentDeadline: form.enrollmentDeadline,
      published: Boolean(form.published),
      modules: modules.map((m) => ({
        title: m.title.trim(),
        description: m.description.trim(),
        videoUrl: m.videoUrl.trim(),
        duration: Number(m.duration),
      })),
    };

    console.log("Submitting JSON payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await axios.post(
        "https://shekhai-server.up.railway.app/api/v1/courses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 && res.data?.success) {
        toast.success("Course added successfully!");
        setForm({
          title: "",
          shortDescription: "",
          longDescription: "",
          instructor: null,
          price: "",
          category: null,
          level: "Beginner",
          enrollmentDeadline: "",
          published: false,
        });
        setModules([
          { title: "", description: "", videoUrl: "", duration: "" },
        ]);
      } else {
        toast.error(res.data?.msg || "Course not added");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Breadcrumbs title="Courses" breadcrumbItem="Add Course" />
      <div className="card shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Course</h3>
            <small className="text-muted">
              Fill the form below to add a new course.
            </small>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            &larr; Back To List
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Instructor */}
            <div className="col-md-6">
              <label className="form-label">Instructor</label>
              <Select
                value={form.instructor}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, instructor: val }))
                }
                options={instructors}
                placeholder="Select Instructor..."
                isClearable
              />
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <Select
                value={form.category}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, category: val }))
                }
                options={categories}
                placeholder="Select Category..."
                isClearable
              />
            </div>

            {/* Level */}
            <div className="col-md-6">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Enrollment Deadline */}
            <div className="col-md-6">
              <label className="form-label">Enrollment Deadline</label>
              <input
                type="date"
                className="form-control"
                name="enrollmentDeadline"
                value={form.enrollmentDeadline}
                onChange={handleChange}
                required
              />
            </div>

            {/* Modules */}
            <div className="col-12">
              <label className="form-label">Modules</label>
              {modules.map((mod, index) => (
                <div key={index} className="mb-3 p-2 border rounded">
                  <input
                    type="text"
                    placeholder="Module Title"
                    value={mod.title}
                    onChange={(e) =>
                      handleModuleChange(index, "title", e.target.value)
                    }
                    className="form-control mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Module Description"
                    value={mod.description}
                    onChange={(e) =>
                      handleModuleChange(index, "description", e.target.value)
                    }
                    className="form-control mb-1"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={mod.videoUrl}
                    onChange={(e) =>
                      handleModuleChange(index, "videoUrl", e.target.value)
                    }
                    className="form-control mb-1"
                  />
                  <input
                    type="number"
                    placeholder="Duration (mins)"
                    value={mod.duration}
                    onChange={(e) =>
                      handleModuleChange(index, "duration", e.target.value)
                    }
                    className="form-control mb-1"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-1"
                    onClick={() => removeModule(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addModule}
              >
                Add Module
              </button>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <Select
                value={statusOptions.find((s) => s.value === form.published)}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, published: val.value }))
                }
                options={statusOptions}
                isClearable={false}
              />
            </div>

            {/* Short Description */}
            <div className="col-12">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-control"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>

            {/* Long Description */}
            <div className="col-12">
              <label className="form-label">Long Description</label>
              <textarea
                className="form-control"
                name="longDescription"
                value={form.longDescription}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              className="btn btn-primary px-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Course"}
            </button>
          </div>
        </form>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default AddCourses;
