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
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Clock,
  MessageSquare,
  Video,
  Award,
  Star,
  Edit,
  BarChart2,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Bell,
  TrendingUp,
  Eye,
  Download,
  Upload,
  Target,
  Activity,
  PieChart,
  Award as AwardIcon,
  ThumbsUp,
  Users as UsersIcon,
  Book,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Globe,
  Mic,
  Coffee,
  Shield,
  Bookmark,
  Share2,
  Zap,
  Heart,
  Gift,
} from "react-feather";

const InstructorDashboard = ({ user, token }) => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 245,
    activeCourses: 8,
    totalRevenue: 3450,
    averageRating: 4.7,
    pendingReviews: 12,
    upcomingSessions: 3,
    assignmentsToGrade: 18,
    courseCompletion: 85,
    totalHoursTaught: 120,
    studentEngagement: 78,
    certificationRate: 92,
    monthlyGrowth: 15,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const myCourses = [
    {
      id: 1,
      title: "React Advanced",
      category: "Web Development",
      students: 45,
      progress: 85,
      status: "active",
      rating: 4.8,
      revenue: 1250,
      lastUpdated: "2 days ago",
      thumbnailColor: "primary",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      category: "Programming",
      students: 120,
      progress: 92,
      status: "active",
      rating: 4.9,
      revenue: 3200,
      lastUpdated: "1 week ago",
      thumbnailColor: "success",
    },
    {
      id: 3,
      title: "Node.js Backend",
      category: "Backend",
      students: 68,
      progress: 75,
      status: "active",
      rating: 4.6,
      revenue: 1850,
      lastUpdated: "3 days ago",
      thumbnailColor: "warning",
    },
    {
      id: 4,
      title: "Database Design",
      category: "Data Science",
      students: 32,
      progress: 60,
      status: "draft",
      rating: 4.7,
      revenue: 850,
      lastUpdated: "1 month ago",
      thumbnailColor: "info",
    },
    {
      id: 5,
      title: "UI/UX Design Principles",
      category: "Design",
      students: 25,
      progress: 40,
      status: "active",
      rating: 4.8,
      revenue: 650,
      lastUpdated: "2 weeks ago",
      thumbnailColor: "danger",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "React Hooks Workshop",
      time: "Today, 2:00 PM",
      duration: "1.5 hours",
      students: 45,
      type: "live",
      status: "scheduled",
    },
    {
      id: 2,
      title: "JavaScript Q&A Session",
      time: "Tomorrow, 10:00 AM",
      duration: "1 hour",
      students: 32,
      type: "qa",
      status: "scheduled",
    },
    {
      id: 3,
      title: "Project Review - Batch 3",
      time: "Dec 15, 3:00 PM",
      duration: "2 hours",
      students: 18,
      type: "review",
      status: "scheduled",
    },
    {
      id: 4,
      title: "Weekly Office Hours",
      time: "Dec 16, 11:00 AM",
      duration: "2 hours",
      students: 15,
      type: "office",
      status: "scheduled",
    },
  ];

  const assignmentsToGrade = [
    {
      id: 1,
      student: "John Smith",
      course: "React Advanced",
      assignment: "Final Project",
      submitted: "2 days ago",
      status: "pending",
      estimatedTime: "30 min",
    },
    {
      id: 2,
      student: "Emma Wilson",
      course: "JavaScript Fundamentals",
      assignment: "Quiz 3",
      submitted: "1 day ago",
      status: "pending",
      estimatedTime: "15 min",
    },
    {
      id: 3,
      student: "Mike Chen",
      course: "Node.js Backend",
      assignment: "API Design",
      submitted: "3 days ago",
      status: "in-progress",
      estimatedTime: "45 min",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      student: "Sarah Johnson",
      course: "React Advanced",
      rating: 5,
      comment:
        "Excellent course! The instructor explains complex concepts clearly.",
      date: "2 days ago",
    },
    {
      id: 2,
      student: "David Lee",
      course: "JavaScript Fundamentals",
      rating: 4,
      comment: "Very comprehensive course with practical examples.",
      date: "1 week ago",
    },
    {
      id: 3,
      student: "Lisa Brown",
      course: "UI/UX Design",
      rating: 5,
      comment: "Amazing course! Learned so much about design principles.",
      date: "3 days ago",
    },
  ];

  const monthlyRevenue = [
    { month: "Jul", revenue: 2850 },
    { month: "Aug", revenue: 3200 },
    { month: "Sep", revenue: 2950 },
    { month: "Oct", revenue: 3450 },
    { month: "Nov", revenue: 3800 },
    { month: "Dec", revenue: 4200 },
  ];

  const notifications = [
    {
      id: 1,
      text: "New student enrolled in React Advanced",
      time: "10 min ago",
      read: false,
      type: "enrollment",
    },
    {
      id: 2,
      text: "Assignment submission needs grading",
      time: "2 hours ago",
      read: true,
      type: "assignment",
    },
    {
      id: 3,
      text: "New review received - 5 stars!",
      time: "5 hours ago",
      read: false,
      type: "review",
    },
    {
      id: 4,
      text: "Course published successfully",
      time: "1 day ago",
      read: true,
      type: "course",
    },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Header Section */}
      <div className="bg-info bg-gradient py-4 px-4 text-white">
        <Row className="align-items-center">
          <Col md="8">
            <div className="d-flex align-items-center">
              <div className="avatar-xl me-3">
                <div
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="display-5 text-info">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="h3 mb-1">Welcome back, {user?.name}!</h1>
                <p className="text-white-50 mb-0">
                  Instructor Dashboard - Track your teaching impact
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="p-4">
        {/* Quick Stats Row */}
        <Row className="mb-4">
          <Col lg="3" md="6" className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Total Students</h6>
                    <h3 className="mb-1">{dashboardData.totalStudents}</h3>
                    <div className="d-flex align-items-center">
                      <TrendingUp size={14} className="text-success me-1" />
                      <small className="text-success">
                        +{dashboardData.monthlyGrowth}% this month
                      </small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Users size={20} className="text-primary" />
                  </div>
                </div>
                <Progress
                  value={75}
                  className="mt-3"
                  style={{ height: "4px" }}
                />
                <small className="text-muted">
                  Engagement rate: {dashboardData.studentEngagement}%
                </small>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Total Revenue</h6>
                    <h3 className="mb-1">${dashboardData.totalRevenue}</h3>
                    <div className="d-flex align-items-center">
                      <DollarSign size={14} className="text-success me-1" />
                      <small className="text-success">
                        +24% from last month
                      </small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <DollarSign size={20} className="text-success" />
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Avg. per course: $
                    {Math.round(
                      dashboardData.totalRevenue / dashboardData.activeCourses
                    )}
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Average Rating</h6>
                    <h3 className="mb-1">{dashboardData.averageRating}</h3>
                    <div className="d-flex align-items-center">
                      <Star size={14} className="text-warning me-1" />
                      <small className="text-warning">
                        Based on 128 reviews
                      </small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Star size={20} className="text-warning" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`me-1 ${
                          star <= Math.floor(dashboardData.averageRating)
                            ? "text-warning"
                            : "text-muted"
                        }`}
                        fill={
                          star <= Math.floor(dashboardData.averageRating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="3" md="6" className="mb-4">
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-2">Assignments to Grade</h6>
                    <h3 className="mb-1">{dashboardData.assignmentsToGrade}</h3>
                    <div className="d-flex align-items-center">
                      <Clock size={14} className="text-danger me-1" />
                      <small className="text-danger">Attention needed</small>
                    </div>
                  </div>
                  <div className="avatar-sm bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <FileText size={20} className="text-danger" />
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Avg. grading time: 25 min each
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Left Column - Courses & Analytics */}
          <Col lg="8" className="mb-4">
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
                      {dashboardData.activeCourses} active •{" "}
                      {dashboardData.totalStudents} total students
                    </small>
                  </div>
                  <div className="d-flex">
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      tag={Link}
                      to="/instructor/courses/create"
                    >
                      <Plus size={14} className="me-1" />
                      New Course
                    </Button>
                    <Dropdown>
                      <DropdownToggle color="light" size="sm">
                        <Filter size={14} />
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem
                          active={activeTab === "all"}
                          onClick={() => setActiveTab("all")}
                        >
                          All Courses
                        </DropdownItem>
                        <DropdownItem
                          active={activeTab === "active"}
                          onClick={() => setActiveTab("active")}
                        >
                          Active
                        </DropdownItem>
                        <DropdownItem
                          active={activeTab === "draft"}
                          onClick={() => setActiveTab("draft")}
                        >
                          Drafts
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Export Report</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Students</th>
                        <th>Progress</th>
                        <th>Rating</th>
                        <th>Revenue</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myCourses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div
                                  className={`avatar-xs bg-${course.thumbnailColor}-subtle`}
                                >
                                  <div
                                    className={`avatar-title text-${course.thumbnailColor} rounded`}
                                  >
                                    {course.title.charAt(0)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-0">{course.title}</h6>
                                <small className="text-muted">
                                  {course.category}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Users size={14} className="text-muted me-1" />
                              <span className="fw-bold">{course.students}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Progress
                                value={course.progress}
                                color={
                                  course.progress > 80
                                    ? "success"
                                    : course.progress > 50
                                    ? "warning"
                                    : "danger"
                                }
                                className="flex-grow-1 me-2"
                                style={{ height: "6px" }}
                              />
                              <small>{course.progress}%</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Star size={12} className="text-warning me-1" />
                              <span>{course.rating}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <DollarSign
                                size={12}
                                className="text-success me-1"
                              />
                              <span>${course.revenue}</span>
                            </div>
                          </td>
                          <td>
                            <Badge
                              color={
                                course.status === "active"
                                  ? "success"
                                  : course.status === "draft"
                                  ? "warning"
                                  : "secondary"
                              }
                              pill
                            >
                              {course.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Button
                                color="outline-primary"
                                size="sm"
                                className="me-1"
                                tag={Link}
                                to={`/instructor/course/${course.id}`}
                              >
                                <Eye size={12} />
                              </Button>
                              <Button
                                color="outline-info"
                                size="sm"
                                tag={Link}
                                to={`/instructor/course/${course.id}/edit`}
                              >
                                <Edit size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Revenue Analytics */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <BarChart2 size={20} className="me-2 text-primary" />
                      Revenue Analytics
                    </h5>
                    <small className="text-muted">Monthly revenue trend</small>
                  </div>
                  <div className="btn-group" role="group">
                    <Button
                      color={activeTab === "6m" ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setActiveTab("6m")}
                    >
                      6M
                    </Button>
                    <Button
                      color={activeTab === "1y" ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setActiveTab("1y")}
                    >
                      1Y
                    </Button>
                    <Button
                      color={
                        activeTab === "all" ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setActiveTab("all")}
                    >
                      All
                    </Button>
                  </div>
                </div>
                <div
                  className="d-flex align-items-end mb-3"
                  style={{ height: "200px" }}
                >
                  {monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex-fill px-2">
                      <div className="text-center">
                        <div
                          className="mx-auto bg-primary bg-opacity-25 rounded-top"
                          style={{
                            height: `${(month.revenue / 5000) * 150}px`,
                            width: "30px",
                          }}
                          title={`$${month.revenue}`}
                        ></div>
                        <small className="text-muted d-block mt-2">
                          {month.month}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <small className="text-muted">
                    Hover over bars to see exact values
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col lg="4" className="mb-4">
            {/* Upcoming Sessions */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <Clock size={20} className="me-2 text-primary" />
                      Upcoming Sessions
                    </h5>
                    <small className="text-muted">
                      {upcomingSessions.length} scheduled
                    </small>
                  </div>
                  <Button
                    color="outline-primary"
                    size="sm"
                    tag={Link}
                    to="/instructor/schedule"
                  >
                    <Calendar size={14} />
                  </Button>
                </div>

                <ListGroup flush>
                  {upcomingSessions.map((session) => (
                    <ListGroupItem
                      key={session.id}
                      className="border-0 px-0 py-3"
                    >
                      <div className="d-flex align-items-start">
                        <div
                          className={`rounded-circle p-2 me-3 bg-${
                            session.type === "live"
                              ? "danger"
                              : session.type === "qa"
                              ? "info"
                              : "warning"
                          }-subtle`}
                        >
                          {session.type === "live" ? (
                            <Video size={16} />
                          ) : session.type === "qa" ? (
                            <MessageSquare size={16} />
                          ) : (
                            <Book size={16} />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{session.title}</h6>
                            <Badge color="primary" pill>
                              {session.students} students
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center text-muted mb-2">
                            <Clock size={12} className="me-1" />
                            <small>{session.time}</small>
                            <span className="mx-2">•</span>
                            <small>{session.duration}</small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small
                              className={`text-${
                                session.status === "scheduled"
                                  ? "success"
                                  : "warning"
                              }`}
                            >
                              {session.status}
                            </small>
                            <Button
                              color="primary"
                              size="sm"
                              tag={Link}
                              to={`/instructor/session/${session.id}`}
                            >
                              Prepare
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>

            {/* Assignments to Grade */}
            <Card className="border-0 shadow-sm mb-4">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="mb-1">
                      <FileText size={20} className="me-2 text-primary" />
                      Assignments to Grade
                    </h5>
                    <small className="text-muted">
                      {assignmentsToGrade.length} pending review
                    </small>
                  </div>
                  <Button
                    color="outline-primary"
                    size="sm"
                    tag={Link}
                    to="/instructor/assignments"
                  >
                    View All
                  </Button>
                </div>

                <ListGroup flush>
                  {assignmentsToGrade.map((assignment) => (
                    <ListGroupItem
                      key={assignment.id}
                      className="border-0 px-0 py-3"
                    >
                      <div className="d-flex align-items-start">
                        <div
                          className={`rounded-circle p-2 me-3 bg-${
                            assignment.status === "pending" ? "warning" : "info"
                          }-subtle`}
                        >
                          <FileText size={16} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{assignment.assignment}</h6>
                          <small className="text-muted d-block mb-2">
                            {assignment.course} • {assignment.student}
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Submitted: {assignment.submitted}
                            </small>
                            <Badge
                              color={
                                assignment.status === "pending"
                                  ? "warning"
                                  : "info"
                              }
                              pill
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                          <small className="text-muted d-block mt-1">
                            <Clock size={12} className="me-1" />
                            Est. time: {assignment.estimatedTime}
                          </small>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardBody>
                <h5 className="mb-4">Quick Actions</h5>
                <Row>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="primary"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/courses/create"
                    >
                      <Video size={24} className="mb-2" />
                      <small>Create Course</small>
                    </Button>
                  </Col>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="success"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/assignments"
                    >
                      <FileText size={24} className="mb-2" />
                      <small>Grade Work</small>
                    </Button>
                  </Col>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="info"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/analytics"
                    >
                      <BarChart2 size={24} className="mb-2" />
                      <small>Analytics</small>
                    </Button>
                  </Col>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="warning"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/communications"
                    >
                      <MessageSquare size={24} className="mb-2" />
                      <small>Messages</small>
                    </Button>
                  </Col>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="danger"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/schedule"
                    >
                      <Calendar size={24} className="mb-2" />
                      <small>Schedule</small>
                    </Button>
                  </Col>
                  <Col xs="6" className="mb-3">
                    <Button
                      color="secondary"
                      className="w-100 d-flex flex-column align-items-center p-3 h-100"
                      tag={Link}
                      to="/instructor/students"
                    >
                      <UsersIcon size={24} className="mb-2" />
                      <small>Students</small>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Recent Reviews */}
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">
                  <Star size={20} className="me-2 text-primary" />
                  Recent Reviews
                </h5>
                <small className="text-muted">Latest student feedback</small>
              </div>
              <Button
                color="outline-primary"
                size="sm"
                tag={Link}
                to="/instructor/reviews"
              >
                View All Reviews
              </Button>
            </div>

            <Row>
              {recentReviews.map((review) => (
                <Col md="4" key={review.id} className="mb-3">
                  <Card className="h-100 border">
                    <CardBody>
                      <div className="d-flex align-items-start mb-3">
                        <div className="avatar-xs me-3">
                          <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                            {review.student.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{review.student}</h6>
                          <small className="text-muted">{review.course}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={`ms-1 ${
                                star <= review.rating
                                  ? "text-warning"
                                  : "text-muted"
                              }`}
                              fill={
                                star <= review.rating ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-3 small">{review.comment}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{review.date}</small>
                        <div>
                          <Button
                            color="outline-primary"
                            size="sm"
                            className="me-1"
                          >
                            <ThumbsUp size={12} />
                          </Button>
                          <Button color="outline-secondary" size="sm">
                            <MessageSquare size={12} />
                          </Button>
                        </div>
                      </div>
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

export default InstructorDashboard;
