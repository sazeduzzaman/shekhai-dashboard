"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const statusOptions = [
  { value: true, label: "Published" },
  { value: false, label: "Unpublished" },
];

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams(); // Rename to courseId for clarity
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  // Files state
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState([]);

  // Existing images from server
  const [existingBanner, setExistingBanner] = useState("");
  const [existingThumbnails, setExistingThumbnails] = useState([]);

  // Debug logging
  useEffect(() => {
    console.log("EditCourse mounted with courseId:", courseId);
    console.log("userId from state:", userId);
    console.log("userRole from state:", userRole);
  }, [courseId, userId, userRole]);

  // Fetch course data, categories & instructors
  useEffect(() => {
    const fetchData = async () => {
      console.log("Starting fetchData, courseId:", courseId);
      
      if (!courseId) {
        toast.error("No course ID found in URL.");
        navigate("/all-courses");
        return;
      }

      const stored = localStorage.getItem("authUser");
      console.log("LocalStorage authUser exists:", !!stored);

      if (!stored) {
        toast.error("You are not logged in.");
        navigate("/login");
        return;
      }

      try {
        const authData = JSON.parse(stored);
        console.log("Parsed authData:", authData);

        const token = authData?.token;

        if (!token) {
          toast.error("Invalid session token.");
          navigate("/login");
          return;
        }

        // Get user info
        const user = authData?.user;
        console.log("User object from localStorage:", user);

        if (!user) {
          toast.error("User data not found.");
          navigate("/login");
          return;
        }

        const role = user?.role;
        const currentUserId = user?.id || user?._id; // Try both possible field names
        console.log("Setting userRole:", role, "userId:", currentUserId);
        
        // Set user state
        setUserRole(role);
        setUserId(currentUserId);

        // Fetch course data FIRST
        console.log("Fetching course with ID:", courseId);
        const courseRes = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Course API Response:", courseRes.data);

        if (courseRes.data.success) {
          const course = courseRes.data.course || courseRes.data.data;
          console.log("Course data received:", course);
          console.log("Course instructor ID:", course.instructor?._id);
          console.log("Current user ID:", currentUserId);
          
          // TEMPORARILY COMMENT OUT PERMISSION CHECK
          // if (role === "instructor" && course.instructor?._id !== currentUserId) {
          //   console.log("Permission denied: instructor mismatch");
          //   toast.error("You don't have permission to edit this course.");
          //   navigate("/all-courses");
          //   return;
          // }

          // Set existing images
          setExistingBanner(course.bannerUrl || "");
          setExistingThumbnails(course.thumbnails || []);

          // Set form data
          setForm({
            title: course.title || "",
            shortDescription: course.shortDescription || "",
            longDescription: course.longDescription || "",
            instructor: course.instructor ? {
              value: course.instructor._id,
              label: course.instructor.name
            } : null,
            price: course.price || "",
            category: course.category?.[0] ? {
              value: course.category[0]._id,
              label: course.category[0].name
            } : null,
            level: course.level || "Beginner",
            enrollmentDeadline: course.enrollmentDeadline 
              ? course.enrollmentDeadline.split('T')[0] 
              : "",
            published: course.published || false,
          });

          // Set modules
          if (course.modules && course.modules.length > 0) {
            setModules(course.modules.map(mod => ({
              title: mod.title || "",
              description: mod.description || "",
              videoUrl: mod.videoUrl || "",
              duration: mod.duration || "",
              _id: mod._id // Keep existing ID
            })));
          }

          // Fetch categories
          const categoriesRes = await axios.get(
            "https://shekhai-server.onrender.com/api/v1/categories",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const categoryOptions = categoriesRes.data.categories?.map((cat) => ({
            value: cat._id,
            label: cat.name,
          })) || [];

          setCategories(categoryOptions);

          // Only fetch instructors if user is ADMIN
          if (role === "admin") {
            try {
              const instructorsRes = await axios.get(
                "https://shekhai-server.onrender.com/api/v1/users?role=instructor",
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const instructorOptions = instructorsRes.data.users?.map((instructor) => ({
                value: instructor._id,
                label: instructor.name,
              })) || [];

              setInstructors(instructorOptions);
            } catch (instructorErr) {
              console.error("Error fetching instructors:", instructorErr);
              toast.error("Failed to fetch instructors list.");
            }
          }

          setLoading(false);
          console.log("Data fetch completed successfully");
        } else {
          toast.error("Failed to fetch course data.");
          navigate("/all-courses");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("authUser");
          navigate("/login");
        } else if (err.response?.status === 404) {
          toast.error("Course not found.");
          navigate("/all-courses");
        } else if (err.response?.status === 403) {
          toast.error("You don't have permission to access this course.");
          navigate("/all-courses");
        } else {
          toast.error("Error loading course data: " + (err.message || "Unknown error"));
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

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

    setThumbnailFiles(prev => [...prev, ...files]);
    setThumbnailPreviews(prev => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file))
    ]);
  };

  // Remove thumbnail
  const removeThumbnail = (index, isExisting = false) => {
    if (isExisting) {
      setExistingThumbnails(prev => prev.filter((_, i) => i !== index));
    } else {
      setThumbnailFiles(prev => prev.filter((_, i) => i !== index));
      setThumbnailPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Remove banner
  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setExistingBanner("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const stored = localStorage.getItem("authUser");
    if (!stored) {
      toast.error("You are not logged in.");
      setUpdating(false);
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      const token = authData?.token;
      const user = authData?.user;

      if (!token || !user) {
        toast.error("Invalid session data.");
        setUpdating(false);
        navigate("/login");
        return;
      }

      const role = user?.role;
      const currentUserId = user?.id || user?._id;

      // Validation
      if (!form.category) {
        toast.error("Category is required.");
        setUpdating(false);
        return;
      }

      if (!form.title.trim()) {
        toast.error("Course title is required.");
        setUpdating(false);
        return;
      }

      if (role === "admin" && !form.instructor) {
        toast.error("Instructor is required for admin.");
        setUpdating(false);
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add form fields
      formData.append("title", form.title);
      formData.append("shortDescription", form.shortDescription);
      formData.append("longDescription", form.longDescription);

      // Handle instructor
      let instructorId = null;
      if (role === "instructor") {
        instructorId = currentUserId;
      } else if (role === "admin" && form.instructor) {
        instructorId = form.instructor.value;
      }

      if (instructorId) {
        console.log("Instructor ID being sent:", instructorId);
        formData.append("instructor", instructorId);
      }

      formData.append("price", Number(form.price) || 0);
      formData.append("category", form.category.value);
      formData.append("level", form.level);
      
      if (form.enrollmentDeadline) {
        formData.append("enrollmentDeadline", form.enrollmentDeadline);
      }
      
      formData.append("published", form.published);

      // Add banner image if exists
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      // Add thumbnail images
      thumbnailFiles.forEach((file) => {
        formData.append("thumbnails", file);
      });

      // Add existing thumbnails that haven't been removed
      existingThumbnails.forEach((url, index) => {
        formData.append("existingThumbnails[]", url);
      });

      // Add existing banner if not removed
      if (existingBanner && !bannerFile) {
        formData.append("existingBanner", existingBanner);
      }

      // Add modules as JSON
      formData.append("modules", JSON.stringify(modules));

      // Log FormData for debugging
      console.log("=== FormData Contents for PUT ===");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      const res = await axios.put(
        `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update API Response:", res.data);

      if (res.data.success) {
        toast.success("Course updated successfully!");
        setTimeout(() => navigate("/all-courses"), 1500);
      } else {
        toast.error(res.data.msg || "Failed to update course");
      }
    } catch (err) {
      console.error("Update error:", err);

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
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <Breadcrumbs title="Edit Course" breadcrumbItem="Loading..." />
        <div className="text-center mt-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading course data...</p>
          <p className="text-muted small">Course ID: {courseId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Breadcrumbs title="Courses" breadcrumbItem="Edit Course" />

      {/* Debug Info - Remove in production */}
      <div className="alert alert-info mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Debug Info:</strong>
            <span className="ms-2 badge bg-primary">Course ID: {courseId}</span>
            <span className="ms-2 badge bg-secondary">User Role: {userRole}</span>
            <span className="ms-2 badge bg-success">User ID: {userId?.substring(0, 8)}...</span>
          </div>
          <button 
            className="btn btn-sm btn-outline-info"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>

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
            (You can only edit your own courses)
          </span>
        )}
      </div>

      <div className="card shadow-sm rounded-4 p-4">
        <form onSubmit={handleSubmit}>
          {/* Banner Image */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Banner Image</label>
            
            {/* Existing banner preview */}
            {existingBanner && !bannerPreview && (
              <div className="mb-3">
                <p className="text-muted mb-1">Current Banner:</p>
                <div className="position-relative" style={{ maxWidth: "300px" }}>
                  <img
                    src={existingBanner}
                    alt="Current Banner"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: 150,
                      objectFit: "cover",
                      border: "1px solid #dee2e6",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ transform: "translate(30%, -30%)" }}
                    onClick={removeBanner}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* New banner upload */}
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleBannerChange}
            />
            <div className="form-text">
              Recommended: 1200×400 pixels, max 5MB
            </div>
            
            {/* New banner preview */}
            {bannerPreview && (
              <div className="mt-3">
                <p className="text-muted mb-1">New Banner Preview:</p>
                <div className="position-relative" style={{ maxWidth: "300px" }}>
                  <img
                    src={bannerPreview}
                    alt="New Banner Preview"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: 150,
                      objectFit: "cover",
                      border: "1px solid #dee2e6",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ transform: "translate(30%, -30%)" }}
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview("");
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Thumbnail Images (Max 4)
            </label>

            {/* Existing thumbnails */}
            {existingThumbnails.length > 0 && (
              <div className="mb-3">
                <p className="text-muted mb-1">Current Thumbnails:</p>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {existingThumbnails.map((url, idx) => (
                    <div key={`existing-${idx}`} className="position-relative">
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
                        onClick={() => removeThumbnail(idx, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New thumbnails upload */}
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
            
            {/* New thumbnails preview */}
            {thumbnailPreviews.length > 0 && (
              <div className="mt-3">
                <p className="text-muted mb-1">New Thumbnails Preview:</p>
                <div className="d-flex flex-wrap gap-3">
                  {thumbnailPreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="position-relative">
                      <img
                        src={url}
                        alt={`New Thumbnail ${idx + 1}`}
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
                        onClick={() => removeThumbnail(idx, false)}
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
                    No instructors found.
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
                  You are the instructor of this course
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
              <div key={mod._id || index} className="card mb-3 border">
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
              disabled={updating}
            >
              {updating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Updating...
                </>
              ) : (
                "Update Course"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/all-courses")}
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

export default EditCourse;