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
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

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

  // Banner and thumbnail files
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState([]);

  // Fetch categories & instructors AND get user info
  useEffect(() => {
    document.title = "Add Course | LMS Dashboard";
    const stored = localStorage.getItem("authUser");
    console.log("LocalStorage authUser:", stored); // Debug log

    if (!stored) {
      toast.error("You are not logged in.");
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      console.log("Parsed authData:", authData); // Debug log

      const token = authData?.token;

      if (!token) {
        toast.error("Invalid session token.");
        navigate("/login");
        return;
      }

      // Get user info from the nested user object
      const user = authData?.user;
      console.log("User object:", user); // Debug log

      if (!user) {
        toast.error("User data not found.");
        navigate("/login");
        return;
      }

      const role = user?.role;
      const id = user?.id;

      console.log("Setting userRole:", role, "userId:", id); // Debug log
      setUserRole(role);
      setUserId(id);

      const fetchData = async () => {
        try {
          // Fetch categories (always needed)
          const categoriesRes = await axios.get(
            "https://shekhai-server-production.up.railway.app/api/v1/categories",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const categoryOptions =
            categoriesRes.data.categories?.map((cat) => ({
              value: cat._id,
              label: cat.name,
            })) || [];

          setCategories(categoryOptions);

          // Only fetch instructors if user is ADMIN
          if (role === "admin") {
            try {
              console.log("Fetching instructors as admin..."); // Debug log
              const instructorsRes = await axios.get(
                "https://shekhai-server-production.up.railway.app/api/v1/users?role=instructor",
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log("Instructors API response:", instructorsRes.data); // Debug log

              const instructorOptions =
                instructorsRes.data.users?.map((instructor) => ({
                  value: instructor._id,
                  label: instructor.name,
                })) || [];

              console.log("Instructor options:", instructorOptions); // Debug log
              setInstructors(instructorOptions);
            } catch (instructorErr) {
              console.error("Error fetching instructors:", instructorErr);
              if (instructorErr.response) {
                console.error(
                  "Response status:",
                  instructorErr.response.status
                );
                console.error("Response data:", instructorErr.response.data);
              }
              toast.error("Failed to fetch instructors list.");
            }
          }

          // If user is instructor, auto-set their ID
          if (role === "instructor" && id) {
            setForm((prev) => ({
              ...prev,
              instructor: {
                value: id,
                label: user.name || "You",
              },
            }));
          }
        } catch (err) {
          console.error("Fetch error:", err);
          if (err.response) {
            console.error("Response status:", err.response.status);
            console.error("Response data:", err.response.data);
          }
          if (err.response?.status === 401) {
            localStorage.removeItem("authUser");
            navigate("/login");
          }
          toast.error("Failed to fetch data.");
        }
      };

      fetchData();
    } catch (parseErr) {
      console.error("Error parsing localStorage data:", parseErr);
      toast.error("Invalid session data.");
      localStorage.removeItem("authUser");
      navigate("/login");
    }
  }, [navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
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

  // Handle file selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Banner image too large (max 5MB)");
        return;
      }
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailsChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 4 files
    if (files.length > 4) {
      toast.error("Maximum 4 thumbnails allowed");
      return;
    }

    // Check file sizes
    const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error("Thumbnail image too large (max 5MB each)");
      return;
    }

    setThumbnailFiles(files);
    setThumbnailPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stored = localStorage.getItem("authUser");
    if (!stored) {
      toast.error("You are not logged in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      const token = authData?.token;
      const user = authData?.user;

      if (!token || !user) {
        toast.error("Invalid session data.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const role = user?.role;
      const id = user?.id;

      // Validation
      if (!form.category) {
        toast.error("Category is required.");
        setLoading(false);
        return;
      }

      if (!form.title.trim()) {
        toast.error("Course title is required.");
        setLoading(false);
        return;
      }

      if (role === "admin" && !form.instructor) {
        toast.error("Instructor is required for admin.");
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add form fields
      formData.append("title", form.title);
      formData.append("shortDescription", form.shortDescription);
      formData.append("longDescription", form.longDescription);

      // ============== FIX THIS PART ==============
      // CRITICAL: Get the instructor ID correctly
      let instructorId = null;

      if (role === "instructor") {
        // For instructors, use their own ID
        instructorId = id;
      } else if (role === "admin" && form.instructor) {
        // For admins, use the selected instructor's ID
        instructorId = form.instructor.value; // This should be the ObjectId string
      }

      if (instructorId) {
        console.log("Instructor ID being sent:", instructorId);
        console.log("Type of instructorId:", typeof instructorId);

        // Send as a simple string, not wrapped in an object
        formData.append("instructor", instructorId);
      }
      // ============== END FIX ==============

      formData.append("price", Number(form.price) || 0);
      formData.append("category", form.category.value);
      formData.append("level", form.level);
      formData.append("enrollmentDeadline", form.enrollmentDeadline);
      formData.append("published", form.published);

      // Add banner image if exists
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      // Add thumbnail images
      thumbnailFiles.forEach((file) => {
        formData.append("thumbnails", file);
      });

      // Add modules as JSON
      formData.append("modules", JSON.stringify(modules));

      // Log FormData for debugging
      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      const res = await axios.post(
        "https://shekhai-server-production.up.railway.app/api/v1/courses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Course added successfully!");

        // Reset form
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
        setBannerFile(null);
        setBannerPreview("");
        setThumbnailFiles([]);
        setThumbnailPreviews([]);

        // Redirect to courses list
        setTimeout(() => navigate("/all-courses"), 1500);
      } else {
        toast.error(res.data.msg || "Course not added");
      }
    } catch (err) {
      console.error("Submit error:", err);

      if (err.response) {
        console.error("Response error:", err.response.data);
        toast.error(
          err.response.data?.msg || err.response.data?.message || "Server error"
        );
      } else if (err.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Request error: " + err.message);
      }

      if (err.response?.status === 401) {
        localStorage.removeItem("authUser");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <Breadcrumbs title="Courses" breadcrumbItem="Add Course" />

      {/* User Role Indicator */}
      <div className="mb-3">
        <span
          className={`badge ${
            userRole === "admin"
              ? "bg-danger"
              : userRole === "instructor"
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {userRole === "admin"
            ? "Admin Mode"
            : userRole === "instructor"
            ? "Instructor Mode"
            : "Loading..."}
        </span>
        {userRole === "instructor" && (
          <span className="ms-2 text-muted">
            (Courses will be assigned to you automatically)
          </span>
        )}
      </div>

      <div className="card shadow-sm rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          {/* Banner Image */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Banner Image *</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleBannerChange}
            />
            <div className="form-text">
              Recommended: 1200×400 pixels, max 5MB
            </div>
            {bannerPreview && (
              <div className="mt-3">
                <p className="text-muted mb-1">Preview:</p>
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: 200,
                    objectFit: "cover",
                    border: "1px solid #dee2e6",
                  }}
                />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Thumbnail Images (Max 4)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={handleThumbnailsChange}
            />
            <div className="form-text">
              Recommended: 400×300 pixels, max 5MB each
            </div>
            {thumbnailPreviews.length > 0 && (
              <div className="mt-3">
                <p className="text-muted mb-1">Previews:</p>
                <div className="d-flex flex-wrap gap-3">
                  {thumbnailPreviews.map((url, idx) => (
                    <div key={idx} className="position-relative">
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="img-thumbnail"
                        style={{
                          width: 120,
                          height: 90,
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        style={{ transform: "translate(30%, -30%)" }}
                        onClick={() => {
                          setThumbnailFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                          setThumbnailPreviews((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Course Title *</label>
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

          {/* Instructor Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Instructor {userRole === "admin" && "*"}
            </label>

            {userRole === "admin" ? (
              <>
                <Select
                  value={form.instructor}
                  onChange={(val) => handleSelectChange("instructor", val)}
                  options={instructors}
                  placeholder={
                    instructors.length > 0
                      ? "Select Instructor..."
                      : "Loading instructors..."
                  }
                  isClearable
                  isDisabled={instructors.length === 0}
                />
                {instructors.length === 0 ? (
                  <div className="form-text text-warning">
                    No instructors found. Please ensure there are instructors in
                    the system.
                  </div>
                ) : (
                  <div className="form-text">
                    Admin must select an instructor
                  </div>
                )}
              </>
            ) : userRole === "instructor" ? (
              <>
                <div className="form-control bg-light">
                  {form.instructor?.label || "You"}
                </div>
                <div className="form-text">
                  Courses will be automatically assigned to you
                </div>
              </>
            ) : (
              <>
                <div className="form-control bg-light">
                  Loading user role...
                </div>
              </>
            )}
          </div>

          {/* Rest of the form remains the same */}
          {/* Price */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Price ($)</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category *</label>
            <Select
              value={form.category}
              onChange={(val) => handleSelectChange("category", val)}
              options={categories}
              placeholder="Select Category..."
              isClearable
              required
            />
          </div>

          {/* Level */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Level</label>
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
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Enrollment Deadline
            </label>
            <input
              type="date"
              className="form-control"
              name="enrollmentDeadline"
              value={form.enrollmentDeadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Modules */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="form-label fw-semibold mb-0">Modules</label>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={addModule}
              >
                + Add Module
              </button>
            </div>

            {modules.map((mod, index) => (
              <div key={index} className="card mb-3 border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Module {index + 1}</h6>
                    {modules.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeModule(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        placeholder="Module Title"
                        value={mod.title}
                        onChange={(e) =>
                          handleModuleChange(index, "title", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        placeholder="Duration"
                        value={mod.duration}
                        onChange={(e) =>
                          handleModuleChange(index, "duration", e.target.value)
                        }
                        className="form-control"
                        min="0"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        placeholder="Module Description"
                        value={mod.description}
                        onChange={(e) =>
                          handleModuleChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Video URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/video.mp4"
                        value={mod.videoUrl}
                        onChange={(e) =>
                          handleModuleChange(index, "videoUrl", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Status</label>
            <Select
              value={statusOptions.find((s) => s.value === form.published)}
              onChange={(val) => handleSelectChange("published", val.value)}
              options={statusOptions}
              isClearable={false}
            />
          </div>

          {/* Short Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Short Description</label>
            <textarea
              className="form-control"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description (max 200 characters)"
              maxLength={200}
              required
            />
          </div>

          {/* Long Description */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Long Description</label>
            <textarea
              className="form-control"
              name="longDescription"
              value={form.longDescription}
              onChange={handleChange}
              rows={5}
              placeholder="Detailed course description"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-primary px-5"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Saving...
                </>
              ) : (
                "Add Course"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default AddCourses;
