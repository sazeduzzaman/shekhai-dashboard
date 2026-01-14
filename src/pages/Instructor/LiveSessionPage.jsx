import React, { Component } from "react";
import { Link } from "react-router-dom";

class LiveSessionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      scheduledSessions: [],
      upcomingSessions: [],
      ongoingSessions: [],
      pastSessions: [],
      selectedCourse: "",
      isLoading: true,
      error: null,
      showCreateModal: false,
      showRecordingModal: false,
      newSession: {
        courseId: "",
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        meetingPlatform: "zoom",
        meetingLink: "",
        maxParticipants: 30,
        recordingEnabled: true,
      },
      selectedRecording: null,
    };
  }

  componentDidMount() {
    this.fetchCourses();
    this.loadMockSessions(); // In real app, fetch sessions from API
  }

  fetchCourses = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const response = await fetch(
        "https://shekhai-server-production.up.railway.app/api/v1/courses"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API data to match our format
      const transformedCourses = data.map((course) => ({
        id: course._id,
        name: course.title,
        code: course._id.substring(0, 8), // Use first 8 chars of ID as code
        description: course.shortDescription || "No description available",
        instructor: course.instructor?.name || "Instructor",
        instructorId: course.instructor?._id,
        price: course.price,
        category: course.category?.[0]?.name || "Uncategorized",
        level: course.level,
        modules: course.modules || [],
        totalModules: course.totalModules || 0,
        totalDuration: course.totalDuration || 0,
        bannerUrl: course.bannerUrl,
        published: course.published,
        purchasedBy: course.purchasedBy || [],
        enrollmentDeadline: course.enrollmentDeadline,
        color: this.getRandomColor(),
        students: course.purchasedBy?.length || 0,
      }));

      this.setState({
        courses: transformedCourses,
        selectedCourse:
          transformedCourses.length > 0 ? transformedCourses[0].id : "",
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      this.setState({
        error: "Failed to load courses. Please try again later.",
        courses: this.getMockCourses(), // Fallback to mock data
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadMockSessions = () => {
    // Mock session data - in real app, fetch from API
    const mockSessions = [
      {
        id: 1,
        courseId: this.state.courses.length > 0 ? this.state.courses[0].id : "",
        title: "Introduction to Derivatives",
        description: "Learn the basics of calculus derivatives",
        date: "2026-01-20",
        startTime: "10:00",
        endTime: "11:30",
        status: "scheduled",
        meetingPlatform: "zoom",
        meetingLink: "https://zoom.us/j/123456789",
        participants: 25,
        maxParticipants: 30,
        recordingAvailable: false,
        recordingUrl: "",
      },
      {
        id: 2,
        courseId: this.state.courses.length > 1 ? this.state.courses[1].id : "",
        title: "Linked Lists Implementation",
        description: "Practical implementation of linked lists",
        date: "2026-01-20",
        startTime: "14:00",
        endTime: "15:30",
        status: "live",
        meetingPlatform: "google_meet",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        participants: 18,
        maxParticipants: 25,
        recordingAvailable: false,
        recordingUrl: "",
      },
      {
        id: 3,
        courseId: this.state.courses.length > 2 ? this.state.courses[2].id : "",
        title: "Newton's Laws of Motion",
        description: "Understanding classical mechanics",
        date: "2026-01-19",
        startTime: "13:00",
        endTime: "14:30",
        status: "completed",
        meetingPlatform: "microsoft_teams",
        meetingLink:
          "https://teams.microsoft.com/l/meetup-join/19%3ameeting_123",
        participants: 22,
        maxParticipants: 30,
        recordingAvailable: true,
        recordingUrl: "https://example.com/recordings/physics-session",
      },
    ];

    const now = new Date();
    const upcoming = mockSessions.filter(
      (s) =>
        new Date(s.date + "T" + s.startTime) > now && s.status !== "completed"
    );
    const ongoing = mockSessions.filter((s) => s.status === "live");
    const past = mockSessions.filter(
      (s) =>
        s.status === "completed" || new Date(s.date + "T" + s.endTime) < now
    );

    this.setState({
      scheduledSessions: mockSessions,
      upcomingSessions: upcoming,
      ongoingSessions: ongoing,
      pastSessions: past,
    });
  };

  getRandomColor = () => {
    const colors = [
      "#4e73df",
      "#1cc88a",
      "#36b9cc",
      "#f6c23e",
      "#e74a3b",
      "#6f42c1",
      "#fd7e14",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newSession: {
        ...prevState.newSession,
        [name]: value,
      },
    }));
  };

  handleCreateSession = (e) => {
    e.preventDefault();
    const { newSession, scheduledSessions, courses } = this.state;

    // Validate form
    if (
      !newSession.courseId ||
      !newSession.title ||
      !newSession.date ||
      !newSession.startTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const course = courses.find((c) => c.id === newSession.courseId);

    // Create new session
    const sessionId =
      scheduledSessions.length > 0
        ? Math.max(...scheduledSessions.map((s) => s.id)) + 1
        : 1;

    const newSessionObj = {
      id: sessionId,
      courseId: newSession.courseId,
      title: newSession.title,
      description: newSession.description,
      date: newSession.date,
      startTime: newSession.startTime,
      endTime: newSession.endTime || "23:59",
      status: "scheduled",
      meetingPlatform: newSession.meetingPlatform,
      meetingLink:
        newSession.meetingLink ||
        this.generateMeetingLink(newSession.meetingPlatform),
      participants: 0,
      maxParticipants: newSession.maxParticipants,
      recordingAvailable: newSession.recordingEnabled,
      recordingUrl: "",
    };

    // Add to scheduled sessions
    const updatedSessions = [...scheduledSessions, newSessionObj];

    // Update state
    this.setState({
      scheduledSessions: updatedSessions,
      showCreateModal: false,
      newSession: {
        courseId: "",
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        meetingPlatform: "zoom",
        meetingLink: "",
        maxParticipants: 30,
        recordingEnabled: true,
      },
      upcomingSessions: updatedSessions.filter(
        (s) =>
          new Date(s.date + "T" + s.startTime) > new Date() &&
          s.status !== "completed"
      ),
    });

    alert("✓ Live session scheduled successfully!");
  };

  generateMeetingLink = (platform) => {
    const baseLinks = {
      zoom: "https://zoom.us/j/",
      google_meet: "https://meet.google.com/",
      microsoft_teams: "https://teams.microsoft.com/l/meeting/",
      custom: "https://meet.example.com/",
    };

    const randomId = Math.random().toString(36).substring(7);
    return `${baseLinks[platform]}${randomId}`;
  };

  startSession = (sessionId) => {
    const updatedSessions = this.state.scheduledSessions.map((session) => {
      if (session.id === sessionId) {
        return { ...session, status: "live" };
      }
      return session;
    });

    this.setState({
      scheduledSessions: updatedSessions,
      ongoingSessions: updatedSessions.filter((s) => s.status === "live"),
      upcomingSessions: updatedSessions.filter(
        (s) =>
          new Date(s.date + "T" + s.startTime) > new Date() &&
          s.status !== "completed"
      ),
    });

    alert("🎥 Session started! Share the meeting link with students.");
  };

  endSession = (sessionId) => {
    const updatedSessions = this.state.scheduledSessions.map((session) => {
      if (session.id === sessionId) {
        return {
          ...session,
          status: "completed",
          recordingUrl: session.recordingAvailable
            ? "https://example.com/recordings/" + sessionId
            : "",
        };
      }
      return session;
    });

    this.setState({
      scheduledSessions: updatedSessions,
      ongoingSessions: updatedSessions.filter((s) => s.status === "live"),
      pastSessions: updatedSessions.filter(
        (s) =>
          s.status === "completed" ||
          new Date(s.date + "T" + s.endTime) < new Date()
      ),
    });

    alert("✓ Session ended. Recording will be available soon.");
  };

  joinSession = (meetingLink) => {
    window.open(meetingLink, "_blank");
  };

  getPlatformIcon = (platform) => {
    const icons = {
      zoom: "bi-camera-video",
      google_meet: "bi-google",
      microsoft_teams: "bi-microsoft",
      custom: "bi-link",
    };
    return icons[platform] || "bi-camera-video";
  };

  getPlatformName = (platform) => {
    const names = {
      zoom: "Zoom",
      google_meet: "Google Meet",
      microsoft_teams: "Microsoft Teams",
      custom: "Custom",
    };
    return names[platform] || "Video Platform";
  };

  getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return <span className="badge bg-info">Scheduled</span>;
      case "live":
        return <span className="badge bg-success">Live Now</span>;
      case "completed":
        return <span className="badge bg-secondary">Completed</span>;
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  formatDateTime = (date, time) => {
    const dateObj = new Date(date + "T" + time);
    return dateObj.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  render() {
    const {
      courses,
      upcomingSessions,
      ongoingSessions,
      pastSessions,
      isLoading,
      error,
      showCreateModal,
      showRecordingModal,
      newSession,
      selectedRecording,
    } = this.state;

    if (isLoading) {
      return (
        <div className="container my-5 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading courses...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container my-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Live Sessions</h1>
              <p className="text-muted">
                Schedule and conduct live virtual classes
              </p>
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => this.setState({ showCreateModal: true })}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Schedule Session
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Courses</h6>
                      <h3 className="mb-0">{courses.length}</h3>
                      <small className="text-muted">
                        Available for sessions
                      </small>
                    </div>
                    <div className="bg-primary rounded-circle p-3">
                      <i className="bi bi-journals text-white fs-4"></i>
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
                      <h6 className="text-muted">Upcoming</h6>
                      <h3 className="mb-0">{upcomingSessions.length}</h3>
                      <small className="text-muted">Scheduled sessions</small>
                    </div>
                    <div className="bg-warning rounded-circle p-3">
                      <i className="bi bi-calendar-check text-white fs-4"></i>
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
                      <h6 className="text-muted">Live Now</h6>
                      <h3 className="mb-0">{ongoingSessions.length}</h3>
                      <small className="text-muted">Active sessions</small>
                    </div>
                    <div className="bg-success rounded-circle p-3">
                      <i className="bi bi-camera-video text-white fs-4"></i>
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
                      <h6 className="text-muted">Completed</h6>
                      <h3 className="mb-0">{pastSessions.length}</h3>
                      <small className="text-muted">Past sessions</small>
                    </div>
                    <div className="bg-secondary rounded-circle p-3">
                      <i className="bi bi-check-circle text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Sessions */}
          {ongoingSessions.length > 0 && (
            <div className="card mb-4 border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-camera-video me-2"></i>
                  Live Now
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {ongoingSessions.map((session) => {
                    const course =
                      courses.find((c) => c.id === session.courseId) || {};
                    return (
                      <div className="col-md-6 mb-3" key={session.id}>
                        <div className="card h-100 border-success">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="card-title">{session.title}</h5>
                                <div className="d-flex align-items-center mb-2">
                                  <span className="badge bg-success me-2">
                                    Live Now
                                  </span>
                                  <span className="badge bg-light text-dark">
                                    <i
                                      className={`bi ${this.getPlatformIcon(
                                        session.meetingPlatform
                                      )} me-1`}
                                    ></i>
                                    {this.getPlatformName(
                                      session.meetingPlatform
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary border-0"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.joinSession(session.meetingLink)
                                      }
                                    >
                                      <i className="bi bi-box-arrow-up-right me-2"></i>{" "}
                                      Join Session
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.endSession(session.id)
                                      }
                                    >
                                      <i className="bi bi-stop-circle me-2"></i>{" "}
                                      End Session
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <p className="card-text text-muted">
                              {session.description}
                            </p>

                            <div className="mb-3">
                              <span className="badge course-tag me-2">
                                <i className="bi bi-journal me-1"></i>{" "}
                                {course.name}
                              </span>
                              <span className="badge bg-light text-dark me-2">
                                <i className="bi bi-people me-1"></i>{" "}
                                {session.participants}/{session.maxParticipants}
                              </span>
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-clock me-1"></i>{" "}
                                {session.startTime} - {session.endTime}
                              </span>
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <button
                                className="btn btn-success me-2"
                                onClick={() =>
                                  this.joinSession(session.meetingLink)
                                }
                              >
                                <i className="bi bi-camera-video me-2"></i>
                                Join Session
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => this.endSession(session.id)}
                              >
                                <i className="bi bi-stop-circle me-2"></i>
                                End Session
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-calendar-week me-2"></i>
                Upcoming Sessions
              </h5>
            </div>
            <div className="card-body">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                  <h5>No upcoming sessions</h5>
                  <p className="text-muted">Schedule your first live session</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.setState({ showCreateModal: true })}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Schedule Session
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Session</th>
                        <th>Course</th>
                        <th>Date & Time</th>
                        <th>Platform</th>
                        <th>Participants</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSessions.map((session) => {
                        const course =
                          courses.find((c) => c.id === session.courseId) || {};
                        return (
                          <tr key={session.id}>
                            <td>
                              <div>
                                <strong>{session.title}</strong>
                                <div className="text-muted small">
                                  {session.description}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge course-tag">
                                <i className="bi bi-journal me-1"></i>{" "}
                                {course.name}
                              </span>
                            </td>
                            <td>
                              <small>
                                <i className="bi bi-calendar me-1"></i>{" "}
                                {session.date}
                                <br />
                                <i className="bi bi-clock me-1"></i>{" "}
                                {session.startTime} - {session.endTime}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">
                                <i
                                  className={`bi ${this.getPlatformIcon(
                                    session.meetingPlatform
                                  )} me-1`}
                                ></i>
                                {this.getPlatformName(session.meetingPlatform)}
                              </span>
                            </td>
                            <td>
                              <div
                                className="progress"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${
                                      (session.participants /
                                        session.maxParticipants) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <small>
                                {session.participants}/{session.maxParticipants}
                              </small>
                            </td>
                            <td>{this.getStatusBadge(session.status)}</td>
                            <td>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary border-0"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.startSession(session.id)
                                      }
                                    >
                                      <i className="bi bi-play-circle me-2"></i>{" "}
                                      Start Session
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.joinSession(session.meetingLink)
                                      }
                                    >
                                      <i className="bi bi-box-arrow-up-right me-2"></i>{" "}
                                      Test Join
                                    </button>
                                  </li>
                                  <li>
                                    <button className="dropdown-item">
                                      <i className="bi bi-pencil me-2"></i> Edit
                                    </button>
                                  </li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li>
                                    <button className="dropdown-item text-danger">
                                      <i className="bi bi-trash me-2"></i>{" "}
                                      Cancel
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Past Sessions
              </h5>
            </div>
            <div className="card-body">
              {pastSessions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-clock-history fs-1 text-muted mb-3"></i>
                  <h5>No past sessions</h5>
                  <p className="text-muted">
                    Completed sessions will appear here
                  </p>
                </div>
              ) : (
                <div className="row">
                  {pastSessions.slice(0, 4).map((session) => {
                    const course =
                      courses.find((c) => c.id === session.courseId) || {};
                    return (
                      <div className="col-md-6 mb-3" key={session.id}>
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="card-title">{session.title}</h5>
                                <div className="d-flex align-items-center mb-2">
                                  <span className="badge bg-secondary me-2">
                                    Completed
                                  </span>
                                  <span className="badge bg-light text-dark">
                                    <i
                                      className={`bi ${this.getPlatformIcon(
                                        session.meetingPlatform
                                      )} me-1`}
                                    ></i>
                                    {this.getPlatformName(
                                      session.meetingPlatform
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="card-text text-muted">
                              {session.description}
                            </p>

                            <div className="mb-3">
                              <span className="badge course-tag me-2">
                                <i className="bi bi-journal me-1"></i>{" "}
                                {course.name}
                              </span>
                              <span className="badge bg-light text-dark me-2">
                                <i className="bi bi-people me-1"></i>{" "}
                                {session.participants} attended
                              </span>
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-calendar me-1"></i>{" "}
                                {session.date}
                              </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {this.formatDateTime(
                                  session.date,
                                  session.startTime
                                )}
                              </small>
                              <div>
                                {session.recordingAvailable &&
                                session.recordingUrl ? (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      this.setState({
                                        selectedRecording: session,
                                        showRecordingModal: true,
                                      });
                                    }}
                                  >
                                    <i className="bi bi-play-circle me-1"></i>{" "}
                                    View Recording
                                  </button>
                                ) : (
                                  <span className="badge bg-secondary">
                                    No Recording
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Create Session Modal */}
          {showCreateModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Schedule New Live Session</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => this.setState({ showCreateModal: false })}
                    ></button>
                  </div>
                  <form onSubmit={this.handleCreateSession}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Course *</label>
                          <select
                            className="form-select"
                            name="courseId"
                            value={newSession.courseId}
                            onChange={this.handleInputChange}
                            required
                          >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.name} ({course.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Meeting Platform *
                          </label>
                          <select
                            className="form-select"
                            name="meetingPlatform"
                            value={newSession.meetingPlatform}
                            onChange={this.handleInputChange}
                            required
                          >
                            <option value="zoom">Zoom</option>
                            <option value="google_meet">Google Meet</option>
                            <option value="microsoft_teams">
                              Microsoft Teams
                            </option>
                            <option value="custom">Custom Link</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Session Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={newSession.title}
                          onChange={this.handleInputChange}
                          placeholder="e.g., Introduction to Calculus"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={newSession.description}
                          onChange={this.handleInputChange}
                          rows="3"
                          placeholder="Brief description of the session"
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={newSession.date}
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">Start Time *</label>
                          <input
                            type="time"
                            className="form-control"
                            name="startTime"
                            value={newSession.startTime}
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label">End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            name="endTime"
                            value={newSession.endTime}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Meeting Link</label>
                          <input
                            type="url"
                            className="form-control"
                            name="meetingLink"
                            value={newSession.meetingLink}
                            onChange={this.handleInputChange}
                            placeholder="Leave empty to auto-generate"
                          />
                          <small className="text-muted">
                            If empty, a link will be generated
                          </small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Max Participants</label>
                          <input
                            type="number"
                            className="form-control"
                            name="maxParticipants"
                            value={newSession.maxParticipants}
                            onChange={this.handleInputChange}
                            min="1"
                            max="1000"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="recordingEnabled"
                            checked={newSession.recordingEnabled}
                            onChange={(e) =>
                              this.handleInputChange({
                                target: {
                                  name: "recordingEnabled",
                                  value: e.target.checked,
                                },
                              })
                            }
                          />
                          <label className="form-check-label">
                            Enable recording for this session
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          this.setState({ showCreateModal: false })
                        }
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-calendar-plus me-2"></i>
                        Schedule Session
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Recording Modal */}
          {showRecordingModal && selectedRecording && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Session Recording</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        this.setState({
                          showRecordingModal: false,
                          selectedRecording: null,
                        })
                      }
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="text-center mb-4">
                      <i className="bi bi-play-circle fs-1 text-primary mb-3"></i>
                      <h4>{selectedRecording.title}</h4>
                      <p className="text-muted">
                        Recording will be available shortly after the session
                        ends
                      </p>
                    </div>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      The recording is being processed. It will be available for
                      students to review.
                    </div>

                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <i className="bi bi-play-circle me-2"></i>
                        Play Recording
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="bi bi-download me-2"></i>
                        Download Recording
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backdrop for modals */}
          {(showCreateModal || showRecordingModal) && (
            <div className="modal-backdrop fade show"></div>
          )}
        </div>
      </div>
    );
  }
}

export default LiveSessionPage;
