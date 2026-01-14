import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class AnnouncementsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      courses: [],
      showDeleteModal: false,
      activeFilter: "all",
      searchTerm: "",
      currentAnnouncement: null,
      isSubmitting: false,
      loading: true,
      error: null,
      stats: {
        total: 0,
        published: 0,
        drafts: 0,
        courses: 0,
      },
    };

    // For Vite.js (Create React App uses REACT_APP_*, Vite uses VITE_*)
this.API_BASE_URL = import.meta.env.VITE_API_URL || "https://shekhai-server-production.up.railway.app/api/v1";
  }

  componentDidMount() {
    this.fetchAnnouncements();
    this.fetchStats();
  }

  fetchAnnouncements = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      const token = localStorage.getItem("token");
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      const response = await axios.get(`${this.API_BASE_URL}/announcements`, config);
      
      if (response.data.success) {
        this.setState({
          announcements: response.data.data,
          loading: false,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      this.setState({
        error: error.response?.data?.message || "Failed to fetch announcements",
        loading: false,
      });
    }
  };

  fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get(`${this.API_BASE_URL}/announcements/stats/overview`, config);
      
      if (response.data.success) {
        this.setState({
          stats: {
            total: response.data.data.total,
            published: response.data.data.published,
            drafts: response.data.data.drafts,
            courses: response.data.data.topCourses?.length || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  handleShowDeleteModal = (announcement) => {
    this.setState({
      showDeleteModal: true,
      currentAnnouncement: { ...announcement },
    });
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false, currentAnnouncement: null });
  };

  handleDeleteAnnouncement = async () => {
    const { currentAnnouncement } = this.state;
    
    if (!currentAnnouncement) return;

    try {
      this.setState({ isSubmitting: true });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.delete(
        `${this.API_BASE_URL}/announcements/${currentAnnouncement._id}`,
        config
      );

      if (response.data.success) {
        // Remove from state
        this.setState(prevState => ({
          announcements: prevState.announcements.filter(
            announcement => announcement._id !== currentAnnouncement._id
          ),
          showDeleteModal: false,
          isSubmitting: false,
          currentAnnouncement: null,
        }));

        // Update stats
        await this.fetchStats();
        
        alert("✓ Announcement deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      this.setState({ isSubmitting: false });
      alert(error.response?.data?.message || "Failed to delete announcement");
    }
  };

  handlePublishAnnouncement = async (announcementId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.patch(
        `${this.API_BASE_URL}/announcements/${announcementId}/publish`,
        {},
        config
      );

      if (response.data.success) {
        // Update the announcement in state
        this.setState(prevState => ({
          announcements: prevState.announcements.map(announcement =>
            announcement._id === announcementId
              ? { ...announcement, status: "published", publishDate: new Date().toISOString() }
              : announcement
          ),
        }));

        // Update stats
        await this.fetchStats();
        
        alert("✓ Announcement published successfully!");
      }
    } catch (error) {
      console.error("Error publishing announcement:", error);
      alert(error.response?.data?.message || "Failed to publish announcement");
    }
  };

  handleFilterChange = (filter) => {
    this.setState({ activeFilter: filter });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  getFilteredAnnouncements = () => {
    const { announcements, activeFilter, searchTerm } = this.state;

    let filtered = [...announcements];

    // Apply status filter
    if (activeFilter === "published") {
      filtered = filtered.filter((a) => a.status === "published");
    } else if (activeFilter === "draft") {
      filtered = filtered.filter((a) => a.status === "draft");
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term) ||
          (a.courseName && a.courseName.toLowerCase().includes(term))
      );
    }

    return filtered;
  };

  getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-danger";
      case "medium":
        return "bg-warning text-dark";
      case "low":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "medium":
        return "Medium Priority";
      case "low":
        return "Low Priority";
      default:
        return "Normal";
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
      announcements,
      showDeleteModal,
      activeFilter,
      searchTerm,
      currentAnnouncement,
      isSubmitting,
      loading,
      error,
      stats,
    } = this.state;

    const filteredAnnouncements = this.getFilteredAnnouncements();

    return (
      <div className="page-content">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Announcements</h1>
              <p className="text-muted">
                Manage and create announcements for your courses
              </p>
            </div>
            <Link
              to="/instructor/announcements/create"
              className="btn btn-primary"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Announcement
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => this.setState({ error: null })}></button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Announcements</h6>
                      <h3 className="mb-0">{stats.total}</h3>
                    </div>
                    <div className="bg-primary rounded-circle p-3">
                      <i className="bi bi-megaphone text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Published</h6>
                      <h3 className="mb-0">{stats.published}</h3>
                    </div>
                    <div className="bg-success rounded-circle p-3">
                      <i className="bi bi-check-circle text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Drafts</h6>
                      <h3 className="mb-0">{stats.drafts}</h3>
                    </div>
                    <div className="bg-secondary rounded-circle p-3">
                      <i className="bi bi-file-earmark-text text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Courses</h6>
                      <h3 className="mb-0">{stats.courses}</h3>
                    </div>
                    <div className="bg-info rounded-circle p-3">
                      <i className="bi bi-journals text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={this.handleSearchChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="btn-group w-100 btn-group-responsive"
                    role="group"
                  >
                    <button
                      type="button"
                      className={`btn ${
                        activeFilter === "all"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => this.handleFilterChange("all")}
                    >
                      All ({announcements.length})
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeFilter === "published"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => this.handleFilterChange("published")}
                    >
                      Published ({stats.published})
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeFilter === "draft"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => this.handleFilterChange("draft")}
                    >
                      Drafts ({stats.drafts})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading announcements...</p>
            </div>
          ) : (
            /* Announcements List */
            <div className="row">
              {filteredAnnouncements.length === 0 ? (
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="bi bi-megaphone fs-1 text-muted mb-3"></i>
                      <h5>No announcements found</h5>
                      <p className="text-muted">
                        {searchTerm
                          ? "Try a different search term"
                          : "Create your first announcement"}
                      </p>
                      {!searchTerm && (
                        <Link
                          to="/instructor/announcements/create"
                          className="btn btn-primary mt-2"
                        >
                          Create Announcement
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <div className="col-md-6 mb-4" key={announcement._id}>
                    <div
                      className={`card h-100 announcement-card priority-${announcement.priority}`}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <span
                              className={`badge ${this.getPriorityBadgeClass(
                                announcement.priority
                              )} me-2`}
                            >
                              {this.getPriorityText(announcement.priority)}
                            </span>
                            <span
                              className={`badge ${
                                announcement.status === "published"
                                  ? "status-published"
                                  : "status-draft"
                              }`}
                            >
                              {announcement.status === "published"
                                ? "Published"
                                : "Draft"}
                            </span>
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary border-0"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link
                                  to={`/instructor/announcements/edit/${announcement._id}`}
                                  className="dropdown-item"
                                >
                                  <i className="bi bi-pencil me-2"></i> Edit
                                </Link>
                              </li>
                              {announcement.status === "draft" && (
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() => this.handlePublishAnnouncement(announcement._id)}
                                  >
                                    <i className="bi bi-send me-2"></i> Publish
                                  </button>
                                </li>
                              )}
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() =>
                                    this.handleShowDeleteModal(announcement)
                                  }
                                >
                                  <i className="bi bi-trash me-2"></i> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <h5 className="card-title">{announcement.title}</h5>
                        <p className="card-text text-muted">
                          {announcement.content.substring(0, 150)}...
                        </p>

                        <div className="mt-3">
                          {announcement.courseName && (
                            <span className="badge course-tag me-2">
                              <i className="bi bi-journal me-1"></i>{" "}
                              {announcement.courseName}
                            </span>
                          )}
                          <span className="badge bg-light text-dark me-2">
                            <i className="bi bi-calendar me-1"></i>{" "}
                            {this.formatDate(announcement.createdAt)}
                          </span>
                          {announcement.expiresAt && (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-clock me-1"></i>{" "}
                              Expires: {this.formatDate(announcement.expiresAt)}
                            </span>
                          )}
                        </div>

                        {announcement.attachments &&
                          announcement.attachments.length > 0 && (
                            <div className="mt-3">
                              <small className="text-muted">Attachments:</small>
                              <div className="d-flex flex-wrap gap-2 mt-1">
                                {announcement.attachments.map(
                                  (attachment, index) => (
                                    <a
                                      key={index}
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="badge bg-light text-dark text-decoration-none"
                                    >
                                      <i className="bi bi-paperclip me-1"></i>{" "}
                                      {attachment.originalname}
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {announcement.tags && announcement.tags.length > 0 && (
                          <div className="mt-3">
                            <div className="d-flex flex-wrap gap-2">
                              {announcement.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="badge bg-light text-dark"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <div
            className={`modal fade ${showDeleteModal ? "show d-block" : ""}`}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">
                    Delete Announcement
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={this.handleCloseDeleteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete the announcement:</p>
                  <h6 className="text-danger">
                    "{currentAnnouncement?.title}"
                  </h6>
                  <p className="text-muted">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.handleCloseDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.handleDeleteAnnouncement}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete Announcement"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop for modal */}
          {showDeleteModal && <div className="modal-backdrop fade show"></div>}
        </div>
      </div>
    );
  }
}

export default AnnouncementsPage;