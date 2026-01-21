import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Plus,
  Clock,
  PersonCircle,
  Book,
  Pencil,
  Trash,
  Eye,
  GraphUp,
  ThreeDotsVertical,
  CheckCircle,
  XCircle,
  Calendar,
  CalendarCheck,
  Tag,
  Award,
  Search,
} from "react-bootstrap-icons";

const API_URL = "https://shekhai-server.onrender.com/api/v1";

const InstructorQuizzes = ({ courseId, isInstructor = true }) => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  // Get auth token
  const getAuthToken = () => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      try {
        const parsed = JSON.parse(authUser);
        return parsed.token || parsed;
      } catch {
        return authUser;
      }
    }
    return null;
  };

  // Get API headers
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId, statusFilter, publishedFilter]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching quizzes...");

      // Prepare params
      const params = {};
      if (courseId) params.courseId = courseId;
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      if (publishedFilter !== "all") {
        params.isPublished = publishedFilter === "published";
      }


      const response = await axios.get(`${API_URL}/quizzes`, {
        headers: getHeaders(),
        params,
      });

      if (response.data.success) {
        const quizzesData = response.data.data || [];
        console.log(`✅ Loaded ${quizzesData.length} quizzes`);
        setQuizzes(quizzesData);
      } else {
        toast.error(response.data.message || "Failed to fetch quizzes");
        setQuizzes([]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to fetch quizzes. Please try again.");
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPublishedFilter("all");
  };

  // Get filtered quizzes for display
  const getFilteredQuizzes = () => {
    return quizzes.filter((quiz) => {
      const matchesSearch = searchTerm
        ? quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      return matchesSearch;
    });
  };

  const togglePublish = async (quiz) => {
    try {
      const endpoint = quiz.isPublished ? "unpublish" : "publish";
      const response = await axios.patch(
        `${API_URL}/quizzes/${quiz._id}/${endpoint}`,
        {},
        { headers: getHeaders() }
      );

      if (response.data.success) {
        // Update local state
        setQuizzes((prev) =>
          prev.map((q) =>
            q._id === quiz._id ? { ...q, isPublished: !quiz.isPublished } : q
          )
        );

        toast.success(
          `Quiz ${
            !quiz.isPublished ? "published" : "unpublished"
          } successfully!`
        );
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update quiz status"
      );
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/quizzes/${deleteQuiz._id}`,
        {
          headers: getHeaders(),
        }
      );

      if (response.data.success) {
        setQuizzes((prev) => prev.filter((q) => q._id !== deleteQuiz._id));
        setDeleteQuiz(null);
        toast.success("Quiz deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete quiz");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Get quiz status badge
  const getStatusBadge = (quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.availableFrom);
    const endDate = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

    if (!quiz.isActive) return { text: "Disabled", class: "bg-secondary" };
    if (!quiz.isPublished)
      return { text: "Draft", class: "bg-warning text-dark" };
    if (now < startDate) return { text: "Scheduled", class: "bg-info" };
    if (endDate && now > endDate)
      return { text: "Expired", class: "bg-danger" };
    return { text: "Active", class: "bg-success" };
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3>{courseId ? "Course Quizzes" : "All Quizzes"}</h3>
            <p className="text-muted mb-0">
              Showing {filteredQuizzes.length} of {quizzes.length} quiz
              {quizzes.length !== 1 ? "zes" : ""}
            </p>
          </div>
          <div>
            <Link to="/instructor/quizzes/create" className="btn btn-primary">
              <Plus className="me-2" /> Create New Quiz
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && fetchQuizzes()}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={fetchQuizzes}
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Published Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={publishedFilter}
                  onChange={(e) => setPublishedFilter(e.target.value)}
                >
                  <option value="all">All Quizzes</option>
                  <option value="published">Published Only</option>
                  <option value="drafts">Drafts Only</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="col-md-2">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={fetchQuizzes}
                    title="Refresh"
                  >
                    Refresh
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 ? (
          <div className="card text-center py-5">
            <div className="card-body">
              <Book size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No quizzes found</h5>
              <p className="text-muted mb-0">
                {searchTerm ||
                statusFilter !== "all" ||
                publishedFilter !== "all"
                  ? "No quizzes match your filters. Try changing them."
                  : "Create your first quiz to get started"}
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/quizzes/create")}
              >
                <Plus className="me-2" /> Create Your First Quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="row mb-4">
              <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <h4 className="mb-0">{quizzes.length}</h4>
                    <small className="text-muted">Total Quizzes</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <h4 className="mb-0">
                      {quizzes.filter((q) => q.isPublished).length}
                    </h4>
                    <small className="text-muted">Published</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <h4 className="mb-0">
                      {quizzes.filter((q) => !q.isPublished).length}
                    </h4>
                    <small className="text-muted">Drafts</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center">
                    <h4 className="mb-0">
                      {quizzes.reduce(
                        (sum, q) =>
                          sum + (q.questionCount || q.questions?.length || 0),
                        0
                      )}
                    </h4>
                    <small className="text-muted">Total Questions</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Grid */}
            <div className="row">
              {filteredQuizzes.map((quiz) => {
                const status = getStatusBadge(quiz);

                return (
                  <div key={quiz._id} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div style={{ maxWidth: "80%" }}>
                            <h5
                              className="card-title mb-1"
                              style={{ lineHeight: "1.3" }}
                            >
                              {quiz.title}
                            </h5>
                            <span className={`badge ${status.class}`}>
                              {status.text}
                            </span>
                          </div>

                          {/* Actions Dropdown */}
                          {isInstructor && (
                            <div className="dropdown">
                              <button
                                className="btn btn-light btn-sm rounded-circle p-1"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <ThreeDotsVertical size={16} />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/quizzes/${quiz._id}`}
                                  >
                                    <Eye className="me-2" size={14} /> View
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/quizzes/${quiz._id}/edit`}
                                  >
                                    <Pencil className="me-2" size={14} /> Edit
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/quizzes/${quiz._id}/analytics`}
                                  >
                                    <GraphUp className="me-2" size={14} />{" "}
                                    Analytics
                                  </Link>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => togglePublish(quiz)}
                                  >
                                    {quiz.isPublished ? (
                                      <>
                                        <XCircle className="me-2" size={14} />{" "}
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle
                                          className="me-2"
                                          size={14}
                                        />{" "}
                                        Publish
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => setDeleteQuiz(quiz)}
                                  >
                                    <Trash className="me-2" size={14} /> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p
                          className="card-text text-muted small flex-grow-1 mb-3"
                          style={{ minHeight: "40px" }}
                        >
                          {quiz.description || "No description provided"}
                        </p>

                        {/* Quiz Info */}
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-1">
                            <Book size={14} className="text-muted me-2" />
                            <small className="text-muted">
                              {quiz.courseId?.title ||
                                quiz.courseName ||
                                "Course"}
                            </small>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <PersonCircle
                              size={14}
                              className="text-muted me-2"
                            />
                            <small className="text-muted">
                              {quiz.instructorId?.name ||
                                quiz.instructorName ||
                                "Instructor"}
                            </small>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <Clock size={14} className="text-muted me-2" />
                            <small className="text-muted">
                              {quiz.duration || 30} mins •{" "}
                              {quiz.questionCount ||
                                quiz.questions?.length ||
                                0}{" "}
                              questions
                            </small>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <Award size={14} className="text-muted me-2" />
                            <small className="text-muted">
                              Pass: {quiz.passingScore || 70}% •{" "}
                              {quiz.totalPoints || quiz.points || 0} points
                            </small>
                          </div>

                          <div className="d-flex align-items-center mb-1">
                            <Calendar size={14} className="text-muted me-2" />
                            <small className="text-muted">
                              Starts: {formatDate(quiz.availableFrom)}
                            </small>
                          </div>

                          {quiz.availableUntil && (
                            <div className="d-flex align-items-center">
                              <CalendarCheck
                                size={14}
                                className="text-muted me-2"
                              />
                              <small className="text-muted">
                                Ends: {formatDate(quiz.availableUntil)}
                              </small>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {quiz.tags && quiz.tags.length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex flex-wrap gap-1">
                              {quiz.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="badge bg-light text-dark border"
                                >
                                  <Tag size={10} className="me-1" /> {tag}
                                </span>
                              ))}
                              {quiz.tags.length > 3 && (
                                <span className="badge bg-light text-dark border">
                                  +{quiz.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 mt-auto">
                          <Link
                            to={`/quizzes/${quiz._id}`}
                            className="btn btn-outline-primary flex-grow-1"
                          >
                            <Eye className="me-1" size={16} /> View Details
                          </Link>

                          {isInstructor && (
                            <Link
                              to={`/quizzes/${quiz._id}/analytics`}
                              className="btn btn-outline-secondary"
                              title="Analytics"
                            >
                              <GraphUp size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteQuiz && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteQuiz(null)}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete the quiz{" "}
                    <strong>"{deleteQuiz.title}"</strong>?
                  </p>
                  <div className="alert alert-danger small mb-0">
                    <strong>Warning:</strong> This action cannot be undone. All
                    quiz attempts and data will be permanently deleted.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDeleteQuiz(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    <Trash className="me-1" /> Delete Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorQuizzes;
