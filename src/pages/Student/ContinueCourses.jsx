import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Play,
  ChevronLeft,
  Download,
  Star,
  BookOpen,
  ThumbsUp,
  ChevronDown,
  ChevronRight,
  Loader,
  AlertCircle,
  Users
} from "react-feather";
import axios from "axios";

const ContinueCourses = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  // Unified State
  const [playerState, setPlayerState] = useState({
    playing: false,
    volume: 0.8,
    played: 0,
    loaded: 0,
    duration: 0,
    seeking: false,
  });

  const [course, setCourse] = useState(null);
  const [syllabusModules, setSyllabusModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotes, setShowNotes] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [courseProgress, setCourseProgress] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [expandedModules, setExpandedModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Get user token for API calls
  const getUserToken = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const userData = JSON.parse(authUser);
        return userData.token;
      }
    } catch (err) {
      console.log("Error parsing token:", err);
    }
    return null;
  };

  // Get user email
  const getUserEmail = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const userData = JSON.parse(authUser);
        return userData.user?.email || userData.email;
      }
    } catch (err) {
      console.log("Error parsing user data:", err);
    }
    return null;
  };

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getUserToken();

        // Fetch course details
        const courseResponse = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : ""
            }
          }
        );

        console.log("Course API Response:", courseResponse.data);

        if (courseResponse.data.success) {
          const courseData = courseResponse.data.course || courseResponse.data.data;
          
          // Handle category array
          const category = courseData.category;
          const categoryText = Array.isArray(category) 
            ? category.map(c => c.name || c.title || "General").join(", ")
            : category || "General";
          
          // Set course data
          setCourse({
            id: courseData._id || courseData.id,
            title: courseData.title || "Untitled Course",
            description: courseData.longDescription || courseData.shortDescription || courseData.description || "",
            instructor: {
              name: courseData.instructor?.name || "Expert Instructor",
              email: courseData.instructor?.email || "",
              role: courseData.instructor?.role || "Course Instructor",
              rating: 4.9,
              avatar: getInitials(courseData.instructor?.name || "EI")
            },
            category: categoryText,
            level: courseData.level || "Beginner",
            duration: `${courseData.totalDuration || 10}h`,
            rating: 4.5, // Default rating
            enrolled: courseData.enrolledStudents || 0,
            price: courseData.price || 0,
            bannerUrl: courseData.bannerUrl || courseData.image
          });

          // Fetch enrollment progress for this course
          await fetchEnrollmentProgress(courseData._id || courseData.id, token);

          // Generate syllabus from course data
          generateSyllabus(courseData);

          // Fetch or generate resources
          fetchResources(courseData);

        } else {
          setError("Failed to load course details");
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err.response?.data?.message || "Failed to load course. Please try again.");
        
        // Fallback to demo data
        setCourse(getDemoCourse());
        generateDemoSyllabus();
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "EI";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch enrollment progress
  const fetchEnrollmentProgress = async (courseId, token) => {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) return;

      const response = await axios.get(
        `https://shekhai-server.onrender.com/api/v1/enrollments/student/${userEmail}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          }
        }
      );

      if (response.data.success && response.data.data) {
        const enrollment = response.data.data.find(
          (enroll) => enroll.courseId === courseId
        );
        
        if (enrollment) {
          setCourseProgress(enrollment.progress || 0);
          
          // If there's a specific lesson to load
          if (lessonId) {
            handleLessonSelect(parseInt(lessonId));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching enrollment progress:", err);
    }
  };

  // Generate syllabus from course data
  const generateSyllabus = (courseData) => {
    // Use modules from course data
    const modules = courseData.modules || [];
    
    const syllabus = modules.map((module, index) => ({
      id: index + 1,
      title: module.title || module.name || `Module ${index + 1}`,
      description: module.description || "",
      duration: module.duration || "1h",
      status: index === 0 ? "current" : "locked",
      items: (module.lessons || module.videos || []).map((lesson, lessonIndex) => ({
        id: parseInt(`${index + 1}${lessonIndex + 1}`.padStart(3, '0')),
        title: lesson.title || `Lesson ${lessonIndex + 1}`,
        duration: lesson.duration || "10:00",
        status: index === 0 && lessonIndex === 0 ? "current" : "locked",
        type: lesson.type || "video",
        resources: lesson.resources || 0,
        videoUrl: lesson.videoUrl || lesson.url || null,
        description: lesson.description || ""
      }))
    }));

    // If no modules in course data, create a default module
    if (syllabus.length === 0) {
      const defaultSyllabus = [{
        id: 1,
        title: "Course Content",
        description: "All course lessons",
        duration: `${courseData.totalDuration || 10}h`,
        status: "current",
        items: [{
          id: 101,
          title: "Introduction",
          duration: "10:00",
          status: "current",
          type: "video",
          resources: 0,
          videoUrl: null,
          description: "Course introduction"
        }]
      }];
      setSyllabusModules(defaultSyllabus);
      
      // Set first video as current
      if (defaultSyllabus[0].items[0].videoUrl) {
        setCurrentVideoUrl(defaultSyllabus[0].items[0].videoUrl);
        setCurrentLesson(defaultSyllabus[0].items[0]);
      }
    } else {
      setSyllabusModules(syllabus);
      
      // Expand first module by default
      if (syllabus.length > 0) {
        setExpandedModules([1]);
        
        // Set first video as current
        if (syllabus[0].items.length > 0 && syllabus[0].items[0].videoUrl) {
          setCurrentVideoUrl(syllabus[0].items[0].videoUrl);
          setCurrentLesson(syllabus[0].items[0]);
        }
      }
    }
  };

  // Fetch resources
  const fetchResources = (courseData) => {
    // This would come from your API
    const demoResources = [
      { id: 1, name: "Course Materials.pdf", type: "pdf", size: "2.4 MB" },
      { id: 2, name: "Code Examples.zip", type: "zip", size: "1.8 MB" },
      { id: 3, name: "Reference Guide.md", type: "markdown", size: "120 KB" },
    ];
    setResources(demoResources);
  };

  // Demo data fallback
  const getDemoCourse = () => ({
    id: courseId,
    title: "Course Content",
    description: "Learn the fundamentals of this course",
    instructor: {
      name: "Expert Instructor",
      role: "Course Instructor",
      rating: 4.9,
      avatar: "EI"
    },
    category: "General",
    level: "Beginner",
    duration: "10h",
    rating: 4.5,
    enrolled: 0,
  });

  const generateDemoSyllabus = () => {
    const demoModules = [
      {
        id: 1,
        title: "Module 1: Course Introduction",
        description: "Get started with the course",
        duration: "1h",
        status: "current",
        items: [
          {
            id: 101,
            title: "Welcome to the Course",
            duration: "10:00",
            status: "current",
            type: "video",
            resources: 2,
            videoUrl: null,
            description: "Introduction to the course"
          },
        ],
      },
    ];
    
    setSyllabusModules(demoModules);
    setExpandedModules([1]);
    
    if (demoModules[0].items.length > 0) {
      setCurrentLesson(demoModules[0].items[0]);
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lessonId) => {
    const allItems = syllabusModules.flatMap((module) => module.items);
    const selectedLesson = allItems.find((item) => item.id === lessonId);
    
    if (selectedLesson) {
      setCurrentLesson(selectedLesson);
      if (selectedLesson.videoUrl) {
        setCurrentVideoUrl(selectedLesson.videoUrl);
      }
      
      // Update URL without page reload
      navigate(`/student/continue-courses/${courseId}/lesson/${lessonId}`, { replace: true });
    }
  };

  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Calculate totals
  const getTotalCompleted = () => {
    return syllabusModules
      .flatMap((m) => m.items)
      .filter((item) => item.status === "completed").length;
  };

  const getTotalItems = () => {
    return syllabusModules.flatMap((m) => m.items).length;
  };

  // Player handlers
  const handleTogglePlay = () => {
    setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayerState((prev) => ({ ...prev, played: value }));
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const handleSeekMouseDown = () => {
    setPlayerState((prev) => ({ ...prev, seeking: true }));
  };

  const handleSeekMouseUp = () => {
    setPlayerState((prev) => ({ ...prev, seeking: false }));
    if (playerRef.current) {
      playerRef.current.seekTo(playerState.played);
    }
  };

  const handleProgress = (state) => {
    if (!playerState.seeking) {
      setPlayerState((prev) => ({ ...prev, ...state }));
    }
  };

  const handleMarkComplete = () => {
    const newProgress = Math.min(100, courseProgress + 2);
    setCourseProgress(newProgress);

    const allItems = syllabusModules.flatMap((module) => module.items);
    const currentIndex = allItems.findIndex(
      (item) => item.id === (currentLesson?.id || parseInt(lessonId || "101"))
    );
    
    if (currentIndex < allItems.length - 1) {
      const nextLesson = allItems[currentIndex + 1];
      handleLessonSelect(nextLesson.id);
    }
  };

  const getStatusIcon = (status, type) => {
    if (status === "completed") {
      return <CheckCircle size={18} className="text-success" />;
    } else if (status === "current") {
      return <div className="current-dot"></div>;
    } else {
      return <Lock size={16} className="text-muted" />;
    }
  };

  const getTypeBadge = (type) => {
    const config = {
      video: { label: "Video", color: "primary" },
      practice: { label: "Practice", color: "warning" },
      quiz: { label: "Quiz", color: "danger" },
      project: { label: "Project", color: "success" },
    };
    const { label, color } = config[type] || config.video;
    return (
      <span
        className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle px-2 py-1 small`}
      >
        {label}
      </span>
    );
  };

  const getModuleStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} className="text-success" />;
      case "current":
        return <div className="current-dot-lg"></div>;
      case "locked":
        return <Lock size={18} className="text-muted" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Loader size={48} className="text-primary mb-3 animate-spin" />
          <h4 className="text-slate-700">Loading Course...</h4>
          <p className="text-muted">Please wait while we prepare your learning environment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center p-5">
          <AlertCircle size={64} className="text-danger mb-3" />
          <h4 className="text-slate-700 mb-2">Unable to Load Course</h4>
          <p className="text-muted mb-4">{error}</p>
          <button
            className="btn btn-primary me-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/student/my-courses")}
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-warning mb-3" />
          <h4 className="text-slate-700">Course Not Found</h4>
          <p className="text-muted">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 p-0 mt-5 pt-4 mb-5">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 sticky-top">
        <div className="container-fluid px-0">
          <div className="d-flex align-items-center w-100">
            {/* Left Side */}
            <div className="d-flex align-items-center me-auto">
              <button
                className="btn btn-outline-light border me-3 d-flex align-items-center justify-content-center rounded-3"
                onClick={() => navigate("/student/my-courses")}
                style={{ width: "40px", height: "40px" }}
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 small">
                  {course.category} • {course.level}
                </span>
                <h1 className="h5 fw-bold mb-0 mt-1">
                  {currentLesson?.title || course.title}
                </h1>
              </div>
            </div>

            {/* Right Side */}
            <div className="d-flex align-items-center gap-4">
              <div className="d-none d-md-block">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">Course Progress</small>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress" style={{ width: "120px", height: "6px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${courseProgress}%` }}
                        ></div>
                      </div>
                      <span className="fw-bold">{courseProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-4"
                onClick={handleMarkComplete}
              >
                <CheckCircle size={18} />
                <span>Complete Lesson</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-0">
        <div className="row g-0">
          {/* Main Content Column */}
          <div className="col-lg-8">
            <div className="p-4 pb-0">
              {/* Video Player */}
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                <div className="position-relative">
                  <div className="ratio ratio-16x9">
                    {currentVideoUrl ? (
                      <ReactPlayer
                        ref={playerRef}
                        url={currentVideoUrl}
                        width="100%"
                        height="100%"
                        playing={playerState.playing}
                        volume={playerState.volume}
                        playbackRate={playbackSpeed}
                        controls={true}
                        onProgress={handleProgress}
                        onDuration={(duration) =>
                          setPlayerState((prev) => ({ ...prev, duration }))
                        }
                        onEnded={() =>
                          setPlayerState((prev) => ({
                            ...prev,
                            playing: false,
                          }))
                        }
                        config={{ file: { attributes: { autoPlay: true } } }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-dark text-white h-100">
                        <div className="text-center">
                          <FileText size={48} className="mb-3" />
                          <p>No video available for this lesson</p>
                          <p className="small">Content coming soon!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {/* Tabs Header */}
                  <ul className="nav nav-tabs border-0 mb-4">
                    {["Overview", "Resources", "Discussions", "Notes", "Quiz"].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link ${
                            activeTab === tab.toLowerCase() ? "active border-0" : "text-muted"
                          }`}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          style={{
                            borderBottom: activeTab === tab.toLowerCase() ? "2px solid #6366f1" : "none",
                            fontWeight: activeTab === tab.toLowerCase() ? "600" : "500",
                          }}
                        >
                          {tab}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tab Content */}
                  {activeTab === "overview" && (
                    <div>
                      <h3 className="fw-bold mb-3">About this lesson</h3>
                      <p className="text-muted lh-lg mb-4">
                        {currentLesson?.description || course.description || "This lesson covers important concepts in the course."}
                      </p>

                      {/* Instructor Card */}
                      <div className="bg-light p-4 rounded-4">
                        <div className="d-flex align-items-start">
                          <div
                            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                            style={{ width: "60px", height: "60px", fontSize: "24px" }}
                          >
                            {course.instructor.avatar}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h5 className="fw-bold mb-1">{course.instructor.name}</h5>
                                <p className="text-muted small mb-0">{course.instructor.role}</p>
                              </div>
                              <div className="d-flex align-items-center">
                                <Star size={16} className="text-warning me-1" />
                                <span className="fw-bold">{course.instructor.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted small mb-0">
                              {course.instructor.email ? `Email: ${course.instructor.email}` : "Expert instructor with extensive experience."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resources Tab */}
                  {activeTab === "resources" && (
                    <div>
                      <h4 className="fw-bold mb-4">Lesson Resources</h4>
                      <div className="list-group">
                        {resources.map((resource) => (
                          <div key={resource.id} className="list-group-item border-0 bg-light mb-2 rounded-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary-subtle p-2 rounded-3">
                                  <FileText size={20} className="text-primary" />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0">{resource.name}</h6>
                                  <small className="text-muted">{resource.type.toUpperCase()} • {resource.size}</small>
                                </div>
                              </div>
                              <button className="btn btn-outline-primary btn-sm">
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discussions Tab */}
                  {activeTab === "discussions" && (
                    <div>
                      <h4 className="fw-bold mb-4">Discussion (24)</h4>
                      <div className="mb-4">
                        <textarea
                          className="form-control mb-3"
                          placeholder="Add a comment or ask a question..."
                          rows="3"
                        ></textarea>
                        <button className="btn btn-primary">Post Comment</button>
                      </div>
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">My Notes</h4>
                        <button className="btn btn-primary" onClick={() => setShowNotes(!showNotes)}>
                          {showNotes ? "Cancel" : "Add Note"}
                        </button>
                      </div>

                      {showNotes ? (
                        <div>
                          <textarea
                            className="form-control mb-3"
                            placeholder="Type your notes here..."
                            rows="4"
                          ></textarea>
                          <div className="d-flex gap-2">
                            <button className="btn btn-primary">Save Note</button>
                            <button className="btn btn-outline-secondary" onClick={() => setShowNotes(false)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <BookOpen size={48} className="text-muted mb-3" />
                          <p className="text-muted">No notes yet. Click "Add Note" to start taking notes.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="col-lg-4 border-start">
            <div className="p-4 bg-white">
              {/* Course Progress */}
              <div className="mb-5">
                <h4 className="fw-bold mb-3">Course Progress</h4>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Overall Progress</span>
                    <span className="fw-bold">{courseProgress}%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div className="progress-bar bg-primary" style={{ width: `${courseProgress}%` }}></div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-4">
                    <div className="bg-primary-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-primary fs-4">{getTotalItems()}</div>
                      <small className="text-muted">Lessons</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-success fs-4">{syllabusModules.filter(m => m.status === "completed").length}</div>
                      <small className="text-muted">Modules</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-warning-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-warning fs-4">
                        {courseProgress}%
                      </div>
                      <small className="text-muted">Progress</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Syllabus */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">Course Syllabus</h4>
                  <span className="badge bg-primary-subtle text-primary">
                    {getTotalCompleted()}/{getTotalItems()}
                  </span>
                </div>

                <div className="accordion" style={{ maxHeight: "780px", overflowY: "auto" }}>
                  {syllabusModules.map((module) => (
                    <div key={module.id} className="accordion-item border-0 mb-2">
                      {/* Module Header */}
                      <div
                        className={`accordion-header p-3 rounded-3 cursor-pointer transition-all ${
                          module.status === "current"
                            ? "bg-primary-subtle border border-primary-subtle"
                            : module.status === "completed"
                            ? "bg-light"
                            : "bg-white border"
                        } ${module.status === "locked" ? "opacity-50" : ""}`}
                        onClick={() => module.status !== "locked" && toggleModule(module.id)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <div className="flex-shrink-0">{getModuleStatusIcon(module.status)}</div>
                            <div>
                              <h6 className={`fw-bold mb-1 ${module.status === "current" ? "text-primary" : ""}`}>
                                {module.title}
                              </h6>
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted">
                                  {module.items.length} lessons • {module.duration}
                                </small>
                                {module.status === "completed" && (
                                  <span className="badge bg-success-subtle text-success small">Completed</span>
                                )}
                                {module.status === "current" && (
                                  <span className="badge bg-primary-subtle text-primary small">In Progress</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            {expandedModules.includes(module.id) ? (
                              <ChevronDown size={20} className="text-muted" />
                            ) : (
                              <ChevronRight size={20} className="text-muted" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Module Items (Collapsible) */}
                      {expandedModules.includes(module.id) && (
                        <div className="accordion-body p-0 mt-2">
                          <div className="ms-4 ps-2 border-start border-2 border-light">
                            {module.items.map((item) => (
                              <div
                                key={item.id}
                                className={`list-group-item border-0 rounded-3 mb-2 cursor-pointer transition-all p-3 ${
                                  item.id === currentLesson?.id
                                    ? "bg-primary-subtle border border-primary-subtle"
                                    : item.status === "completed"
                                    ? "bg-light"
                                    : "bg-white border"
                                } ${item.status === "locked" ? "opacity-50" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.status !== "locked") {
                                    handleLessonSelect(item.id);
                                  }
                                }}
                              >
                                <div className="d-flex align-items-start">
                                  <div className="flex-shrink-0 me-3 mt-1">
                                    {getStatusIcon(item.status, item.type)}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <h6 className={`fw-bold mb-1 ${item.id === currentLesson?.id ? "text-primary" : ""}`}>
                                        {item.title}
                                      </h6>
                                      <div className="d-flex align-items-center gap-1">
                                        <Clock size={12} className="text-muted" />
                                        <small className="text-muted">{item.duration}</small>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      {getTypeBadge(item.type)}
                                      {item.resources > 0 && (
                                        <small className="text-muted d-flex align-items-center gap-1">
                                          <FileText size={12} />
                                          {item.resources} resources
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        
        .current-dot {
          width: 12px;
          height: 12px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }
        
        .current-dot-lg {
          width: 20px;
          height: 20px;
          background: #6366f1;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        .list-group-item:hover:not(.opacity-50),
        .accordion-header:hover:not(.opacity-50) {
          background-color: #f8fafc;
        }
        
        .accordion-body {
          transition: all 0.3s ease;
        }
        
        .border-light {
          border-color: #e9ecef !important;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ContinueCourses;