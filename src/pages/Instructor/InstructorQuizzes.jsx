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
  Filter,
  X,
  BarChart,
  Star,
  People,
  QuestionCircle,
  ClockHistory,
  ArrowRepeat,
  CheckCircleFill,
  XCircleFill,
  ShieldCheck,
  JournalText,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Share,
  Copy,
  CheckLg
} from "react-bootstrap-icons";

const API_URL = "https://shekhai-server.onrender.com/api/v1";

const InstructorQuizzes = ({ courseId, isInstructor = true }) => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteQuiz, setDeleteQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [expandedStats, setExpandedStats] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [quizAnalytics, setQuizAnalytics] = useState({});

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
  }, [courseId]);

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
        
        // Fetch analytics for each quiz
        quizzesData.forEach(quiz => {
          fetchQuizAnalytics(quiz._id);
        });
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

  const fetchQuizAnalytics = async (quizId) => {
    try {
      const response = await axios.get(`${API_URL}/quizzes/${quizId}/analytics`, {
        headers: getHeaders(),
      });

      if (response.data.success) {
        setQuizAnalytics(prev => ({
          ...prev,
          [quizId]: response.data.data
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch analytics for quiz ${quizId}:`, err);
    }
  };

  const handleViewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setViewModalOpen(true);
  };

  const toggleStats = (quizId) => {
    setExpandedStats(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };

  const copyQuizLink = async (quizId) => {
    const link = `${window.location.origin}/quizzes/${quizId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(quizId);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPublishedFilter("all");
    fetchQuizzes();
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get quiz status badge
  const getStatusBadge = (quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.availableFrom);
    const endDate = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

    if (!quiz.isActive) return { text: "Disabled", class: "bg-secondary", icon: XCircleFill };
    if (!quiz.isPublished) return { text: "Draft", class: "bg-warning text-dark", icon: Pencil };
    if (now < startDate) return { text: "Scheduled", class: "bg-info", icon: Calendar };
    if (endDate && now > endDate) return { text: "Expired", class: "bg-danger", icon: XCircle };
    return { text: "Active", class: "bg-success", icon: CheckCircleFill };
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "600px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="page-content" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container-fluid py-4">
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-gradient-primary">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="display-6 fw-bold mb-2" style={{ color: "#1a1e2b" }}>
                      {courseId ? "📚 Course Quizzes" : "🎯 Quiz Management"}
                    </h2>
                    <p className="text-muted mb-0">
                      <span className="badge bg-primary bg-opacity-10 text-primary p-2 me-2">
                        {filteredQuizzes.length} of {quizzes.length} quizzes
                      </span>
                      {filteredQuizzes.length > 0 && (
                        <span className="text-muted">
                          • {filteredQuizzes.reduce((sum, q) => sum + (q.questionCount || 0), 0)} total questions
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/instructor/quizzes/create"
                      className="btn btn-primary btn-lg px-4"
                      style={{ borderRadius: "12px" }}
                    >
                      <Plus className="me-2" size={20} /> Create New Quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section - Modern Redesign */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-3 align-items-end">
                  <div className="col-lg-5">
                    <label className="form-label text-muted small fw-semibold mb-2">
                      <Search className="me-1" size={14} /> Search Quizzes
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Search size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Search by title, description, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && fetchQuizzes()}
                      />
                      {searchTerm && (
                        <button
                          className="btn btn-light border-0"
                          onClick={() => setSearchTerm("")}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <label className="form-label text-muted small fw-semibold mb-2">
                      <Filter className="me-1" size={14} /> Status
                    </label>
                    <select
                      className="form-select bg-light border-0"
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

                  <div className="col-lg-2">
                    <label className="form-label text-muted small fw-semibold mb-2">
                      <Book className="me-1" size={14} /> Type
                    </label>
                    <select
                      className="form-select bg-light border-0"
                      value={publishedFilter}
                      onChange={(e) => setPublishedFilter(e.target.value)}
                    >
                      <option value="all">All Quizzes</option>
                      <option value="published">Published</option>
                      <option value="drafts">Drafts</option>
                    </select>
                  </div>

                  <div className="col-lg-3">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary flex-grow-1"
                        onClick={fetchQuizzes}
                        style={{ borderRadius: "10px" }}
                      >
                        <Search className="me-2" size={16} /> Apply Filters
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={resetFilters}
                        style={{ borderRadius: "10px", width: "45px" }}
                        title="Reset filters"
                      >
                        <ArrowRepeat size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== "all" || publishedFilter !== "all") && (
                  <div className="mt-3 pt-3 border-top">
                    <span className="text-muted small me-2">Active filters:</span>
                    {searchTerm && (
                      <span className="badge bg-primary bg-opacity-10 text-primary p-2 me-2">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {statusFilter !== "all" && (
                      <span className="badge bg-info bg-opacity-10 text-info p-2 me-2">
                        Status: {statusFilter}
                      </span>
                    )}
                    {publishedFilter !== "all" && (
                      <span className="badge bg-success bg-opacity-10 text-success p-2 me-2">
                        {publishedFilter === "published" ? "Published" : "Drafts"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {filteredQuizzes.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                        <JournalText size={24} className="text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total Quizzes</h6>
                      <h3 className="mb-0 fw-bold">{quizzes.length}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3">
                        <CheckCircle size={24} className="text-success" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Published</h6>
                      <h3 className="mb-0 fw-bold">
                        {quizzes.filter((q) => q.isPublished).length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                        <Pencil size={24} className="text-warning" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Drafts</h6>
                      <h3 className="mb-0 fw-bold">
                        {quizzes.filter((q) => !q.isPublished).length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-info bg-opacity-10 rounded-circle p-3">
                        <People size={24} className="text-info" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="text-muted mb-1">Total Attempts</h6>
                      <h3 className="mb-0 fw-bold">
                        {quizzes.reduce((sum, q) => sum + (q.attemptCount || 0), 0)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - Modern Design */}
        {filteredQuizzes.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="card-body p-5">
                  <div className="mb-4">
                    <div className="bg-light rounded-circle d-inline-flex p-4">
                      <Book size={48} className="text-muted" />
                    </div>
                  </div>
                  <h4 className="mb-2">No quizzes found</h4>
                  <p className="text-muted mb-4">
                    {searchTerm || statusFilter !== "all" || publishedFilter !== "all"
                      ? "No quizzes match your current filters. Try adjusting them."
                      : "Get started by creating your first quiz. It's quick and easy!"}
                  </p>
                  {searchTerm || statusFilter !== "all" || publishedFilter !== "all" ? (
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={resetFilters}
                    >
                      <ArrowRepeat className="me-2" /> Clear Filters
                    </button>
                  ) : (
                    <Link
                      to="/instructor/quizzes/create"
                      className="btn btn-primary px-4"
                    >
                      <Plus className="me-2" /> Create Your First Quiz
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quiz Grid - Modern Cards */}
            <div className="row g-4">
              {filteredQuizzes.map((quiz) => {
                const status = getStatusBadge(quiz);
                const StatusIcon = status.icon;
                const analytics = quizAnalytics[quiz._id] || {};
                const isExpanded = expandedStats[quiz._id];

                return (
                  <div key={quiz._id} className="col-xl-4 col-lg-6">
                    <div className="card border-0 shadow-sm h-100 quiz-card">
                      {/* Card Header with Status */}
                      <div className="card-header bg-transparent border-0 pt-4 px-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex gap-2 flex-wrap">
                            <span className={`badge ${status.class} bg-opacity-10 text-${status.class.replace('bg-', '')} p-2`}>
                              <StatusIcon className="me-1" size={12} />
                              {status.text}
                            </span>
                            {quiz.isPublished ? (
                              <span className="badge bg-success bg-opacity-10 text-success p-2">
                                <CheckCircle className="me-1" size={12} />
                                Published
                              </span>
                            ) : (
                              <span className="badge bg-warning bg-opacity-10 text-warning p-2">
                                <Pencil className="me-1" size={12} />
                                Draft
                              </span>
                            )}
                          </div>

                          {/* Actions Dropdown */}
                          {isInstructor && (
                            <div className="dropdown">
                              <button
                                className="btn btn-light btn-sm rounded-circle"
                                type="button"
                                data-bs-toggle="dropdown"
                                style={{ width: "35px", height: "35px" }}
                              >
                                <ThreeDotsVertical size={16} />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
                                <li>
                                  <button
                                    className="dropdown-item py-2"
                                    onClick={() => handleViewQuiz(quiz)}
                                  >
                                    <Eye className="me-2" size={16} /> View Details
                                  </button>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item py-2"
                                    to={`/instructor/quizzes/${quiz._id}/edit`}
                                  >
                                    <Pencil className="me-2" size={16} /> Edit Quiz
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item py-2"
                                    to={`/instructor/quizzes/${quiz._id}/analytics`}
                                  >
                                    <BarChart className="me-2" size={16} /> Analytics
                                  </Link>
                                </li>
                                <li>
                                  <hr className="dropdown-divider my-1" />
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item py-2"
                                    onClick={() => copyQuizLink(quiz._id)}
                                  >
                                    {copiedId === quiz._id ? (
                                      <>
                                        <CheckLg className="me-2 text-success" size={16} />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="me-2" size={16} /> Copy Link
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item py-2"
                                    onClick={() => togglePublish(quiz)}
                                  >
                                    {quiz.isPublished ? (
                                      <>
                                        <XCircle className="me-2" size={16} /> Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="me-2" size={16} /> Publish
                                      </>
                                    )}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item py-2 text-danger"
                                    onClick={() => setDeleteQuiz(quiz)}
                                  >
                                    <Trash className="me-2" size={16} /> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Title and Description */}
                        <h5 className="card-title mt-3 mb-2 fw-bold">{quiz.title}</h5>
                        <p className="card-text text-muted small mb-3" style={{ minHeight: "40px" }}>
                          {quiz.description || "No description provided"}
                        </p>
                      </div>

                      <div className="card-body px-4">
                        {/* Quick Stats */}
                        <div className="d-flex gap-3 mb-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <QuestionCircle size={14} className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted d-block">Questions</small>
                              <span className="fw-bold">{quiz.questionCount || 0}</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <Clock size={14} className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted d-block">Duration</small>
                              <span className="fw-bold">{quiz.duration || 30} min</span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-2">
                              <Award size={14} className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted d-block">Pass %</small>
                              <span className="fw-bold">{quiz.passingScore || 70}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Stats */}
                        <div className={`stats-expandable ${isExpanded ? 'expanded' : ''}`}>
                          <div className="bg-light rounded-3 p-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="small fw-semibold">📊 Performance Stats</span>
                              <button
                                className="btn btn-sm btn-link p-0"
                                onClick={() => toggleStats(quiz._id)}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-3">
                                <div className="row g-2">
                                  <div className="col-6">
                                    <div className="bg-white rounded-3 p-2">
                                      <small className="text-muted d-block">Total Attempts</small>
                                      <span className="fw-bold">{analytics.totalAttempts || 0}</span>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="bg-white rounded-3 p-2">
                                      <small className="text-muted d-block">Avg. Score</small>
                                      <span className="fw-bold">{analytics.averageScore || 0}%</span>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="bg-white rounded-3 p-2">
                                      <small className="text-muted d-block">Pass Rate</small>
                                      <span className="fw-bold">{analytics.passRate || 0}%</span>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="bg-white rounded-3 p-2">
                                      <small className="text-muted d-block">Completion</small>
                                      <span className="fw-bold">{analytics.completionRate || 0}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Schedule Info */}
                        <div className="schedule-info mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={14} className="text-muted me-2" />
                            <small className="text-muted">Starts: {formatDate(quiz.availableFrom)}</small>
                          </div>
                          {quiz.availableUntil && (
                            <div className="d-flex align-items-center">
                              <CalendarCheck size={14} className="text-muted me-2" />
                              <small className="text-muted">Ends: {formatDate(quiz.availableUntil)}</small>
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
                                  className="badge bg-light text-dark border-0 px-3 py-2"
                                >
                                  <Tag size={10} className="me-1" /> {tag}
                                </span>
                              ))}
                              {quiz.tags.length > 3 && (
                                <span className="badge bg-light text-dark border-0 px-3 py-2">
                                  +{quiz.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Course & Instructor */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                              <Book size={14} className="text-primary" />
                            </div>
                            <small className="text-muted">
                              {quiz.courseId?.title || quiz.courseName || "General Course"}
                            </small>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-2">
                              <PersonCircle size={14} className="text-secondary" />
                            </div>
                            <small className="text-muted">
                              {quiz.instructorId?.name || quiz.instructorName || "You"}
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with Actions */}
                      <div className="card-footer bg-transparent border-0 pb-4 px-4">
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleViewQuiz(quiz)}
                            className="btn btn-outline-primary flex-grow-1"
                            style={{ borderRadius: "10px" }}
                          >
                            <Eye className="me-2" size={16} /> View Details
                          </button>
                          {/* <Link
                            to={`/instructor/quizzes/${quiz._id}/analytics`}
                            className="btn btn-outline-secondary"
                            style={{ borderRadius: "10px", width: "45px" }}
                            title="View Analytics"
                          >
                            <BarChart size={16} />
                          </Link>
                          <button
                            onClick={() => copyQuizLink(quiz._id)}
                            className="btn btn-outline-secondary"
                            style={{ borderRadius: "10px", width: "45px" }}
                            title="Copy Link"
                          >
                            {copiedId === quiz._id ? <CheckLg size={16} /> : <Copy size={16} />}
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* View Quiz Modal */}
        {selectedQuiz && viewModalOpen && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light border-0">
                  <h5 className="modal-title fw-bold">
                    <Eye className="me-2 text-primary" size={20} />
                    Quiz Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewModalOpen(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  {/* Quiz Header */}
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h3 className="fw-bold mb-2">{selectedQuiz.title}</h3>
                      <p className="text-muted mb-0">{selectedQuiz.description}</p>
                    </div>
                    <div>
                      {selectedQuiz.isPublished ? (
                        <span className="badge bg-success bg-opacity-10 text-success p-3">
                          <CheckCircle className="me-1" /> Published
                        </span>
                      ) : (
                        <span className="badge bg-warning bg-opacity-10 text-warning p-3">
                          <Pencil className="me-1" /> Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Information Grid */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-semibold mb-3">📋 Basic Information</h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Course:</span>
                            <span className="fw-medium">
                              {selectedQuiz.courseId?.title || selectedQuiz.courseName || "N/A"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Instructor:</span>
                            <span className="fw-medium">
                              {selectedQuiz.instructorId?.name || selectedQuiz.instructorName || "N/A"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Difficulty:</span>
                            <span className="fw-medium">
                              {selectedQuiz.difficulty || "Not specified"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Category:</span>
                            <span className="fw-medium">
                              {selectedQuiz.category || "General"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-semibold mb-3">⏱️ Time & Duration</h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Duration:</span>
                            <span className="fw-medium">{selectedQuiz.duration || 30} minutes</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Time limit:</span>
                            <span className="fw-medium">
                              {selectedQuiz.timeLimit ? `${selectedQuiz.timeLimit} min` : "No limit"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Available from:</span>
                            <span className="fw-medium">{formatDate(selectedQuiz.availableFrom)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Available until:</span>
                            <span className="fw-medium">
                              {selectedQuiz.availableUntil ? formatDate(selectedQuiz.availableUntil) : "No end date"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-semibold mb-3">📊 Scoring & Attempts</h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Total questions:</span>
                            <span className="fw-medium">{selectedQuiz.questionCount || selectedQuiz.questions?.length || 0}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Total points:</span>
                            <span className="fw-medium">{selectedQuiz.totalPoints || selectedQuiz.points || 0}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Passing score:</span>
                            <span className="fw-medium">{selectedQuiz.passingScore || 70}%</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Max attempts:</span>
                            <span className="fw-medium">
                              {selectedQuiz.maxAttempts || "Unlimited"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-semibold mb-3">⚙️ Settings</h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Shuffle questions:</span>
                            <span className="fw-medium">
                              {selectedQuiz.shuffleQuestions ? (
                                <span className="text-success">Yes</span>
                              ) : (
                                <span className="text-danger">No</span>
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Show results:</span>
                            <span className="fw-medium">
                              {selectedQuiz.showResults ? (
                                <span className="text-success">Immediately</span>
                              ) : (
                                <span className="text-warning">After review</span>
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Allow review:</span>
                            <span className="fw-medium">
                              {selectedQuiz.allowReview ? (
                                <span className="text-success">Yes</span>
                              ) : (
                                <span className="text-danger">No</span>
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Randomize options:</span>
                            <span className="fw-medium">
                              {selectedQuiz.randomizeOptions ? (
                                <span className="text-success">Yes</span>
                              ) : (
                                <span className="text-danger">No</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  {selectedQuiz.tags && selectedQuiz.tags.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">🏷️ Tags</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedQuiz.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark border-0 px-3 py-2"
                          >
                            <Tag className="me-1" size={12} /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions Preview */}
                  {selectedQuiz.questions && selectedQuiz.questions.length > 0 && (
                    <div>
                      <h6 className="fw-semibold mb-3">📝 Questions Preview</h6>
                      <div className="accordion" id="questionsAccordion">
                        {selectedQuiz.questions.slice(0, 5).map((question, index) => (
                          <div className="accordion-item border-0 mb-2" key={index}>
                            <div className="accordion-header">
                              <button
                                className="accordion-button collapsed bg-light rounded-3"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#question${index}`}
                              >
                                <div className="d-flex align-items-center w-100">
                                  <span className="badge bg-primary me-3">Q{index + 1}</span>
                                  <span className="flex-grow-1">{question.text || question.question}</span>
                                  <span className="badge bg-info bg-opacity-10 text-info ms-2">
                                    {question.points || 1} pts
                                  </span>
                                </div>
                              </button>
                            </div>
                            <div
                              id={`question${index}`}
                              className="accordion-collapse collapse"
                              data-bs-parent="#questionsAccordion"
                            >
                              <div className="accordion-body bg-light bg-opacity-50 rounded-3 mt-1 p-3">
                                <div className="mb-3">
                                  <span className="badge bg-secondary mb-2">
                                    Type: {question.type || "Multiple Choice"}
                                  </span>
                                </div>
                                
                                {/* Options */}
                                {question.options && question.options.length > 0 && (
                                  <div className="mb-3">
                                    <small className="text-muted d-block mb-2">Options:</small>
                                    {question.options.map((option, optIndex) => (
                                      <div
                                        key={optIndex}
                                        className={`p-2 mb-1 rounded-3 ${
                                          option.isCorrect
                                            ? "bg-success bg-opacity-10 border border-success"
                                            : "bg-white"
                                        }`}
                                      >
                                        <div className="d-flex align-items-center">
                                          <span className="me-2">{String.fromCharCode(65 + optIndex)}.</span>
                                          <span className="flex-grow-1">{option.text}</span>
                                          {option.isCorrect && (
                                            <CheckCircleFill className="text-success" size={16} />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Explanation */}
                                {question.explanation && (
                                  <div className="mt-2">
                                    <small className="text-muted d-block mb-1">Explanation:</small>
                                    <p className="mb-0 small">{question.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {selectedQuiz.questions.length > 5 && (
                          <p className="text-muted small mt-2">
                            and {selectedQuiz.questions.length - 5} more questions...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setViewModalOpen(false)}
                  >
                    Close
                  </button>
                  <Link
                    to={`/instructor/quizzes/${selectedQuiz._id}/edit`}
                    className="btn btn-primary"
                  >
                    <Pencil className="me-2" size={16} /> Edit Quiz
                  </Link>
                  <Link
                    to={`/instructor/quizzes/${selectedQuiz._id}/analytics`}
                    className="btn btn-info text-white"
                  >
                    <BarChart className="me-2" size={16} /> View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal - Modern Design */}
        {deleteQuiz && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-danger text-white border-0">
                  <h5 className="modal-title">
                    <Trash className="me-2" size={20} />
                    Confirm Delete
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setDeleteQuiz(null)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                      <Trash size={32} className="text-danger" />
                    </div>
                    <h5 className="mb-2">Delete "{deleteQuiz.title}"?</h5>
                    <p className="text-muted mb-0">
                      This action cannot be undone. This will permanently delete the quiz
                      and all associated data including student attempts and results.
                    </p>
                  </div>

                  <div className="bg-light rounded-3 p-3">
                    <h6 className="fw-semibold mb-2">This will delete:</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <XCircleFill className="text-danger me-2" size={14} />
                        Quiz "{deleteQuiz.title}"
                      </li>
                      <li className="mb-2">
                        <XCircleFill className="text-danger me-2" size={14} />
                        {deleteQuiz.questionCount || deleteQuiz.questions?.length || 0} questions
                      </li>
                      <li className="mb-2">
                        <XCircleFill className="text-danger me-2" size={14} />
                        All student attempts and grades
                      </li>
                      <li>
                        <XCircleFill className="text-danger me-2" size={14} />
                        Analytics and performance data
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0">
                  <button
                    type="button"
                    className="btn btn-light px-4"
                    onClick={() => setDeleteQuiz(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={confirmDelete}
                  >
                    <Trash className="me-2" size={16} />
                    Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .quiz-card {
          transition: all 0.3s ease;
        }
        .quiz-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .stats-expandable {
          transition: all 0.3s ease;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .accordion-button:not(.collapsed) {
          background-color: #f8f9fa;
          color: inherit;
        }
        
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(0,0,0,0.125);
        }
        
        .btn-outline-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(13,110,253,0.3);
        }
        
        .dropdown-item {
          transition: all 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          padding-left: 1.5rem;
        }
        
        .badge {
          font-weight: 500;
          letter-spacing: 0.3px;
        }
        
        .modal-content {
          animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default InstructorQuizzes;