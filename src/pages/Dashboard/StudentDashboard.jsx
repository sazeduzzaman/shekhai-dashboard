import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Progress,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  Star,
  TrendingUp,
  FileText,
  Target,
  Book,
  FilePlus,
  Clock as ClockIcon,
  Eye,
  MoreVertical,
  Activity,
  Zap,
  Shield,
} from "react-feather";

const StudentDashboard = ({ user, token }) => {
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: 6,
    completedCourses: 3,
    averageScore: 85,
    studyHours: 42,
    pendingAssignments: 2,
    upcomingExams: 1,
    streakDays: 7,
    rank: "Gold",
    totalXP: 1250,
    level: 5,
    nextLevelXP: 1500,
    weeklyProgress: 65,
    certificates: 3,
    forumPosts: 24,
    studyPartners: 8,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const enrolledCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      category: "Web Development",
      instructor: "Sarah Johnson",
      progress: 75,
      nextLesson: "State Management",
      dueDate: "Dec 15",
      rating: 4.8,
      duration: "12h 30m",
      thumbnailColor: "primary",
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      title: "JavaScript Advanced",
      category: "Programming",
      instructor: "Mike Chen",
      progress: 90,
      nextLesson: "Async/Await",
      dueDate: "Dec 18",
      rating: 4.9,
      duration: "15h",
      thumbnailColor: "success",
      lastAccessed: "Yesterday",
    },
    {
      id: 3,
      title: "Node.js Basics",
      category: "Backend",
      instructor: "David Wilson",
      progress: 45,
      nextLesson: "Express.js",
      dueDate: "Dec 20",
      rating: 4.6,
      duration: "10h",
      thumbnailColor: "warning",
      lastAccessed: "3 days ago",
    },
    {
      id: 4,
      title: "Database Design",
      category: "Data Science",
      instructor: "Emma Davis",
      progress: 30,
      nextLesson: "SQL Queries",
      dueDate: "Dec 22",
      rating: 4.7,
      duration: "8h 45m",
      thumbnailColor: "info",
      lastAccessed: "1 week ago",
    },
    {
      id: 5,
      title: "UI/UX Design",
      category: "Design",
      instructor: "Lisa Brown",
      progress: 15,
      nextLesson: "Prototyping",
      dueDate: "Jan 5",
      rating: 4.8,
      duration: "14h",
      thumbnailColor: "danger",
      lastAccessed: "2 weeks ago",
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "React Assignment",
      course: "React Fundamentals",
      dueDate: "Tomorrow 11:59 PM",
      type: "assignment",
      priority: "high",
      estimatedTime: "3 hours",
    },
    {
      id: 2,
      title: "Mid-term Exam",
      course: "JavaScript Advanced",
      dueDate: "Dec 20, 2:00 PM",
      type: "exam",
      priority: "high",
      estimatedTime: "2 hours",
    },
    {
      id: 3,
      title: "Project Submission",
      course: "Node.js Basics",
      dueDate: "Dec 25, 11:59 PM",
      type: "project",
      priority: "medium",
      estimatedTime: "8 hours",
    },
    {
      id: 4,
      title: "Quiz 3",
      course: "Database Design",
      dueDate: "Dec 23, 11:59 PM",
      type: "quiz",
      priority: "medium",
      estimatedTime: "1 hour",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Complete 5 courses in one month",
      icon: "🏆",
      earned: true,
      xp: 250,
      date: "Nov 15, 2024",
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "⭐",
      earned: true,
      xp: 150,
      date: "Nov 20, 2024",
    },
    {
      id: 3,
      title: "Consistent Learner",
      description: "7-day learning streak",
      icon: "🔥",
      earned: true,
      xp: 100,
      date: "Dec 1, 2024",
    },
    {
      id: 4,
      title: "Social Learner",
      description: "Join 3 study groups",
      icon: "👥",
      earned: false,
      xp: 200,
      date: "Locked",
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete assignments 3 days early",
      icon: "🐦",
      earned: false,
      xp: 175,
      date: "Locked",
    },
    {
      id: 6,
      title: "Top Performer",
      description: "Rank in top 10% of class",
      icon: "👑",
      earned: false,
      xp: 500,
      date: "Locked",
    },
  ];

  const notifications = [
    {
      id: 1,
      text: "New assignment posted in React Fundamentals",
      time: "10 min ago",
      read: false,
      type: "assignment",
    },
    {
      id: 2,
      text: "Your submission was graded - 95%",
      time: "2 hours ago",
      read: true,
      type: "grade",
    },
    {
      id: 3,
      text: "Live session starting in 30 minutes",
      time: "5 hours ago",
      read: false,
      type: "live",
    },
    {
      id: 4,
      text: "Study group meeting at 3 PM",
      time: "1 day ago",
      read: true,
      type: "group",
    },
  ];

  const studyStats = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 4.2 },
    { day: "Thu", hours: 3.0 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 1.0 },
  ];

  const recommendedCourses = [
    {
      id: 1,
      title: "React Native Mobile Development",
      category: "Mobile",
      difficulty: "Intermediate",
      rating: 4.9,
      duration: "20h",
    },
    {
      id: 2,
      title: "Python for Data Science",
      category: "Data",
      difficulty: "Beginner",
      rating: 4.7,
      duration: "25h",
    },
    {
      id: 3,
      title: "AWS Cloud Fundamentals",
      category: "Cloud",
      difficulty: "Beginner",
      rating: 4.8,
      duration: "15h",
    },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Header Section */}
      <div className="bg-primary bg-gradient py-4 px-4 text-white">
        <Row className="align-items-center">
          <Col md="8">
            <div className="d-flex align-items-center">
              <div className="avatar-xl me-3">
                <div
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="display-5 text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="h3 mb-1">Welcome back, {user.name}!</h1>
                <p className="text-white-50 mb-0">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="p-4 px-0">
        {/* Quick Stats Row */}
        <Row className="">
          <Col lg="3" md="6" className="">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Learning Streak</h6>
                    <h3 className="mb-1">{dashboardData.streakDays} days</h3>
                    <div className="d-flex align-items-center">
                      <TrendingUp size={14} className="text-success me-1" />
                      <small className="text-success">+2 this week</small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Zap size={20} className="text-success" />
                  </div>
                </div>
                <Progress
                  value={70}
                  className="mt-3"
                  style={{ height: "4px" }}
                />
                <small className="text-muted">7-day target: 10 days</small>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Total XP</h6>
                    <h3 className="mb-1">{dashboardData.totalXP}</h3>
                    <div className="d-flex align-items-center">
                      <Star size={14} className="text-warning me-1" />
                      <small className="text-warning">
                        Level {dashboardData.level}
                      </small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Award size={20} className="text-warning" />
                  </div>
                </div>
                <Progress
                  value={
                    (dashboardData.totalXP / dashboardData.nextLevelXP) * 100
                  }
                  className="mt-3"
                  style={{ height: "4px" }}
                />
                <small className="text-muted">
                  {dashboardData.nextLevelXP - dashboardData.totalXP} XP to next
                  level
                </small>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Study Hours</h6>
                    <h3 className="mb-1">{dashboardData.studyHours}h</h3>
                    <div className="d-flex align-items-center">
                      <Clock size={14} className="text-info me-1" />
                      <small className="text-info">This month</small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <ClockIcon size={20} className="text-info" />
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Daily avg: {(dashboardData.studyHours / 30).toFixed(1)}h
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Rank</h6>
                    <h3 className="mb-1">{dashboardData.rank}</h3>
                    <div className="d-flex align-items-center">
                      <TrendingUp size={14} className="text-danger me-1" />
                      <small className="text-danger">Top 15%</small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Shield size={20} className="text-danger" />
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Next rank: Platinum (1500 XP)
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Left Column - Courses & Activities */}
          <Col lg="8" className="">
            {/* My Courses */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <BookOpen size={20} className="me-2 text-primary" />
                      My Courses
                    </h5>
                    <small className="text-muted">
                      {dashboardData.enrolledCourses} enrolled •{" "}
                      {dashboardData.completedCourses} completed
                    </small>
                  </div>
                  <div className="d-flex">
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      tag={Link}
                      to="/student/browse-courses"
                    >
                      Browse All
                    </Button>
                    <Dropdown>
                      <DropdownToggle color="light" size="sm">
                        <MoreVertical size={16} />
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem>Sort by Progress</DropdownItem>
                        <DropdownItem>Sort by Due Date</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Export Progress</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                <div className="row">
                  {enrolledCourses.map((course) => (
                    <Col md="6" lg="4" className="mb-3" key={course.id}>
                      <Card className="h-100 border">
                        <div
                          className={`bg-${course.thumbnailColor}-subtle p-3 text-center`}
                        >
                          <div className="avatar-lg mx-auto mb-2">
                            <div
                              className={`rounded-circle bg-${course.thumbnailColor} d-flex align-items-center justify-content-center`}
                              style={{ width: "60px", height: "60px" }}
                            >
                              <BookOpen size={24} className="text-white" />
                            </div>
                          </div>
                          <h6 className="mb-1">{course.title}</h6>
                          <small className="text-muted">
                            {course.category}
                          </small>
                        </div>
                        <CardBody className="p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Progress</small>
                            <small className="fw-bold">
                              {course.progress}%
                            </small>
                          </div>
                          <Progress
                            value={course.progress}
                            className="mb-3"
                            style={{ height: "6px" }}
                          />
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-muted">
                              <Clock size={12} className="me-1" />
                              {course.duration}
                            </small>
                            <Badge color="warning" pill>
                              <Star size={10} className="me-1" />
                              {course.rating}
                            </Badge>
                          </div>
                          <div className="d-flex justify-content-between">
                            <Button
                              color="primary"
                              size="sm"
                              tag={Link}
                              // to={`/student/course/${course.id}`}
                              to={"/student/continue-courses"}
                            >
                              Continue
                            </Button>
                            <Button color="outline-secondary" size="sm">
                              <Eye size={14} />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Study Activity Chart */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <Activity size={20} className="me-2 text-primary" />
                      Weekly Study Activity
                    </h5>
                    <small className="text-muted">
                      Hours spent learning this week
                    </small>
                  </div>
                  <div className="btn-group" role="group">
                    <Button
                      color={
                        activeTab === "all" ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setActiveTab("all")}
                    >
                      Week
                    </Button>
                    <Button
                      color={
                        activeTab === "month" ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setActiveTab("month")}
                    >
                      Month
                    </Button>
                    <Button
                      color={
                        activeTab === "year" ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setActiveTab("year")}
                    >
                      Year
                    </Button>
                  </div>
                </div>
                <div
                  className="d-flex align-items-end mb-3"
                  style={{ height: "150px" }}
                >
                  {studyStats.map((stat, index) => (
                    <div key={index} className="flex-fill px-2">
                      <div className="text-center">
                        <div
                          className="mx-auto bg-primary bg-opacity-25 rounded-top"
                          style={{
                            height: `${(stat.hours / 5) * 100}px`,
                            width: "30px",
                          }}
                        ></div>
                        <small className="text-muted d-block mt-2">
                          {stat.day}
                        </small>
                        <small className="fw-bold d-block">{stat.hours}h</small>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col lg="4" className="mb-4">
            {/* Achievements */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <Award size={20} className="me-2 text-primary" />
                      Achievements
                    </h5>
                    <small className="text-muted">
                      {achievements.filter((a) => a.earned).length} unlocked
                    </small>
                  </div>
                  <Button
                    color="outline-primary"
                    size="sm"
                    tag={Link}
                    to="/student/certificates"
                  >
                    View All
                  </Button>
                </div>

                <div className="row">
                  {achievements.slice(0, 4).map((achievement) => (
                    <Col xs="6" key={achievement.id} className="mb-3">
                      <div
                        className={`border rounded p-3 text-center h-100 ${
                          achievement.earned ? "" : "opacity-50 bg-light"
                        }`}
                      >
                        <div className="display-4 mb-2">{achievement.icon}</div>
                        <h6 className="mb-1">{achievement.title}</h6>
                        <small className="text-muted d-block mb-2">
                          {achievement.description}
                        </small>
                        <Badge
                          color={achievement.earned ? "success" : "secondary"}
                          pill
                          className="mb-2"
                        >
                          {achievement.earned
                            ? `${achievement.xp} XP`
                            : "Locked"}
                        </Badge>
                        <small className="text-muted d-block">
                          {achievement.date}
                        </small>
                      </div>
                    </Col>
                  ))}
                </div>
              </CardBody>
            </Card>
            {/* Upcoming Deadlines */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <Clock size={20} className="me-2 text-primary" />
                      Upcoming Deadlines
                    </h5>
                    <small className="text-muted">
                      {upcomingDeadlines.length} items pending
                    </small>
                  </div>
                  <Button
                    color="outline-primary"
                    size="sm"
                    tag={Link}
                    to="/student/assignments"
                  >
                    <Calendar size={14} />
                  </Button>
                </div>

                <ListGroup flush>
                  {upcomingDeadlines.map((deadline) => (
                    <ListGroupItem
                      key={deadline.id}
                      className="border-0 px-0 py-3"
                    >
                      <div className="d-flex align-items-start">
                        <div
                          className={`rounded-circle p-2 me-3 bg-${
                            deadline.priority === "high" ? "danger" : "warning"
                          }-subtle`}
                        >
                          {deadline.type === "assignment" ? (
                            <FileText
                              size={16}
                              className={`text-${
                                deadline.priority === "high"
                                  ? "danger"
                                  : "warning"
                              }`}
                            />
                          ) : deadline.type === "exam" ? (
                            <Book
                              size={16}
                              className={`text-${
                                deadline.priority === "high"
                                  ? "danger"
                                  : "warning"
                              }`}
                            />
                          ) : (
                            <FilePlus
                              size={16}
                              className={`text-${
                                deadline.priority === "high"
                                  ? "danger"
                                  : "warning"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{deadline.title}</h6>
                            <Badge
                              color={
                                deadline.priority === "high"
                                  ? "danger"
                                  : "warning"
                              }
                              pill
                            >
                              {deadline.type}
                            </Badge>
                          </div>
                          <small className="text-muted d-block mb-2">
                            {deadline.course}
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <Clock size={12} className="me-1" />
                              {deadline.dueDate}
                            </small>
                            <div>
                              <Button
                                color="primary"
                                size="sm"
                                tag={Link}
                                to={`/student/assignment/${deadline.id}`}
                              >
                                Start
                              </Button>
                            </div>
                          </div>
                          <small className="text-muted d-block mt-2">
                            <Clock size={12} className="me-1" />
                            Estimated time: {deadline.estimatedTime}
                          </small>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Recommended Courses */}
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">
                  <Target size={20} className="me-2 text-primary" />
                  Recommended For You
                </h5>
                <small className="text-muted">
                  Based on your learning history
                </small>
              </div>
              <Button
                color="outline-primary"
                size="sm"
                tag={Link}
                to="/student/browse-courses"
              >
                Browse All
              </Button>
            </div>

            <Row>
              {recommendedCourses.map((course) => (
                <Col md="4" key={course.id} className="mb-3">
                  <Card className="h-100 border">
                    <CardBody>
                      <div className="d-flex align-items-start mb-3">
                        <div className="bg-primary-subtle p-2 rounded me-3">
                          <BookOpen size={20} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">{course.title}</h6>
                          <small className="text-muted">
                            {course.category}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Badge color="info" pill>
                          {course.difficulty}
                        </Badge>
                        <small className="text-muted">
                          <Clock size={12} className="me-1" />
                          {course.duration}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <Star size={14} className="text-warning me-1" />
                          <small>{course.rating}</small>
                        </div>
                        <small className="text-success">Free</small>
                      </div>
                      <Button
                        color="primary"
                        size="sm"
                        block
                        tag={Link}
                        to={`/student/course/enroll/${course.id}`}
                      >
                        Enroll Now
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
