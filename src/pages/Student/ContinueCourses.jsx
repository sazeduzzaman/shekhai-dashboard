import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ChevronDown,
  ChevronRight,
  Loader,
  AlertCircle,
  Bookmark,
  MessageCircle,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  Code,
  Youtube,
  Award,
  RefreshCw,
  HelpCircle
} from "react-feather";
import axios from "axios";
import Syllabus from "./Syllabus";
import { quizService } from "../../services/quizService";

const ContinueCourses = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoContainerRef = useRef(null);

  // Video State
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackSpeed: 1.0,
    isFullscreen: false
  });

  const [course, setCourse] = useState(null);
  const [syllabusModules, setSyllabusModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotes, setShowNotes] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [expandedModules, setExpandedModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [quizState, setQuizState] = useState({
    currentQuizId: null,
    quizData: null,
    answers: {},
    attemptId: null,
    results: null,
    loading: false,
    error: null,
    started: false,
    timeRemaining: null
  });
  const [bookmarks, setBookmarks] = useState([]);
  const [userProgress, setUserProgress] = useState({
    lastWatched: null,
    completedLessons: [],
    timeSpent: 0,
    lastActive: null
  });
  const [enrollment, setEnrollment] = useState(null);
  const [videoId, setVideoId] = useState("");

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

  // Get user data
  const getUserData = () => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        return JSON.parse(authUser);
      }
    } catch (err) {
      console.log("Error parsing user data:", err);
    }
    return null;
  };

  // Get user email
  const getUserEmail = () => {
    const userData = getUserData();
    return userData?.user?.email || userData?.email;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return "EI";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Find lesson by ID
  const findLessonById = (lessonId) => {
    for (const module of syllabusModules) {
      const lesson = module.lessons?.find(item => item._id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  // Find first video lesson
  const findFirstVideoLesson = (modules) => {
    for (const module of modules) {
      if (module.lessons) {
        const videoLesson = module.lessons.find(l => l.type === "video" && l.status === "unlocked");
        if (videoLesson) return videoLesson;
      }
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

        const courseResponse = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : ""
            }
          }
        );

        if (courseResponse.data.success) {
          const courseData = courseResponse.data.course || courseResponse.data.data;
          setCourse(courseData);

          // Process modules and map quiz IDs
          if (courseData.modules && courseData.modules.length > 0) {
            const processedModules = courseData.modules.map(module => ({
              ...module,
              lessons: module.lessons?.map(lesson => {
                // If lesson is quiz type, ensure it has quizId
                if (lesson.type === "quiz" && !lesson.quizId && courseData.allQuizzes?.length > 0) {
                  // You might need to map specific quiz to lesson based on order or index
                  const quizIndex = module.lessons.findIndex(l => l._id === lesson._id);
                  return {
                    ...lesson,
                    quizId: courseData.allQuizzes[quizIndex] || courseData.allQuizzes[0]
                  };
                }
                return lesson;
              })
            }));
            
            setSyllabusModules(processedModules);

            if (processedModules.length > 0) {
              setExpandedModules([processedModules[0]._id]);
              const firstVideoLesson = findFirstVideoLesson(processedModules);
              if (firstVideoLesson) {
                setCurrentLesson(firstVideoLesson);
                if (firstVideoLesson.videoUrl) {
                  setCurrentVideoUrl(firstVideoLesson.videoUrl);
                  setVideoId(extractYouTubeId(firstVideoLesson.videoUrl));
                }
              }
            }
          }

          await fetchEnrollmentAndProgress(courseData._id, token);
          await fetchDiscussions(courseData._id, token);
          await fetchNotes(courseData._id, token);
          await fetchBookmarks(courseData._id, token);

        } else {
          setError("Failed to load course details");
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err.response?.data?.message || "Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Load specific lesson from URL
  useEffect(() => {
    if (lessonId && syllabusModules.length > 0) {
      const foundLesson = findLessonById(lessonId);
      if (foundLesson) {
        handleLessonSelect(foundLesson);
      }
    }
  }, [lessonId, syllabusModules]);

  // Quiz timer effect
  useEffect(() => {
    let timer;
    if (quizState.started && quizState.timeRemaining > 0) {
      timer = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (quizState.timeRemaining === 0 && quizState.started) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
    return () => clearInterval(timer);
  }, [quizState.started, quizState.timeRemaining]);

  // Fetch enrollment
  const fetchEnrollmentAndProgress = async (courseId, token) => {
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
          setEnrollment(enrollment);
          setCourseProgress(enrollment.progress || 0);
          updateLessonStatusFromProgress(enrollment);
        }
      }
    } catch (err) {
      console.error("Error fetching enrollment progress:", err);
    }
  };

  // Update lesson status
  const updateLessonStatusFromProgress = (enrollment) => {
    if (!enrollment.completedLessons || !syllabusModules.length) return;
    setSyllabusModules(prevModules =>
      prevModules.map(module => ({
        ...module,
        lessons: module.lessons?.map(lesson => ({
          ...lesson,
          status: enrollment.completedLessons.includes(lesson._id) ? "completed" : lesson.status
        }))
      }))
    );
  };

  // Fetch discussions
  const fetchDiscussions = async (courseId, token) => {
    try {
      // Implement your discussions API call here
      setDiscussions([]);
    } catch (err) {
      console.error("Error fetching discussions:", err);
    }
  };

  // Fetch notes
  const fetchNotes = async (courseId, token) => {
    try {
      // Implement your notes API call here
      setNotes([]);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async (courseId, token) => {
    try {
      // Implement your bookmarks API call here
      setBookmarks([]);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  // Fetch quiz data
  const fetchQuizData = async (quizId) => {
    setQuizState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await quizService.getQuiz(quizId);
      if (response.success) {
        setQuizState(prev => ({
          ...prev,
          quizData: response.quiz || response.data,
          currentQuizId: quizId,
          loading: false
        }));
        setActiveTab("quiz");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setQuizState(prev => ({
        ...prev,
        error: err.response?.data?.message || "Failed to load quiz",
        loading: false
      }));
    }
  };

  // Start quiz attempt
  const handleStartQuiz = async () => {
    if (!quizState.currentQuizId) return;
    
    setQuizState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await quizService.startQuizAttempt(quizState.currentQuizId);
      if (response.success) {
        setQuizState(prev => ({
          ...prev,
          attemptId: response.attempt?._id || response.data?._id,
          started: true,
          timeRemaining: response.attempt?.timeLimit || quizState.quizData?.timeLimit || 3600,
          loading: false
        }));
      }
    } catch (err) {
      console.error("Error starting quiz:", err);
      setQuizState(prev => ({
        ...prev,
        error: err.response?.data?.message || "Failed to start quiz",
        loading: false
      }));
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    if (window.event) {
      window.event.preventDefault();
      window.event.stopPropagation();
    }

    setCurrentLesson(lesson);

    // Reset quiz state
    setQuizState({
      currentQuizId: null,
      quizData: null,
      answers: {},
      attemptId: null,
      results: null,
      loading: false,
      error: null,
      started: false,
      timeRemaining: null
    });

    if (lesson.type === "video" && lesson.videoUrl) {
      setCurrentVideoUrl(lesson.videoUrl);
      setVideoId(extractYouTubeId(lesson.videoUrl));
      setActiveTab("overview");
    } else if (lesson.type === "quiz") {
      setCurrentVideoUrl("");
      setVideoId("");
      const quizId = lesson.quizId || course?.allQuizzes?.[0];
      if (quizId) {
        fetchQuizData(quizId);
      }
    } else {
      setCurrentVideoUrl("");
      setVideoId("");
      setActiveTab("overview");
    }

    saveProgress({ lastWatched: lesson._id });
  };

  // Toggle module
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Save progress
  const saveProgress = async (progressUpdate = {}) => {
    try {
      const token = getUserToken();
      const userId = getUserId();
      if (!userId || !course || !enrollment) return;

      const updatedProgress = {
        ...userProgress,
        ...progressUpdate,
        lastActive: new Date().toISOString()
      };

      setUserProgress(updatedProgress);

      await axios.patch(
        `https://shekhai-server.onrender.com/api/v1/enrollments/${enrollment._id}/progress`,
        {
          progress: courseProgress,
          lastWatched: progressUpdate.lastWatched || userProgress.lastWatched,
          timeSpent: updatedProgress.timeSpent
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          }
        }
      );

    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  // Mark lesson complete
  const handleMarkComplete = async () => {
    if (!currentLesson || !enrollment) return;

    try {
      const token = getUserToken();
      const response = await axios.post(
        `https://shekhai-server.onrender.com/api/v1/enrollments/${enrollment._id}/complete-lesson`,
        { lessonId: currentLesson._id },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          }
        }
      );

      if (response.data.success) {
        setCourseProgress(response.data.progress);
        setSyllabusModules(prevModules =>
          prevModules.map(module => ({
            ...module,
            lessons: module.lessons?.map(lesson =>
              lesson._id === currentLesson._id
                ? { ...lesson, status: "completed" }
                : lesson
            )
          }))
        );

        const allLessons = syllabusModules.flatMap(m => m.lessons || []);
        const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);

        if (currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          handleLessonSelect(nextLesson);
        }
      }
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer }
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    if (!quizState.currentQuizId || !quizState.quizData) return;

    setQuizState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await quizService.submitQuizAttempt(
        quizState.currentQuizId,
        quizState.answers
      );

      if (response.success) {
        setQuizState(prev => ({
          ...prev,
          results: response.results || response.data,
          started: false,
          loading: false
        }));

        if (response.passed || response.results?.passed) {
          handleMarkComplete();
        }
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setQuizState(prev => ({
        ...prev,
        error: err.response?.data?.message || "Failed to submit quiz",
        loading: false
      }));
    }
  };

  // Video controls
  const handlePlay = () => setVideoState(prev => ({ ...prev, isPlaying: true }));
  const handlePause = () => setVideoState(prev => ({ ...prev, isPlaying: false }));
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
      setVideoState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setVideoState(prev => ({ ...prev, isFullscreen: false }));
    }
  };

  const toggleMute = () => setVideoState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  const handleVolumeChange = (e) => setVideoState(prev => ({ ...prev, volume: parseFloat(e.target.value) }));
  const handlePlaybackSpeedChange = (speed) => setVideoState(prev => ({ ...prev, playbackSpeed: speed }));

  // YouTube iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.info && event.data.info.currentTime) {
        setVideoState(prev => ({
          ...prev,
          currentTime: event.data.info.currentTime,
          duration: event.data.info.duration || prev.duration
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Calculate totals
  const getTotalLessons = () => {
    return syllabusModules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  };

  const getCompletedLessons = () => {
    return syllabusModules.reduce((total, module) => 
      total + (module.lessons?.filter(l => l.status === "completed").length || 0), 0
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Loader size={48} className="text-primary mb-3 animate-spin" />
          <h4>Loading Course...</h4>
          <p className="text-muted">Please wait while we prepare your learning environment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center p-5">
          <AlertCircle size={64} className="text-danger mb-3" />
          <h4 className="mb-2">Unable to Load Course</h4>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary me-2" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/student/my-courses")}>
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
          <h4>Course Not Found</h4>
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
                  {course.category?.[0]?.name || "General"} • {course.level || "Beginner"}
                </span>
                <h1 className="h5 fw-bold mb-0 mt-1">
                  {currentLesson?.title || course.title}
                </h1>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4">
              {currentLesson && currentLesson.status !== "completed" && (
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 px-4"
                  onClick={handleMarkComplete}
                >
                  <CheckCircle size={18} />
                  <span>Complete Lesson</span>
                </button>
              )}
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
              {currentLesson?.type === "video" && videoId && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4" ref={videoContainerRef}>
                  <div className="bg-dark text-white p-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <Youtube size={20} className="text-danger" />
                      <h6 className="mb-0 fw-semibold">{currentLesson.title}</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">{formatDuration(currentLesson.duration)}</span>
                    </div>
                  </div>

                  <div className="ratio ratio-16x9 bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=${videoState.isPlaying ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                      title={currentLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-0"
                    ></iframe>
                  </div>

                  <div className="bg-light p-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={videoState.isPlaying ? handlePause : handlePlay}
                      >
                        {videoState.isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                      </button>

                      <div className="d-flex align-items-center gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                          style={{ width: "32px", height: "32px" }}
                          onClick={toggleMute}
                        >
                          {videoState.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={videoState.volume}
                          onChange={handleVolumeChange}
                          style={{ width: "60px" }}
                        />
                      </div>

                      <span className="text-muted small ms-2">
                        {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          {videoState.playbackSpeed}x
                        </button>
                        <ul className="dropdown-menu">
                          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                            <li key={speed}>
                              <button
                                className={`dropdown-item ${videoState.playbackSpeed === speed ? 'active' : ''}`}
                                onClick={() => handlePlaybackSpeedChange(speed)}
                              >
                                {speed}x
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="btn btn-sm btn-outline-warning rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => {}}
                        title="Bookmark this moment"
                      >
                        <Bookmark size={18} />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={toggleFullscreen}
                      >
                        {videoState.isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                      </button>
                    </div>
                  </div>

                  {currentLesson.description && (
                    <div className="p-3 bg-white border-top">
                      <p className="small text-muted mb-0">{currentLesson.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder for non-video lessons */}
              {(!currentLesson || currentLesson.type !== "video") && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-light">
                  <div className="p-5 text-center">
                    {currentLesson?.type === "quiz" ? (
                      <HelpCircle size={48} className="text-primary mb-3" />
                    ) : currentLesson?.type === "practice" ? (
                      <Code size={48} className="text-warning mb-3" />
                    ) : (
                      <FileText size={48} className="text-muted mb-3" />
                    )}
                    <h5>{currentLesson?.title || "No Content"}</h5>
                    <p className="text-muted">
                      {currentLesson?.type === "quiz" 
                        ? "Complete the quiz in the Quiz tab below" 
                        : currentLesson?.type === "practice"
                        ? "Complete the practice exercise in the Overview tab below"
                        : "Select a video lesson to start learning"}
                    </p>
                  </div>
                </div>
              )}

              {/* Tabs Section */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {/* Tabs Header */}
                  <ul className="nav nav-tabs border-0 mb-4">
                    {["Overview", "Resources", "Discussions", "Notes", "Quiz"].map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          className={`nav-link ${activeTab === tab.toLowerCase() ? "active border-0" : "text-muted"}`}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          style={{
                            borderBottom: activeTab === tab.toLowerCase() ? "2px solid #6366f1" : "none",
                            fontWeight: activeTab === tab.toLowerCase() ? "600" : "500",
                          }}
                        >
                          {tab}
                          {tab === "Quiz" && quizState.quizData && (
                            <span className="badge bg-primary ms-2">{quizState.quizData.questions?.length || 0}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Tab Content */}
                  {activeTab === "overview" && (
                    <div>
                      <h3 className="fw-bold mb-3">About this lesson</h3>
                      <p className="text-muted lh-lg mb-4">
                        {currentLesson?.description || course.longDescription || course.shortDescription || "No description available."}
                      </p>

                      {currentLesson?.type === "practice" && currentLesson.content?.instructions && (
                        <div className="mt-4 p-4 bg-warning-subtle rounded-4">
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <Code size={24} className="text-warning" />
                            <h5 className="mb-0">Practice Exercise</h5>
                          </div>
                          <div className="bg-white p-3 rounded-3">
                            <h6>Instructions:</h6>
                            <p>{currentLesson.content.instructions}</p>
                          </div>
                        </div>
                      )}

                      {course.instructor && (
                        <div className="bg-light p-4 rounded-4 mt-4">
                          <div className="d-flex align-items-start">
                            <div
                              className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3"
                              style={{ width: "60px", height: "60px", fontSize: "24px" }}
                            >
                              {getInitials(course.instructor.name)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h5 className="fw-bold mb-1">{course.instructor.name}</h5>
                                  <p className="text-muted small mb-0">{course.instructor.role || "Instructor"}</p>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Star size={16} className="text-warning me-1" />
                                  <span className="fw-bold">{course.instructor.rating || "4.5"}</span>
                                </div>
                              </div>
                              <p className="text-muted small mb-0">
                                {course.instructor.email || "Expert instructor"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resources Tab */}
                  {activeTab === "resources" && (
                    <div>
                      <h4 className="fw-bold mb-4">Lesson Resources</h4>
                      <div className="list-group">
                        {currentLesson?.content?.resources?.length > 0 ? (
                          currentLesson.content.resources.map((resource, index) => (
                            <div key={index} className="list-group-item border-0 bg-light mb-2 rounded-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="bg-primary-subtle p-2 rounded-3">
                                    <FileText size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <h6 className="fw-bold mb-0">{resource.name || `Resource ${index + 1}`}</h6>
                                    <small className="text-muted">{resource.type?.toUpperCase() || "FILE"}</small>
                                  </div>
                                </div>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => window.open(resource.url, '_blank')}>
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted text-center py-4">No resources available for this lesson.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Discussions Tab */}
                  {activeTab === "discussions" && (
                    <div>
                      <h4 className="fw-bold mb-4">Discussion ({discussions.length})</h4>
                      <div className="mb-4">
                        <textarea
                          className="form-control mb-3"
                          placeholder="Add a comment or ask a question..."
                          rows="3"
                          value={newDiscussion}
                          onChange={(e) => setNewDiscussion(e.target.value)}
                        ></textarea>
                        <button className="btn btn-primary">Post Comment</button>
                      </div>

                      {discussions.map((discussion) => (
                        <div key={discussion._id} className="mb-3 p-3 bg-light rounded-3">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: "32px", height: "32px", fontSize: "14px" }}>
                              {getInitials(discussion.user?.name)}
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold">{discussion.user?.name}</h6>
                              <small className="text-muted">{new Date(discussion.createdAt).toLocaleDateString()}</small>
                            </div>
                          </div>
                          <p className="mb-0">{discussion.content}</p>
                        </div>
                      ))}
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
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                          ></textarea>
                          <div className="d-flex gap-2">
                            <button className="btn btn-primary">Save Note</button>
                            <button className="btn btn-outline-secondary" onClick={() => setShowNotes(false)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : notes.length > 0 ? (
                        notes.map((note) => (
                          <div key={note._id} className="mb-3 p-3 bg-light rounded-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <small className="text-muted">
                                {new Date(note.createdAt).toLocaleString()}
                              </small>
                              <button className="btn btn-sm btn-outline-danger">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="mb-0">{note.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-5">
                          <BookOpen size={48} className="text-muted mb-3" />
                          <p className="text-muted">No notes yet. Click "Add Note" to start taking notes.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz Tab */}
                  {activeTab === "quiz" && (
                    <div>
                      {/* Quiz Header */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h4 className="fw-bold mb-1">{quizState.quizData?.title || "Quiz"}</h4>
                          {quizState.quizData?.description && (
                            <p className="text-muted small mb-0">{quizState.quizData.description}</p>
                          )}
                        </div>
                        {quizState.currentQuizId && (
                          <span className="badge bg-secondary">ID: {quizState.currentQuizId.slice(-6)}</span>
                        )}
                      </div>

                      {/* Quiz Timer */}
                      {quizState.started && quizState.timeRemaining > 0 && (
                        <div className="alert alert-info mb-4">
                          <Clock size={18} className="me-2" />
                          Time Remaining: {Math.floor(quizState.timeRemaining / 60)}:
                          {(quizState.timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                      )}

                      {/* Loading State */}
                      {quizState.loading && (
                        <div className="text-center py-5">
                          <Loader size={48} className="text-primary mb-3 animate-spin" />
                          <p>Loading quiz...</p>
                        </div>
                      )}

                      {/* Error State */}
                      {quizState.error && !quizState.loading && (
                        <div className="alert alert-danger">
                          <AlertCircle size={20} className="me-2" />
                          {quizState.error}
                        </div>
                      )}

                      {/* Quiz Not Started - Show Start Button */}
                      {quizState.quizData && !quizState.started && !quizState.results && !quizState.loading && (
                        <div className="text-center py-5">
                          <HelpCircle size={64} className="text-primary mb-3" />
                          <h5>Ready to start the quiz?</h5>
                          <p className="text-muted mb-4">
                            This quiz has {quizState.quizData.questions?.length || 0} questions.
                            {quizState.quizData.passingScore && (
                              <> Passing score: {quizState.quizData.passingScore}%</>
                            )}
                          </p>
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={handleStartQuiz}
                          >
                            <Play size={18} className="me-2" />
                            Start Quiz
                          </button>
                        </div>
                      )}

                      {/* Quiz Questions - Show when started */}
                      {quizState.quizData?.questions && quizState.started && !quizState.results && (
                        <div>
                          <div className="mb-3">
                            <p className="text-muted">
                              Question {Object.keys(quizState.answers).length + 1} of {quizState.quizData.questions.length}
                            </p>
                          </div>
                          {quizState.quizData.questions.map((question, index) => (
                            <div key={index} className="mb-4 p-3 bg-light rounded-3">
                              <p className="fw-bold mb-3">
                                {index + 1}. {question.text}
                                {question.points && (
                                  <span className="badge bg-secondary ms-2">{question.points} pts</span>
                                )}
                              </p>
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className="form-check mb-2">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`question-${index}`}
                                    id={`q${index}-opt${optIndex}`}
                                    checked={quizState.answers[index] === optIndex}
                                    onChange={() => handleQuizAnswer(index, optIndex)}
                                    disabled={!quizState.started}
                                  />
                                  <label className="form-check-label" htmlFor={`q${index}-opt${optIndex}`}>
                                    {option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ))}
                          
                          <button
                            className="btn btn-primary mt-3"
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(quizState.answers).length !== quizState.quizData.questions.length}
                          >
                            Submit Quiz ({Object.keys(quizState.answers).length}/{quizState.quizData.questions.length} answered)
                          </button>
                        </div>
                      )}

                      {/* Quiz Results */}
                      {quizState.results && (
                        <div className="text-center">
                          <div className="display-1 fw-bold text-primary">{quizState.results.score}%</div>
                          <p className="text-muted">
                            You answered {quizState.results.correctAnswers} out of {quizState.results.totalQuestions} correctly
                          </p>
                          
                          {/* Detailed Results */}
                          {quizState.results.questionResults && (
                            <div className="mt-4 text-start">
                              <h5>Detailed Results</h5>
                              {quizState.results.questionResults.map((result, index) => (
                                <div key={index} className="mb-3 p-3 bg-light rounded-3">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold">Question {index + 1}</span>
                                    {result.correct ? (
                                      <span className="badge bg-success">Correct</span>
                                    ) : (
                                      <span className="badge bg-danger">Incorrect</span>
                                    )}
                                  </div>
                                  <p className="mb-2">{result.question}</p>
                                  {!result.correct && result.correctAnswer && (
                                    <div className="alert alert-success py-2">
                                      <small>Correct answer: {result.correctAnswer}</small>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {quizState.results.passed ? (
                            <div className="alert alert-success mt-4">
                              <Award size={20} className="me-2" />
                              Congratulations! You passed the quiz.
                            </div>
                          ) : (
                            <div className="alert alert-warning mt-4">
                              <RefreshCw size={20} className="me-2" />
                              You didn't pass. Please review the material and try again.
                            </div>
                          )}

                          <button
                            className="btn btn-outline-primary mt-3"
                            onClick={() => {
                              setQuizState(prev => ({
                                ...prev,
                                results: null,
                                answers: {},
                                started: false
                              }));
                            }}
                          >
                            <RefreshCw size={16} className="me-2" />
                            Retry Quiz
                          </button>
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
                <div className="row g-2">
                  <div className="col-4">
                    <div className="bg-primary-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-primary fs-4">{getTotalLessons()}</div>
                      <small className="text-muted">Lessons</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-success fs-4">{course.totalModules || 0}</div>
                      <small className="text-muted">Modules</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-warning-subtle p-3 rounded-3 text-center">
                      <div className="fw-bold text-warning fs-4">{getCompletedLessons()}</div>
                      <small className="text-muted">Completed</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Syllabus */}
              <Syllabus
                syllabusModules={syllabusModules}
                currentLessonId={currentLesson?._id}
                expandedModules={expandedModules}
                onToggleModule={toggleModule}
                onSelectLesson={handleLessonSelect}
                getCompletedLessons={getCompletedLessons}
                getTotalLessons={getTotalLessons}
              />

              {/* Course Info */}
              <div className="mt-4 pt-4 border-top">
                <h5 className="fw-bold mb-3">Course Details</h5>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Category:</span>
                    <span className="fw-medium">{course.category?.[0]?.name || "General"}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Level:</span>
                    <span className="fw-medium">{course.level || "Beginner"}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Language:</span>
                    <span className="fw-medium">{course.language || "English"}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Total Duration:</span>
                    <span className="fw-medium">{formatDuration(course.totalDuration)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Certificate:</span>
                    <span className="fw-medium">{course.certificateIncluded ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ContinueCourses;