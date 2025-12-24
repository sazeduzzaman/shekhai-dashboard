import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Star, Play, CheckCircle } from "react-feather";
import { Badge, Button, Card, CardBody, Col, Progress, Row } from "reactstrap";

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
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=200&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Python for Data Science",
    category: "Data Science",
    instructor: "Alex Turner",
    progress: 60,
    rating: 4.9,
    duration: "20h",
    color: "#8b5cf6",
    lessons: 28,
    image:
      "https://images.unsplash.com/photo-1526379879527-8559ecfcaec9?w=400&h=200&fit=crop",
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    category: "Design",
    instructor: "Lisa Wang",
    progress: 85,
    rating: 4.7,
    duration: "14h",
    color: "#ec4899",
    lessons: 22,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
  },
  {
    id: 7,
    title: "Mobile App Development",
    category: "Mobile",
    instructor: "Ryan Patel",
    progress: 40,
    rating: 4.5,
    duration: "18h",
    color: "#f97316",
    lessons: 30,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
  },
  {
    id: 8,
    title: "Cloud Computing Basics",
    category: "DevOps",
    instructor: "Maria Garcia",
    progress: 25,
    rating: 4.8,
    duration: "16h",
    color: "#06b6d4",
    lessons: 20,
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=200&fit=crop",
  },
];

const BrowseCourses = () => {
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
              Explorer! All Courses at Your Fingertips
            </h1>
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
              {/* Full Image Header */}
              <div className="course-image-header position-relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-100"
                  style={{ height: "180px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                <div class="image-fallback d-flex align-items-center justify-content-center" 
                  style="height: 180px; background: linear-gradient(135deg, ${
                    course.color
                  }dd, ${course.color})">
                  <h4 class="text-white fw-bold m-0">${course.title.substring(
                    0,
                    2
                  )}</h4>
                </div>
              `;
                  }}
                />
                <div className="image-overlay d-flex justify-content-between align-items-start p-3">
                  <Badge className="glass-pill pt-2">{course.category}</Badge>
                  <div className="lessons-badge">
                    <BookOpen size={12} className="me-1" /> {course.lessons}{" "}
                    Lessons
                  </div>
                </div>
                <div className="play-overlay d-flex align-items-center justify-content-center">
                  <div className="play-button">
                    <Play size={24} fill="white" />
                  </div>
                </div>
              </div>

              <CardBody className="p-4 bg-white">
                <div className="mb-3">
                  <h5 className="fw-bold text-slate-800 mb-1 text-truncate">
                    {course.title}
                  </h5>
                  <div className="d-flex align-items-center text-muted small">
                    <CheckCircle size={14} className="text-success me-1" />
                    <span>{course.instructor}</span>
                  </div>
                </div>

                {/* Infographic Progress Strip */}
                <div className="stats-strip mb-3">
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

                <div className="progress-area mb-3">
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
                  className="continue-btn w-100"
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
        .info-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
}

.course-image-header {
  position: relative;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%);
}

.glass-pill {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  border-radius: 50px;
  font-size: 0.75rem;
}

.lessons-badge {
  font-size: 0.7rem;
  color: white;
  font-weight: 600;
  background: rgba(0,0,0,0.3);
  padding: 4px 10px;
  border-radius: 50px;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-image-header:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: scale(0.9);
}

.play-button:hover {
  background: white;
  transform: scale(1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.stats-strip {
  display: flex;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label { 
  font-size: 0.65rem; 
  color: #64748b; 
  font-weight: 600; 
  text-transform: uppercase; 
  margin-bottom: 2px;
}

.stat-value { 
  font-size: 0.85rem; 
  font-weight: 800; 
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-divider { 
  width: 1px; 
  height: 20px; 
  background: #e2e8f0; 
}

.progress-sm { 
  height: 6px; 
  background-color: #f1f5f9; 
  border-radius: 10px; 
}

.continue-btn {
  background: white;
  border: 2px solid var(--btn-color);
  color: var(--btn-color);
  font-weight: 600;
  border-radius: 10px;
  padding: 10px;
  transition: all 0.3s;
}

.continue-btn:hover {
  background: var(--btn-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}
      `}</style>
    </div>
  );
};

export default BrowseCourses;
