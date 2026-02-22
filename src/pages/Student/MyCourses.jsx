import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Star,
  Play,
  CheckCircle,
  Clock,
  Award,
  Loader,
  AlertCircle,
  BarChart2,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Download,
  Share2,
  Bookmark,
  Filter,
  Search
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Progress,
  Row,
  Alert,
  Spinner,
  Input,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import axios from "axios";

const MyCourses = () => {
  // State management
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageProgress: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    notStartedCourses: 0,
    totalHours: 0,
    completedHours: 0,
    totalLessons: 0,
    completedLessons: 0,
    certificatesEarned: 0,
    totalPoints: 0
  });

  // Course colors for visual variety
  const courseColors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444",
    "#10b981", "#3b82f6", "#7c3aed", "#db2777", "#6b7280", "#64748b"
  ];

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "IN";
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Helper function to get random background color for initials
  const getInitialsColor = (name) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444',
      '#10b981', '#3b82f6', '#7c3aed', '#db2777', '#6b7280'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const userData = JSON.parse(authUser);
        return {
          email: userData.user?.email || userData.email,
          token: userData.token,
          name: userData.user?.name || "Learner",
          id: userData.user?.id || userData.id
        };
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
    return null;
  };

  // Fetch enrolled courses on component mount
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

        const response = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/enrollments/student/${userData.email}`,
          {
            headers: {
              Authorization: userData.token
                ? `Bearer ${userData.token}`
                : "",
              "Content-Type": "application/json"
            },
            timeout: 10000 // 10 second timeout
          }
        );

        if (response.data.success && response.data.data) {
          // Transform API response to course objects
          const courses = response.data.data.map((enrollment, index) => ({
            id: enrollment.courseId || enrollment._id || `course-${index}`,
            title: enrollment.courseTitle || "Untitled Course",
            description: enrollment.courseDescription || "No description available",
            category: enrollment.category || "General",
            instructor: enrollment.instructor || "Expert Instructor",
            progress: Math.min(enrollment.progress || 0, 100),
            rating: enrollment.rating || 4.5,
            totalRating: enrollment.totalRating || 0,
            duration: enrollment.duration || "12h",
            totalLessons: enrollment.totalLessons || 12,
            completedLessons: enrollment.completedLessons || 0,
            color: courseColors[index % courseColors.length],
            lastAccessed: enrollment.lastAccessed || new Date().toISOString(),
            enrolledDate: enrollment.enrolledDate || new Date().toISOString(),
            certificateIssued: enrollment.certificateIssued || false,
            certificateUrl: enrollment.certificateUrl,
            milestones: enrollment.milestones || [],
            nextLesson: enrollment.nextLesson || "Introduction",
            prerequisites: enrollment.prerequisites || [],
            skills: enrollment.skills || ["Critical Thinking", "Problem Solving"],
            level: enrollment.level || "Beginner",
            language: enrollment.language || "English",
            hasCertificate: enrollment.hasCertificate || false,
            isFavorite: enrollment.isFavorite || false,
            lastLessonCompleted: enrollment.lastLessonCompleted,
            timeSpent: enrollment.timeSpent || 0, // in minutes
            achievements: enrollment.achievements || [],
            notes: enrollment.notes || 0,
            quizzes: enrollment.quizzes || [],
            assignments: enrollment.assignments || []
          }));

          setEnrolledCourses(courses);
          calculateStatistics(courses);
          filterAndSortCourses(courses, searchTerm, sortBy);
        } else {
          setError("No courses found. Start learning today!");
        }
      } catch (err) {
        if (err.code === 'ECONNABORTED') {
          setError("Request timed out. Please check your connection.");
        } else if (err.response) {
          setError(`Error: ${err.response.data.message || 'Failed to load courses'}`);
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("Failed to load courses. Please try again.");
        }
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Filter and sort courses when dependencies change
  useEffect(() => {
    filterAndSortCourses(enrolledCourses, searchTerm, sortBy);
  }, [enrolledCourses, searchTerm, sortBy]);

  // Calculate comprehensive statistics
  const calculateStatistics = (courses) => {
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
    const totalCompletedLessons = courses.reduce((sum, course) => sum + course.completedLessons, 0);
    const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0);
    const totalTimeSpent = courses.reduce((sum, course) => sum + course.timeSpent, 0);
    
    // Calculate points based on progress and achievements
    const totalPoints = courses.reduce((sum, course) => {
      const progressPoints = Math.floor(course.progress * 10);
      const achievementPoints = course.achievements.length * 50;
      return sum + progressPoints + achievementPoints;
    }, 0);

    setStats({
      totalCourses: courses.length,
      averageProgress: courses.length ? Math.round(totalProgress / courses.length) : 0,
      completedCourses: courses.filter((c) => c.progress === 100).length,
      inProgressCourses: courses.filter((c) => c.progress > 0 && c.progress < 100).length,
      notStartedCourses: courses.filter((c) => c.progress === 0).length,
      totalHours: Math.round(totalLessons * 1.5), // Assuming 1.5 hours per lesson
      completedHours: Math.round(totalCompletedLessons * 1.5),
      totalLessons,
      completedLessons: totalCompletedLessons,
      certificatesEarned: courses.filter((c) => c.certificateIssued).length,
      totalPoints
    });
  };

  // Filter and sort courses based on user preferences
  const filterAndSortCourses = (courses, search, sort) => {
    let filtered = [...courses];

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term) ||
        c.instructor.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    }

    // Sort courses
    switch (sort) {
      case "recent":
        filtered.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
        break;
      case "progress":
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "duration":
        filtered.sort((a, b) => b.duration.localeCompare(a.duration));
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24);
    
    if (diff < 1) return "Today";
    if (diff < 2) return "Yesterday";
    if (diff < 7) return `${Math.floor(diff)} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get course level badge color
  const getLevelBadgeColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  // Toggle favorite status
  const toggleFavorite = (courseId) => {
    setEnrolledCourses(prev => 
      prev.map(c => c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c)
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}>
            Loading...
          </Spinner>
          <p className="mt-3 text-muted">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-5">
        <Alert color="danger" className="d-flex align-items-center">
          <AlertCircle size={20} className="me-2" />
          <div>
            <strong>Error!</strong> {error}
            <Button 
              color="link" 
              className="ms-3 p-0" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const userData = getUserData();

  return (
    <div className="p-4 mt-5 bg-light min-vh-100">
      {/* Welcome Header */}
      <div className="mb-4">
        <h2 className="mb-1">
          Welcome back, {userData?.name || "Learner"}! 
          <span className="h5 text-muted ms-2">👋</span>
        </h2>
        <p className="text-muted">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col sm="6" lg="3">
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Courses</h6>
                  <h3 className="mb-0">{stats.totalCourses}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="3">
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                  <CheckCircle size={24} className="text-success" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Completed</h6>
                  <h3 className="mb-0">{stats.completedCourses}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="3">
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-3 me-3">
                  <Clock size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">In Progress</h6>
                  <h3 className="mb-0">{stats.inProgressCourses}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="3">
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                  <Award size={24} className="text-info" />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Certificates</h6>
                  <h3 className="mb-0">{stats.certificatesEarned}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Progress Overview */}
      {/* <Card className="border-0 shadow-sm mb-4">
        <CardBody>
          <Row>
            <Col md="6">
              <h6 className="text-muted mb-3">Overall Progress</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1 me-3">
                  <Progress multi>
                    <Progress bar color="success" value={stats.averageProgress} />
                  </Progress>
                </div>
                <span className="fw-bold">{stats.averageProgress}%</span>
              </div>
              <div className="d-flex gap-3">
                <div>
                  <span className="badge bg-success me-2">&nbsp;</span>
                  <small>Completed ({stats.completedCourses})</small>
                </div>
                <div>
                  <span className="badge bg-warning me-2">&nbsp;</span>
                  <small>In Progress ({stats.inProgressCourses})</small>
                </div>
              </div>
            </Col>
            <Col md="6">
              <Row className="g-3">
                <Col sm="6">
                  <div className="d-flex align-items-center">
                    <BarChart2 size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Lessons Completed</small>
                      <strong>{stats.completedLessons}/{stats.totalLessons}</strong>
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="d-flex align-items-center">
                    <Clock size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Hours Spent</small>
                      <strong>{stats.completedHours}h/{stats.totalHours}h</strong>
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="d-flex align-items-center">
                    <TrendingUp size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Points Earned</small>
                      <strong>{stats.totalPoints}</strong>
                    </div>
                  </div>
                </Col>
                <Col sm="6">
                  <div className="d-flex align-items-center">
                    <Award size={18} className="text-primary me-2" />
                    <div>
                      <small className="text-muted d-block">Certificates</small>
                      <strong>{stats.certificatesEarned}</strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card> */}

      {/* Search and Filter Bar */}
      {/* <Row className="mb-4 align-items-center">
        <Col md="6">
          <InputGroup>
            <InputGroupText>
              <Search size={18} />
            </InputGroupText>
            <Input
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md="6">
          <div className="d-flex justify-content-md-end mt-3 mt-md-0">
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle color="light" className="me-2">
                <Filter size={18} className="me-2" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setSortBy("recent")}>Recent Activity</DropdownItem>
                <DropdownItem onClick={() => setSortBy("progress")}>Progress</DropdownItem>
                <DropdownItem onClick={() => setSortBy("title")}>Title</DropdownItem>
                <DropdownItem onClick={() => setSortBy("duration")}>Duration</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row> */}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5">
          <CardBody>
            <BookOpen size={48} className="text-muted mb-3" />
            <h5>No courses found</h5>
            <p className="text-muted mb-3">
              {searchTerm 
                ? "Try adjusting your search" 
                : "Start your learning journey by enrolling in a course"}
            </p>
            <Button tag={Link} to="/courses" color="primary">
              Browse Courses
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredCourses.map((course) => (
            <Col lg="3" md="6" key={course.id}>
              <Card className="border-0 shadow-sm h-100 hover-lift">
                {/* Course Header with Color */}
                <div
                  className="position-relative rounded-top"
                  style={{
                    background: course.color,
                    height: 160,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)'
                  }}
                >
                  {/* Play Button Overlay */}
                  <Link
                    to={`/student/continue-courses/${course.id}`}
                    className="position-absolute top-50 start-50 translate-middle text-white"
                    style={{ zIndex: 2 }}
                  >
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <Play size={32} fill="white" />
                    </div>
                  </Link>
                  
                  {/* Favorite Button */}
                  <Button
                    color="link"
                    className="position-absolute top-0 end-0 m-2 text-white"
                    onClick={() => toggleFavorite(course.id)}
                  >
                    <Bookmark 
                      size={20} 
                      fill={course.isFavorite ? "white" : "none"} 
                    />
                  </Button>

                  {/* Category Badge */}
                  <Badge 
                    color="light" 
                    className="position-absolute bottom-0 start-0 m-3"
                  >
                    {course.category}
                  </Badge>
                </div>

                <CardBody>
                  {/* Title and Level */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0 me-2">{course.title}</h5>
                    <Badge color={getLevelBadgeColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  {/* Instructor with Initials */}
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: getInitialsColor(course.instructor),
                        fontSize: '10px'
                      }}
                    >
                      {getInitials(course.instructor)}
                    </div>
                    <small className="text-muted">{course.instructor}</small>
                  </div>

                  {/* Course Description */}
                  <p className="text-muted small mb-3">
                    {course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="mb-3">
                    {course.skills.slice(0, 3).map((skill, index) => (
                      <Badge 
                        key={index} 
                        color="light" 
                        className="me-1 mb-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Progress</small>
                      <small className="fw-bold">{course.progress}%</small>
                    </div>
                    <Progress value={course.progress} />
                  </div>

                  {/* Course Stats */}
                  <Row className="g-2 mb-3">
                    <Col xs="6">
                      <div className="d-flex align-items-center">
                        <BookOpen size={14} className="text-muted me-1" />
                        <small className="text-muted">
                          {course.completedLessons}/{course.totalLessons} Lessons
                        </small>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="d-flex align-items-center">
                        <Clock size={14} className="text-muted me-1" />
                        <small className="text-muted">{course.duration}</small>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="d-flex align-items-center">
                        <Star size={14} className="text-warning me-1" />
                        <small className="text-muted">{course.rating} ({course.totalRating})</small>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="d-flex align-items-center">
                        <Users size={14} className="text-muted me-1" />
                        <small className="text-muted">{course.language}</small>
                      </div>
                    </Col>
                  </Row>

                  {/* Last Accessed */}
                  <div className="d-flex align-items-center mb-3">
                    <Calendar size={14} className="text-muted me-1" />
                    <small className="text-muted">
                      Last accessed: {formatDate(course.lastAccessed)}
                    </small>
                  </div>

                  {/* Next Lesson */}
                  {course.progress < 100 && course.nextLesson && (
                    <div className="bg-light p-2 rounded-3 mb-3">
                      <small className="text-muted d-block">Next up:</small>
                      <small className="fw-bold">{course.nextLesson}</small>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <Button
                      tag={Link}
                      to={`/student/continue-courses/${course.id}`}
                      color="primary"
                      className="flex-grow-1"
                    >
                      {course.progress > 0 ? "Continue" : "Start"} Learning
                    </Button>
                    
                    {course.certificateIssued && (
                      <Button 
                        color="success" 
                        tag={Link} 
                        to={course.certificateUrl}
                        target="_blank"
                      >
                        <Award size={18} />
                      </Button>
                    )}
                    
                    {/* <Button color="light">
                      <Share2 size={18} />
                    </Button> */}
                  </div>

                  {/* Milestone Badges */}
                  {course.milestones.length > 0 && (
                    <div className="mt-3">
                      {course.milestones.map((milestone, index) => (
                        <Badge 
                          key={index}
                          color="success" 
                          pill 
                          className="me-1"
                        >
                          <CheckCircle size={12} className="me-1" />
                          {milestone}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MyCourses;