import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Star,
  Play,
  CheckCircle,
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Progress,
  Row,
} from "reactstrap";

const enrolledCourses = [
  {
    id: 1,
    title: "React Fundamentals",
    category: "Web Development",
    instructor: "Sarah Johnson",
    progress: 75,
    rating: 4.8,
    duration: "12h 30m",
    color: "#6366f1",
    lessons: 24,
  },
  {
    id: 2,
    title: "JavaScript Advanced",
    category: "Programming",
    instructor: "Mike Chen",
    progress: 90,
    rating: 4.9,
    duration: "15h",
    color: "#10b981",
    lessons: 32,
  },
  {
    id: 3,
    title: "Node.js Basics",
    category: "Backend",
    instructor: "David Wilson",
    progress: 45,
    rating: 4.6,
    duration: "10h",
    color: "#f59e0b",
    lessons: 18,
  },
  {
    id: 4,
    title: "Database Design",
    category: "Data Science",
    instructor: "Emma Davis",
    progress: 30,
    rating: 4.7,
    duration: "8h 45m",
    color: "#0ea5e9",
    lessons: 12,
  },
];

const MyCourses = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              Welcome back, Explorer!
            </h1>
            <p className="text-muted lead mb-0">
              You have{" "}
              <span className="text-dark fw-bold">4 active courses</span> this
              week. You're in the top 5% of learners!
            </p>
          </Col>
          <Col md="4" className="text-md-end mt-3 mt-md-0">
            <Button
              color="white"
              className="shadow-sm border-0 rounded-pill px-4 py-2 me-2"
            >
              Statistics
            </Button>
            <Button
              color="primary"
              className="shadow-lg border-0 rounded-pill px-4 py-2"
            >
              Find New <ArrowRight size={16} className="ms-1" />
            </Button>
          </Col>
        </Row>
      </header>

      {/* Infographic Grid */}
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
                      <BookOpen size={12} className="me-1" /> {course.lessons}{" "}
                      Lessons
                    </div>
                  </div>
                  <div className="play-trigger">
                    <div className="play-blur"></div>
                    <Play
                      size={28}
                      fill="white"
                      className="text-white position-relative"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                </div>
                {/* Decorative Shapes */}
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

                <Button
                  tag={Link}
                  to={`/course/${course.id}`}
                  className="continue-btn"
                  style={{ "--btn-color": course.color }}
                >
                  Continue Learning
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .modern-dashboard {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fcfcfd;
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

        .info-card {
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .info-card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
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

        .stat-label { font-size: 0.65rem; color: #64748b; font-weight: 600; text-uppercase; }
        .stat-value { font-size: 0.85rem; font-weight: 800; }
        .stat-divider { width: 1px; height: 20px; background: #e2e8f0; }

        .progress-sm { height: 6px; background-color: #f1f5f9; border-radius: 10px; }

        .continue-btn {
          width: 100%;
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
        }

        /* Abstract shapes in card header */
        .shape-1 { position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        .shape-2 { position: absolute; bottom: -30px; left: -10px; width: 100px; height: 100px; border-radius: 50%; background: rgba(0,0,0,0.05); }

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
