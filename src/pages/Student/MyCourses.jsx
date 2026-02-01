import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Star,
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  Loader,
  AlertCircle
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Progress,
  Row,
  Alert
} from "reactstrap";
import axios from "axios";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageProgress: 0,
    completedCourses: 0,
    totalHours: 0
  });

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const userData = JSON.parse(authUser);
        return {
          email: userData.user?.email || userData.email,
          token: userData.token,
          name: userData.user?.name || "Learner"
        };
      }
    } catch (err) {
      console.log("Error parsing user data:", err);
    }
    return null;
  };

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = getUserData();

        if (!userData?.email) {
          setError("Please log in to view your courses");
          setLoading(false);
          return;
        }

        // Fetch enrolled courses by student email
        const response = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/enrollments/student/${userData.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": userData.token ? `Bearer ${userData.token}` : ""
            }
          }
        );

        console.log("Enrollments API Response:", response.data);

        if (response.data.success && response.data.data) {
          // Transform API response
          const courses = response.data.data.map((enrollment) => ({
            id: enrollment.courseId || enrollment._id,
            enrollmentId: enrollment._id,
            title: enrollment.courseTitle || "Untitled Course",
            category: getCategoryFromTitle(enrollment.courseTitle),
            instructor: "Expert Instructor", // You might want to fetch this separately
            progress: enrollment.progress || 0,
            rating: 4.5, // Default, fetch from course details if available
            duration: calculateDuration(enrollment.enrollmentDate),
            lessons: 12, // Default, fetch from course details
            color: getRandomColor(),
            enrolledDate: enrollment.enrollmentDate,
            lastAccessed: enrollment.lastAccessed,
            status: enrollment.status || "active",
            certificateIssued: enrollment.certificateIssued || false,
            price: enrollment.coursePrice || 0,
            paymentStatus: enrollment.paymentInfo?.status || "Completed"
          }));

          setEnrolledCourses(courses);

          // Calculate statistics
          calculateStatistics(courses);
        } else {
          setError("No courses found");
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError(err.response?.data?.message || "Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Helper functions
  const getCategoryFromTitle = (title) => {
    if (!title) return "General";
    const titleLower = title.toLowerCase();
    if (titleLower.includes("web") || titleLower.includes("development")) return "Web Development";
    if (titleLower.includes("data") || titleLower.includes("science")) return "Data Science";
    if (titleLower.includes("mobile") || titleLower.includes("app")) return "Mobile Development";
    if (titleLower.includes("design")) return "Design";
    if (titleLower.includes("business")) return "Business";
    if (titleLower.includes("marketing")) return "Marketing";
    return "General";
  };

  const calculateDuration = (enrollmentDate) => {
    if (!enrollmentDate) return "12h";
    const enrolled = new Date(enrollmentDate);
    const now = new Date();
    const diffHours = Math.abs(now - enrolled) / (1000 * 60 * 60);
    return diffHours < 24 ? `${Math.ceil(diffHours)}h` : `${Math.ceil(diffHours / 24)}d`;
  };

  const getRandomColor = () => {
    const colors = [
      "#6366f1", // Indigo
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#0ea5e9", // Sky Blue
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#14b8a6", // Teal
      "#f97316"  // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const calculateStatistics = (courses) => {
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
    const averageProgress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
    const completedCourses = courses.filter(course => course.progress === 100).length;
    const totalHours = courses.length * 12; // Assuming 12h per course

    setStats({
      totalCourses: courses.length,
      averageProgress,
      completedCourses,
      totalHours
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleContinueCourse = (courseId) => {
    // Navigate to the course player with course ID
    Navigate(`/student/continue-courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="modern-dashboard p-4 mt-5 pt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <Loader size={48} className="text-primary mb-3 animate-spin" />
            <h4 className="text-slate-700">Loading your courses...</h4>
            <p className="text-muted">Fetching your learning journey</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-dashboard p-4 mt-5 pt-5">
        <Alert color="danger" className="rounded-3 border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <AlertCircle size={24} className="me-3" />
            <div>
              <h5 className="alert-heading mb-1">Unable to Load Courses</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button color="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button color="link" tag={Link} to="/courses" className="ms-2">
              Browse Courses
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="modern-dashboard p-4 mt-5 pt-5">
      {/* Informative Header */}
      <header className="mb-5">
        <Row className="align-items-end">
          <Col md="8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="live-indicator"></span>
              <span className="text-uppercase fw-bold text-primary small tracking-widest">
                Active Learning
              </span>
            </div>
            <h1 className="fw-black text-slate-900 mb-2">
              Welcome back, {getUserData()?.name || "Explorer"}!
            </h1>
            <p className="text-muted lead mb-0">
              You have{" "}
              <span className="text-dark fw-bold">{enrolledCourses.length} active courses</span>.
              {stats.averageProgress > 50 ? " Keep up the great work!" : " Let's start learning!"}
            </p>
          </Col>
          <Col md="4" className="text-md-end mt-3 mt-md-0">
            <Button
              color="white"
              className="shadow-sm border-0 rounded-pill px-4 py-2 me-2"
              onClick={() => {
                // Show statistics modal or page
                console.log("Show statistics");
              }}
            >
              <Award size={16} className="me-2" />
              Statistics
            </Button>
            <Button
              color="primary"
              className="shadow-lg border-0 rounded-pill px-4 py-2"
              tag={Link}
              to="/courses"
            >
              Find New <ArrowRight size={16} className="ms-1" />
            </Button>
          </Col>
        </Row>
      </header>

      {/* Quick Stats */}
      {enrolledCourses.length > 0 && (
        <Row className="g-3 mb-5">
          <Col md="3" sm="6">
            <Card className="border-0 shadow-sm rounded-3 bg-gradient-primary text-white">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white-20 rounded-circle p-3 me-3">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="fw-black mb-0">{stats.totalCourses}</h3>
                    <small className="opacity-80">Total Courses</small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3" sm="6">
            <Card className="border-0 shadow-sm rounded-3 bg-gradient-success text-white">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white-20 rounded-circle p-3 me-3">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="fw-black mb-0">{stats.averageProgress}%</h3>
                    <small className="opacity-80">Avg. Progress</small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3" sm="6">
            <Card className="border-0 shadow-sm rounded-3 bg-gradient-warning text-white">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white-20 rounded-circle p-3 me-3">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="fw-black mb-0">{stats.completedCourses}</h3>
                    <small className="opacity-80">Completed</small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3" sm="6">
            <Card className="border-0 shadow-sm rounded-3 bg-gradient-info text-white">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-white-20 rounded-circle p-3 me-3">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="fw-black mb-0">{stats.totalHours}h</h3>
                    <small className="opacity-80">Learning Hours</small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Course Grid */}
      {enrolledCourses.length > 0 ? (
        <Row className="g-4">
          {enrolledCourses.map((course) => (
            <Col xl="3" lg="4" md="6" key={course.id}>
              <Card className="info-card border-0">
                {/* Infographic Header Area */}
                <div
                  className="info-header"
                  style={{
                    background: `linear-gradient(135deg, ${course.color}dd, ${course.color})`,
                  }}
                >
                  <div className="info-overlay">
                    <div className="d-flex justify-content-between w-100 p-3">
                      <Badge className="glass-pill">{course.category}</Badge>
                      <div className="lessons-badge">
                        <BookOpen size={12} className="me-1" /> {course.lessons} Lessons
                      </div>
                    </div>
                    <div className="play-trigger" onClick={() => handleContinueCourse(course.id)}>
                      <div className="play-blur"></div>
                      <Play
                        size={28}
                        fill="white"
                        className="text-white position-relative"
                        style={{ zIndex: 2 }}
                      />
                    </div>
                  </div>
                  <div className="shape-1"></div>
                  <div className="shape-2"></div>
                </div>

                <CardBody className="p-4 bg-white rounded-bottom-4">
                  <div className="mb-4">
                    <h5 className="fw-bold text-slate-800 mb-1 text-truncate">
                      {course.title}
                    </h5>
                    <div className="d-flex align-items-center text-muted small">
                      <CheckCircle size={14} className="text-success me-1" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>

                  {/* Infographic Progress Strip */}
                  <div className="stats-strip mb-4">
                    <div className="stat-item">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value text-warning">
                        <Star size={12} fill="#ffc107" /> {course.rating}
                      </span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value text-dark">
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  <div className="progress-area mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-bold text-slate-600">
                        Completion
                      </span>
                      <span
                        className="small fw-black"
                        style={{ color: course.color }}
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <Progress
                      value={course.progress}
                      className="progress-sm"
                      barStyle={{
                        background: course.color,
                        borderRadius: "20px",
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted">
                      Last accessed: {formatDate(course.lastAccessed)}
                    </small>
                    {course.certificateIssued && (
                      <Badge color="success" pill>
                        <Award size={10} className="me-1" />
                        Certified
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleContinueCourse(course.id)}
                    className="continue-btn"
                    style={{ "--btn-color": course.color }}
                  >
                    {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <BookOpen size={64} className="text-muted" />
          </div>
          <h3 className="text-slate-700 mb-2">No Courses Enrolled Yet</h3>
          <p className="text-muted mb-4">Start your learning journey by enrolling in courses</p>
          <Button
            color="primary"
            className="rounded-pill px-4 py-2"
            tag={Link}
            to="/courses"
          >
            Browse Courses <ArrowRight size={16} className="ms-2" />
          </Button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .modern-dashboard {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
        }

        .fw-black { font-weight: 800; }
        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .tracking-widest { letter-spacing: 0.1em; }

        .live-indicator {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
          animation: pulse 2s infinite;
        }

        .bg-gradient-primary { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); }
        .bg-gradient-success { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); }
        .bg-gradient-warning { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); }
        .bg-gradient-info { background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); }
        
        .bg-white-20 { background: rgba(255, 255, 255, 0.2); }

        .info-card {
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .info-header {
          height: 140px;
          position: relative;
          overflow: hidden;
        }

        .info-overlay {
          position: relative;
          z-index: 5;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .glass-pill {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-weight: 600;
          border-radius: 50px;
        }

        .lessons-badge {
          font-size: 0.7rem;
          color: white;
          font-weight: 600;
          background: rgba(0,0,0,0.2);
          padding: 4px 10px;
          border-radius: 50px;
        }

        .play-trigger {
          position: relative;
          margin-top: 10px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .play-trigger:hover {
          transform: scale(1.1);
        }

        .play-blur {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 50px; height: 50px;
          background: rgba(255, 255, 255, 0.4);
          filter: blur(15px);
          border-radius: 50%;
        }

        .stats-strip {
          display: flex;
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px;
          justify-content: space-around;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label { font-size: 0.65rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .stat-value { font-size: 0.85rem; font-weight: 800; }
        .stat-divider { width: 1px; height: 20px; background: #e2e8f0; }

        .progress-sm { height: 6px; background-color: #f1f5f9; border-radius: 10px; }

        .continue-btn {
          background: white;
          border: 2px solid var(--btn-color);
          color: var(--btn-color);
          font-weight: 800;
          border-radius: 14px;
          padding: 10px;
          transition: all 0.3s;
        }

        .continue-btn:hover {
          background: var(--btn-color);
          color: white;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        /* Abstract shapes in card header */
        .shape-1 { position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        .shape-2 { position: absolute; bottom: -30px; left: -10px; width: 100px; height: 100px; border-radius: 50%; background: rgba(0,0,0,0.05); }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MyCourses;