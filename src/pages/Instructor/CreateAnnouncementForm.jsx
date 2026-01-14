import React, { Component } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Create a wrapper component with hooks
function withRouter(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} navigate={navigate} params={params} />;
  };
}

class CreateAnnouncementForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      courseId: "",
      priority: "medium",
      status: "draft",
      sentTo: "all",
      scheduleDate: "",
      expiresAt: "",
      tags: "",
      attachments: [],
      existingAttachments: [],
      courses: [],
      loading: false,
      submitting: false,
      error: null,
      announcementType: "general", // "general" or "course"
    };

    this.API_BASE_URL = "https://shekhai-server-production.up.railway.app/api/v1";
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    // Fetch courses without authentication
    this.fetchCourses();

    // If editing, fetch the announcement data
    const announcementId = this.props.params.id;
    if (announcementId) {
      this.fetchAnnouncement(announcementId);
    }
  }

  fetchCourses = async () => {
    try {
      // No authentication required - fetch public courses
      const response = await axios.get(`${this.API_BASE_URL}/courses`);

      // Check if response has data and it's an array
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        this.setState({ courses: response.data.data });
      } else {
        console.warn("Courses data is not in expected format:", response.data);
        this.setState({ courses: [] });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      this.setState({ courses: [] });
    }
  };

  fetchAnnouncement = async (id) => {
    try {
      this.setState({ loading: true });

      // No authentication required - fetch public announcement
      const response = await axios.get(
        `${this.API_BASE_URL}/announcements/${id}`
      );

      if (response.data.success) {
        const announcement = response.data.data;
        const hasCourse = announcement.courseId || announcement.courseName;

        this.setState({
          title: announcement.title || "",
          content: announcement.content || "",
          courseId: announcement.courseId?._id || announcement.courseId || "",
          priority: announcement.priority || "medium",
          status: announcement.status || "draft",
          sentTo: announcement.sentTo || "all",
          scheduleDate: announcement.scheduleDate
            ? new Date(announcement.scheduleDate).toISOString().split("T")[0]
            : "",
          expiresAt: announcement.expiresAt
            ? new Date(announcement.expiresAt).toISOString().split("T")[0]
            : "",
          tags: announcement.tags ? announcement.tags.join(", ") : "",
          existingAttachments: announcement.attachments || [],
          attachments: [],
          announcementType:
            announcement.announcementType || (hasCourse ? "course" : "general"),
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      this.setState({
        loading: false,
        error: error.response?.data?.message || "Failed to load announcement",
      });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    this.setState({ attachments: Array.from(e.target.files) });
  };

  handleTypeChange = (e) => {
    const type = e.target.value;
    this.setState({
      announcementType: type,
      courseId: type === "general" ? "" : this.state.courseId,
    });
  };

  removeExistingAttachment = async (attachmentId) => {
    try {
      const announcementId = this.props.params.id;
      if (!announcementId) return;

      // No authentication required for demo
      // In real app, you might want to add authentication here
      const response = await axios.delete(
        `${this.API_BASE_URL}/announcements/${announcementId}/attachments/${attachmentId}`
      );

      if (response.data.success) {
        this.setState((prevState) => ({
          existingAttachments: prevState.existingAttachments.filter(
            (attachment) => attachment._id !== attachmentId
          ),
        }));
        alert("Attachment removed successfully!");
      }
    } catch (error) {
      console.error("Error removing attachment:", error);
      alert(error.response?.data?.message || "Failed to remove attachment");
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      content,
      courseId,
      priority,
      status,
      sentTo,
      scheduleDate,
      expiresAt,
      tags,
      attachments,
      announcementType,
    } = this.state;

    // Validation - only title and content are required
    if (!title || !content) {
      this.setState({ error: "Title and content are required" });
      return;
    }

    // If course announcement is selected but no course chosen
    if (announcementType === "course" && !courseId) {
      this.setState({
        error: "Please select a course for course announcement",
      });
      return;
    }

    try {
      this.setState({ submitting: true, error: null });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Only add courseId if it's a course announcement
      if (announcementType === "course" && courseId) {
        formData.append("courseId", courseId);
      }

      formData.append("priority", priority);
      formData.append("status", status);
      formData.append("sentTo", sentTo);
      formData.append("announcementType", announcementType);

      if (scheduleDate) formData.append("scheduleDate", scheduleDate);
      if (expiresAt) formData.append("expiresAt", expiresAt);
      if (tags) formData.append("tags", tags);

      // Add new file attachments
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      // No authentication headers needed
      const config = {
        headers: {
          // Don't set Content-Type for FormData, axios will set it automatically
        },
      };

      const announcementId = this.props.params.id;
      let response;

      if (announcementId) {
        // Update existing announcement
        response = await axios.put(
          `${this.API_BASE_URL}/announcements/${announcementId}`,
          formData,
          config
        );
      } else {
        // Create new announcement
        response = await axios.post(
          `${this.API_BASE_URL}/announcements`,
          formData,
          config
        );
      }

      if (response.data.success) {
        const message = announcementId
          ? "✓ Announcement updated successfully!"
          : "✓ Announcement created successfully!";

        alert(message);
        this.props.navigate("/instructor/announcements");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);

      let errorMessage =
        error.response?.data?.message || "Failed to save announcement";

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to create announcements";
      } else if (
        error.response?.status === 404 &&
        this.state.announcementType === "course"
      ) {
        errorMessage = "Course not found";
      } else if (error.response?.status === 400) {
        // Handle validation errors
        errorMessage = error.response.data.error || errorMessage;
      }

      this.setState({
        submitting: false,
        error: errorMessage,
      });
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  render() {
    const {
      title,
      content,
      courseId,
      priority,
      status,
      sentTo,
      scheduleDate,
      expiresAt,
      tags,
      attachments,
      existingAttachments,
      courses,
      loading,
      submitting,
      error,
      announcementType,
    } = this.state;

    const announcementId = this.props.params.id;

    if (loading) {
      return (
        <div className="page-content">
          <div className="container-fluid">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading announcement...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">
                {announcementId ? "Edit Announcement" : "Create Announcement"}
              </h1>
              <p className="text-muted">
                {announcementId
                  ? "Update your announcement details"
                  : "Create a new announcement"}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.props.navigate("/instructor/announcements")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to List
            </button>
          </div>

          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => this.setState({ error: null })}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="announcementType" className="form-label">
                        Announcement Type
                      </label>
                      <select
                        className="form-select"
                        id="announcementType"
                        name="announcementType"
                        value={announcementType}
                        onChange={this.handleTypeChange}
                      >
                        <option value="general">General Announcement</option>
                        <option value="course">Course Announcement</option>
                      </select>
                      <small className="text-muted">
                        {announcementType === "general"
                          ? "General announcement for all users"
                          : "Announcement for specific course"}
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={title}
                        onChange={this.handleInputChange}
                        placeholder="Enter announcement title"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        Content *
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        rows="8"
                        value={content}
                        onChange={this.handleInputChange}
                        placeholder="Enter announcement content"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-4">
                    {/* Show course selection only for course announcements */}
                    {announcementType === "course" && (
                      <div className="mb-3">
                        <label htmlFor="courseId" className="form-label">
                          Course *
                        </label>
                        <select
                          className="form-select"
                          id="courseId"
                          name="courseId"
                          value={courseId}
                          onChange={this.handleInputChange}
                          required={announcementType === "course"}
                        >
                          <option value="">Select a course</option>
                          {/* SAFE RENDERING - Check if courses exists and is array */}
                          {courses &&
                          Array.isArray(courses) &&
                          courses.length > 0 ? (
                            courses.map((course) => (
                              <option key={course._id} value={course._id}>
                                {course.title}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No courses available
                            </option>
                          )}
                        </select>
                        {courses &&
                          Array.isArray(courses) &&
                          courses.length === 0 && (
                            <small className="text-danger">
                              No courses found. Create a course first or make a
                              general announcement.
                            </small>
                          )}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="priority" className="form-label">
                          Priority
                        </label>
                        <select
                          className="form-select"
                          id="priority"
                          name="priority"
                          value={priority}
                          onChange={this.handleInputChange}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          className="form-select"
                          id="status"
                          name="status"
                          value={status}
                          onChange={this.handleInputChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="sentTo" className="form-label">
                        Send To
                      </label>
                      <select
                        className="form-select"
                        id="sentTo"
                        name="sentTo"
                        value={sentTo}
                        onChange={this.handleInputChange}
                      >
                        <option value="all">All Students</option>
                        <option value="specific">Specific Students</option>
                        <option value="none">Don't Send Now</option>
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="scheduleDate" className="form-label">
                          Schedule Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="scheduleDate"
                          name="scheduleDate"
                          value={scheduleDate}
                          onChange={this.handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="expiresAt" className="form-label">
                          Expires On
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="expiresAt"
                          name="expiresAt"
                          value={expiresAt}
                          onChange={this.handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="tags" className="form-label">
                        Tags
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tags"
                        name="tags"
                        value={tags}
                        onChange={this.handleInputChange}
                        placeholder="Comma separated tags"
                      />
                      <small className="text-muted">
                        Separate tags with commas (e.g., exam, assignment,
                        reminder)
                      </small>
                    </div>

                    {/* Existing attachments for edit mode */}
                    {announcementId && existingAttachments.length > 0 && (
                      <div className="mb-3">
                        <label className="form-label">
                          Existing Attachments
                        </label>
                        <div className="list-group">
                          {existingAttachments.map((attachment) => (
                            <div
                              key={attachment._id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <i className="bi bi-paperclip me-2"></i>
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-decoration-none"
                                >
                                  {attachment.originalname}
                                </a>
                                <small className="text-muted d-block">
                                  {(attachment.size / 1024).toFixed(2)} KB
                                </small>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  this.removeExistingAttachment(attachment._id)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="attachments" className="form-label">
                        {announcementId
                          ? "Add More Attachments"
                          : "Attachments"}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="attachments"
                        name="attachments"
                        multiple
                        onChange={this.handleFileChange}
                        ref={this.fileInputRef}
                      />
                      <small className="text-muted">
                        Upload PDFs, images, or documents (max 5 files, 10MB
                        each)
                      </small>
                      {attachments.length > 0 && (
                        <div className="mt-2">
                          <small>Selected files:</small>
                          <ul className="list-unstyled">
                            {attachments.map((file, index) => (
                              <li key={index} className="text-muted">
                                <i className="bi bi-file me-1"></i>
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : announcementId ? (
                      "Update Announcement"
                    ) : (
                      "Create Announcement"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      this.props.navigate("/instructor/announcements")
                    }
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export with the custom withRouter wrapper
export default withRouter(CreateAnnouncementForm);
