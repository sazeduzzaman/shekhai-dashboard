import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Settings,
  Maximize,
  Pause,
  Play,
  ChevronLeft,
  Volume2,
  Download,
  Star,
  BookOpen,
  ThumbsUp,
  ChevronDown,
  ChevronRight,
} from "react-feather";

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

  const [activeTab, setActiveTab] = useState("overview");
  const [showNotes, setShowNotes] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [courseProgress, setCourseProgress] = useState(24);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [expandedModules, setExpandedModules] = useState([1, 2]); // Module IDs that are expanded by default

  // Course Data
  const course = {
    id: courseId,
    title: "React Fundamentals Masterclass",
    instructor: {
      name: "Sarah Johnson",
      role: "Senior Frontend Engineer @ Vercel",
      rating: 4.9,
      students: 12450,
      avatar: "SJ",
    },
    category: "Web Development",
    level: "Beginner",
    duration: "12h 30m",
    lessons: 48,
    rating: 4.8,
    enrolled: 12450,
  };

  // Nested Syllabus Data with Modules
  const syllabusModules = [
    {
      id: 1,
      title: "Module 1: React Fundamentals",
      description: "Learn the core concepts of React",
      duration: "2h 15m",
      status: "completed",
      items: [
        {
          id: 101,
          title: "Introduction to React Ecosystem",
          duration: "05:20",
          status: "completed",
          type: "video",
          resources: 2,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        {
          id: 102,
          title: "Understanding JSX & Virtual DOM",
          duration: "15:45",
          status: "completed",
          type: "video",
          resources: 1,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        },
        {
          id: 103,
          title: "Practice: Your First Component",
          duration: "10:00",
          status: "completed",
          type: "practice",
          resources: 0,
          videoUrl: null,
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: Environment & Setup",
      description: "Set up a professional development environment",
      duration: "1h 45m",
      status: "current",
      items: [
        {
          id: 201,
          title: "Setting up Modern React Environment",
          duration: "12:45",
          status: "current",
          type: "video",
          resources: 3,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        },
        {
          id: 202,
          title: "Vite Configuration Deep Dive",
          duration: "18:30",
          status: "locked",
          type: "video",
          resources: 4,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        },
        {
          id: 203,
          title: "ESLint & Prettier Setup",
          duration: "14:20",
          status: "locked",
          type: "video",
          resources: 2,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        },
      ],
    },
    {
      id: 3,
      title: "Module 3: Components & Props",
      description: "Master component creation and data flow",
      duration: "3h 30m",
      status: "locked",
      items: [
        {
          id: 301,
          title: "Understanding Component Lifecycle",
          duration: "18:30",
          status: "locked",
          type: "video",
          resources: 4,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
          id: 302,
          title: "Hands-on Practice: Building Components",
          duration: "25:15",
          status: "locked",
          type: "practice",
          resources: 2,
          videoUrl: null,
        },
        {
          id: 303,
          title: "Props, State & Re-rendering Explained",
          duration: "20:40",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        },
        {
          id: 304,
          title: "Quiz: Components & Props",
          duration: "15:00",
          status: "locked",
          type: "quiz",
          resources: 1,
          videoUrl: null,
        },
      ],
    },
    {
      id: 4,
      title: "Module 4: Hooks & State Management",
      description: "Master React Hooks and state patterns",
      duration: "4h 15m",
      status: "locked",
      items: [
        {
          id: 401,
          title: "React Hooks Deep Dive (useState & useEffect)",
          duration: "30:00",
          status: "locked",
          type: "video",
          resources: 5,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        },
        {
          id: 402,
          title: "Custom Hooks & Reusability",
          duration: "16:45",
          status: "locked",
          type: "video",
          resources: 2,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        },
        {
          id: 403,
          title: "Handling Events & User Interaction",
          duration: "14:55",
          status: "locked",
          type: "video",
          resources: 2,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        },
        {
          id: 404,
          title: "Forms, Controlled Inputs & Validation",
          duration: "22:30",
          status: "locked",
          type: "practice",
          resources: 4,
          videoUrl: null,
        },
      ],
    },
    {
      id: 5,
      title: "Module 5: Advanced Patterns",
      description: "Learn advanced React patterns and optimization",
      duration: "2h 45m",
      status: "locked",
      items: [
        {
          id: 501,
          title: "Conditional Rendering & Lists",
          duration: "17:10",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 502,
          title: "Performance Optimization Techniques",
          duration: "19:20",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 503,
          title: "Mini Project: Build a Dashboard",
          duration: "45:00",
          status: "locked",
          type: "project",
          resources: 6,
          videoUrl: null,
        },
        {
          id: 504,
          title: "Final Assessment & Certification Quiz",
          duration: "20:00",
          status: "locked",
          type: "quiz",
          resources: 1,
          videoUrl: null,
        },
      ],
    },
    {
      id: 6,
      title: "Module 5: Advanced Patterns",
      description: "Learn advanced React patterns and optimization",
      duration: "2h 45m",
      status: "locked",
      items: [
        {
          id: 501,
          title: "Conditional Rendering & Lists",
          duration: "17:10",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 502,
          title: "Performance Optimization Techniques",
          duration: "19:20",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 503,
          title: "Mini Project: Build a Dashboard",
          duration: "45:00",
          status: "locked",
          type: "project",
          resources: 6,
          videoUrl: null,
        },
        {
          id: 504,
          title: "Final Assessment & Certification Quiz",
          duration: "20:00",
          status: "locked",
          type: "quiz",
          resources: 1,
          videoUrl: null,
        },
      ],
    },
    {
      id: 7,
      title: "Module 5: Advanced Patterns",
      description: "Learn advanced React patterns and optimization",
      duration: "2h 45m",
      status: "locked",
      items: [
        {
          id: 501,
          title: "Conditional Rendering & Lists",
          duration: "17:10",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 502,
          title: "Performance Optimization Techniques",
          duration: "19:20",
          status: "locked",
          type: "video",
          resources: 3,
          videoUrl: null,
        },
        {
          id: 503,
          title: "Mini Project: Build a Dashboard",
          duration: "45:00",
          status: "locked",
          type: "project",
          resources: 6,
          videoUrl: null,
        },
        {
          id: 504,
          title: "Final Assessment & Certification Quiz",
          duration: "20:00",
          status: "locked",
          type: "quiz",
          resources: 1,
          videoUrl: null,
        },
      ],
    },
  ];

  // Resources Data
  const resources = [
    { id: 1, name: "Environment Setup Guide.pdf", type: "pdf", size: "2.4 MB" },
    {
      id: 2,
      name: "Vite Configuration Examples.zip",
      type: "zip",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "ESLint Rules Reference.md",
      type: "markdown",
      size: "120 KB",
    },
  ];

  // Set current video based on lesson
  useEffect(() => {
    // Flatten all items to find the current lesson
    const allItems = syllabusModules.flatMap((module) => module.items);
    const currentLesson = allItems.find(
      (item) => item.id === parseInt(lessonId || "201")
    );
    if (currentLesson && currentLesson.videoUrl) {
      setCurrentVideoUrl(currentLesson.videoUrl);
    }
  }, [lessonId]);

  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Calculate total completed items
  const getTotalCompleted = () => {
    return syllabusModules
      .flatMap((m) => m.items)
      .filter((item) => item.status === "completed").length;
  };

  // Calculate total items
  const getTotalItems = () => {
    return syllabusModules.flatMap((m) => m.items).length;
  };

  // Logic Handlers
  const handleTogglePlay = () => {
    setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayerState((prev) => ({ ...prev, played: value }));
    playerRef.current.seekTo(value);
  };

  const handleSeekMouseDown = () => {
    setPlayerState((prev) => ({ ...prev, seeking: true }));
  };

  const handleSeekMouseUp = () => {
    setPlayerState((prev) => ({ ...prev, seeking: false }));
    playerRef.current.seekTo(playerState.played);
  };

  const handleProgress = (state) => {
    if (!playerState.seeking) {
      setPlayerState((prev) => ({ ...prev, ...state }));
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleMarkComplete = () => {
    const newProgress = Math.min(100, courseProgress + 2);
    setCourseProgress(newProgress);

    const allItems = syllabusModules.flatMap((module) => module.items);
    const currentIndex = allItems.findIndex(
      (item) => item.id === parseInt(lessonId || "201")
    );
    if (currentIndex < allItems.length - 1) {
      const nextLesson = allItems[currentIndex + 1];
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
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
                onClick={() => navigate(-1)}
                style={{ width: "40px", height: "40px" }}
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 small">
                  Module 02 • Environment
                </span>
                <h1 className="h5 fw-bold mb-0 mt-1">
                  Setting up Modern React Environment
                </h1>
              </div>
            </div>

            {/* Right Side */}
            <div className="d-flex align-items-center gap-4">
              <div className="d-none d-md-block">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <small className="text-muted d-block">
                      Course Progress
                    </small>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="progress"
                        style={{ width: "120px", height: "6px" }}
                      >
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
                    {[
                      "Overview",
                      "Resources",
                      "Discussions",
                      "Notes",
                      "Quiz",
                    ].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link ${
                            activeTab === tab.toLowerCase()
                              ? "active border-0"
                              : "text-muted"
                          }`}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          style={{
                            borderBottom:
                              activeTab === tab.toLowerCase()
                                ? "2px solid #6366f1"
                                : "none",
                            fontWeight:
                              activeTab === tab.toLowerCase() ? "600" : "500",
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
                        In this comprehensive lesson, we dive deep into setting
                        up a professional React development environment. You'll
                        learn how to configure Vite for optimal performance, set
                        up ESLint with React-specific rules, and structure your
                        project for scalability.
                      </p>

                      <div className="row mb-4">
                        <div className="col-md-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <CheckCircle
                                  size={16}
                                  className="text-success"
                                />
                                <span>Configure Vite with React plugin</span>
                              </div>
                            </li>
                            <li className="mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <CheckCircle
                                  size={16}
                                  className="text-success"
                                />
                                <span>
                                  Set up ESLint with Airbnb configuration
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <CheckCircle
                                  size={16}
                                  className="text-success"
                                />
                                <span>Organize project folder structure</span>
                              </div>
                            </li>
                            <li className="mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <CheckCircle
                                  size={16}
                                  className="text-success"
                                />
                                <span>Configure absolute imports</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Instructor Card */}
                      <div className="bg-light p-4 rounded-4">
                        <div className="d-flex align-items-start">
                          <div
                            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              fontSize: "24px",
                            }}
                          >
                            {course.instructor.avatar}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h5 className="fw-bold mb-1">
                                  {course.instructor.name}
                                </h5>
                                <p className="text-muted small mb-0">
                                  {course.instructor.role}
                                </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <Star size={16} className="text-warning me-1" />
                                <span className="fw-bold">
                                  {course.instructor.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted small mb-0">
                              Sarah has been teaching React for over 5 years.
                              She specializes in helping beginners understand
                              complex concepts through practical, real-world
                              examples.
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
                          <div
                            key={resource.id}
                            className="list-group-item border-0 bg-light mb-2 rounded-3"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary-subtle p-2 rounded-3">
                                  <FileText
                                    size={20}
                                    className="text-primary"
                                  />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0">
                                    {resource.name}
                                  </h6>
                                  <small className="text-muted">
                                    {resource.type.toUpperCase()} •{" "}
                                    {resource.size}
                                  </small>
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
                        <button className="btn btn-primary">
                          Post Comment
                        </button>
                      </div>

                      <div className="border-top pt-4">
                        <div className="d-flex mb-3">
                          <div
                            className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            AC
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between mb-1">
                              <h6 className="fw-bold mb-0">Alex Chen</h6>
                              <small className="text-muted">2 hours ago</small>
                            </div>
                            <p className="mb-2">
                              Great explanation of Vite setup! The folder
                              structure example was very helpful.
                            </p>
                            <div className="d-flex gap-3">
                              <button className="btn btn-link btn-sm p-0 text-decoration-none">
                                <ThumbsUp size={14} className="me-1" />
                                Helpful (12)
                              </button>
                              <button className="btn btn-link btn-sm p-0 text-decoration-none">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">My Notes</h4>
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowNotes(!showNotes)}
                        >
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
                            <button className="btn btn-primary">
                              Save Note
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => setShowNotes(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <BookOpen size={48} className="text-muted mb-3" />
                          <p className="text-muted">
                            No notes yet. Click "Add Note" to start taking
                            notes.
                          </p>
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
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-4">
                    <div className="bg-primary-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-primary fs-4">
                        {getTotalItems()}
                      </div>
                      <small className="text-muted">Lessons</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-success fs-4">5</div>
                      <small className="text-muted">Quizzes</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-warning-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-warning fs-4">8</div>
                      <small className="text-muted">Projects</small>
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

                <div
                  className="accordion"
                  style={{ maxHeight: "780px", overflowY: "auto" }}
                >
                  {syllabusModules.map((module) => (
                    <div
                      key={module.id}
                      className="accordion-item border-0 mb-2"
                    >
                      {/* Module Header */}
                      <div
                        className={`accordion-header p-3 rounded-3 cursor-pointer transition-all ${
                          module.status === "current"
                            ? "bg-primary-subtle border border-primary-subtle"
                            : module.status === "completed"
                            ? "bg-light"
                            : "bg-white border"
                        } ${module.status === "locked" ? "opacity-50" : ""}`}
                        onClick={() =>
                          module.status !== "locked" && toggleModule(module.id)
                        }
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <div className="flex-shrink-0">
                              {getModuleStatusIcon(module.status)}
                            </div>
                            <div>
                              <h6
                                className={`fw-bold mb-1 ${
                                  module.status === "current"
                                    ? "text-primary"
                                    : ""
                                }`}
                              >
                                {module.title}
                              </h6>
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted">
                                  {module.items.length} lessons •{" "}
                                  {module.duration}
                                </small>
                                {module.status === "completed" && (
                                  <span className="badge bg-success-subtle text-success small">
                                    Completed
                                  </span>
                                )}
                                {module.status === "current" && (
                                  <span className="badge bg-primary-subtle text-primary small">
                                    In Progress
                                  </span>
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
                                  item.status === "current"
                                    ? "bg-primary-subtle border border-primary-subtle"
                                    : item.status === "completed"
                                    ? "bg-light"
                                    : "bg-white border"
                                } ${
                                  item.status === "locked" ? "opacity-50" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item.status !== "locked") {
                                    navigate(
                                      `/course/${courseId}/lesson/${item.id}`
                                    );
                                  }
                                }}
                              >
                                <div className="d-flex align-items-start">
                                  <div className="flex-shrink-0 me-3 mt-1">
                                    {getStatusIcon(item.status, item.type)}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <h6
                                        className={`fw-bold mb-1 ${
                                          item.status === "current"
                                            ? "text-primary"
                                            : ""
                                        }`}
                                      >
                                        {item.title}
                                      </h6>
                                      <div className="d-flex align-items-center gap-1">
                                        <Clock
                                          size={12}
                                          className="text-muted"
                                        />
                                        <small className="text-muted">
                                          {item.duration}
                                        </small>
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
        
        .form-range::-webkit-slider-thumb {
          background: #6366f1;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .form-range::-moz-range-thumb {
          background: #6366f1;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.3);
          height: 4px;
          border-radius: 2px;
        }
        
        input[type="range"]::-moz-range-track {
          background: rgba(255, 255, 255, 0.3);
          height: 4px;
          border-radius: 2px;
        }
        
        .form-select-sm {
          padding: 0.25rem 2rem 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .accordion-item {
          background: transparent;
        }
        
        .accordion-body {
          padding: 0.5rem 0;
        }
        
        .ms-4 {
          margin-left: 1rem;
        }
        
        .ps-2 {
          padding-left: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ContinueCourses;
