import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  DollarSign,
  BarChart2,
  FileText,
  UserCheck,
  Award,
  MessageSquare,
  MoreVertical,
  Eye,
  Activity,
  Database,
  Server,
  Cpu,
} from "react-feather";

const AdminDashboard = ({ user, token }) => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 1254,
    totalInstructors: 42,
    totalCourses: 48,
    activeCourses: 42,
    pendingApprovals: 15,
    completionRate: 78,
    revenue: 12450,
    todayEnrollments: 15,
    systemAlerts: 3,
    upcomingDeadlines: 7,
    storageUsed: 65,
    activeUsers: 234,
    assignmentsGraded: 89,
    supportTickets: 12,
    averageRating: 4.7,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "Enrolled in course",
      course: "React Masterclass",
      time: "10 min ago",
      type: "enrollment",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "Submitted assignment",
      course: "Data Science 101",
      time: "25 min ago",
      type: "assignment",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Completed course",
      course: "Web Development",
      time: "1 hour ago",
      type: "completion",
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "Requested certificate",
      course: "UI/UX Design",
      time: "2 hours ago",
      type: "certificate",
    },
    {
      id: 5,
      user: "Alex Chen",
      action: "Posted comment",
      course: "Python Basics",
      time: "3 hours ago",
      type: "comment",
    },
  ]);

  const [pendingReviews, setPendingReviews] = useState([
    {
      id: 1,
      course: "Advanced JavaScript",
      instructor: "Dr. Robert",
      students: 45,
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      course: "Machine Learning",
      instructor: "Prof. Sarah",
      students: 32,
      status: "needs-revision",
      date: "2024-01-14",
    },
    {
      id: 3,
      course: "Digital Marketing",
      instructor: "Mr. James",
      students: 28,
      status: "pending",
      date: "2024-01-13",
    },
    {
      id: 4,
      course: "Graphic Design",
      instructor: "Ms. Emily",
      students: 56,
      status: "approved",
      date: "2024-01-12",
    },
  ]);

  const [systemHealth, setSystemHealth] = useState([
    {
      label: "Server Load",
      value: 65,
      color: "success",
      icon: <Server size={14} />,
    },
    {
      label: "Database",
      value: 92,
      color: "warning",
      icon: <Database size={14} />,
    },
    {
      label: "API Response",
      value: 98,
      color: "success",
      icon: <Activity size={14} />,
    },
    { label: "Uptime", value: 99.9, color: "success", icon: <Cpu size={14} /> },
  ]);

  const [monthlyRevenue, setMonthlyRevenue] = useState([
    { month: "Jan", revenue: 10500 },
    { month: "Feb", revenue: 12450 },
    { month: "Mar", revenue: 9800 },
    { month: "Apr", revenue: 15600 },
    { month: "May", revenue: 14200 },
    { month: "Jun", revenue: 18900 },
  ]);

  const [courseCategories, setCourseCategories] = useState([
    { category: "Technology", courses: 18, color: "primary" },
    { category: "Business", courses: 12, color: "success" },
    { category: "Design", courses: 8, color: "warning" },
    { category: "Science", courses: 6, color: "info" },
    { category: "Arts", courses: 4, color: "danger" },
  ]);

  const [quickStats, setQuickStats] = useState([
    {
      label: "Active Sessions",
      value: "234",
      icon: <Activity />,
      color: "primary",
      change: "+12%",
    },
    {
      label: "Avg. Completion",
      value: "78%",
      icon: <Award />,
      color: "success",
      change: "+5%",
    },
    {
      label: "Support Tickets",
      value: "12",
      icon: <MessageSquare />,
      color: "warning",
      change: "-3",
    },
    {
      label: "Certificates",
      value: "89",
      icon: <FileText />,
      color: "info",
      change: "+8",
    },
  ]);

  return (
    <div className="container-fluid p-0">
      {/* Header with Welcome and Notifications */}
      <div className="bg-primary bg-gradient py-4 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 text-white mb-1">Welcome back, {user.name}!</h1>
            <p className="text-white-50 mb-0">LMS Administration Dashboard</p>
          </div>
        </div>
      </div>

      <div className="p-4 px-0">
        {/* Quick Stats Row */}
        <div className="row g-3 mb-4">
          {quickStats.map((stat, index) => (
            <div className="col-xl-3 col-md-6" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2">{stat.label}</h6>
                      <h3 className="mb-0">{stat.value}</h3>
                      <small
                        className={`text-${
                          stat.change.startsWith("+") ? "success" : "danger"
                        }`}
                      >
                        {stat.change} from last week
                      </small>
                    </div>
                    <div
                      className={`avatar-sm bg-${stat.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
                    >
                      {React.cloneElement(stat.icon, {
                        className: `text-${stat.color}`,
                        size: 20,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Left Column - Main Metrics */}
          <div className="col-xl-8">
            {/* Main Stats Grid */}
            <div className="row g-3 mb-4">
              <StatCard
                icon={<Users />}
                color="primary"
                value={dashboardData.totalStudents.toLocaleString()}
                label="Total Students"
                trend="+12% this month"
                link="/admin/students"
                detail="View all students"
              />
              <StatCard
                icon={<BookOpen />}
                color="success"
                value={dashboardData.totalCourses}
                label="Total Courses"
                trend="+5 new today"
                link="/admin/courses"
                detail="Manage courses"
              />
              <StatCard
                icon={<DollarSign />}
                color="info"
                value={`$${dashboardData.revenue.toLocaleString()}`}
                label="Total Revenue"
                trend="+24% this month"
                link="/admin/finance"
                detail="View reports"
              />
              <StatCard
                icon={<AlertCircle />}
                color="warning"
                value={dashboardData.pendingApprovals}
                label="Pending Actions"
                trend="Attention needed"
                link="/admin/approvals"
                detail="Review now"
              />
            </div>

            {/* Revenue Chart and System Health */}
            <div className="row g-4 mb-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="mb-0 d-flex align-items-center">
                      <BarChart2 size={18} className="me-2 text-primary" />
                      Monthly Revenue
                    </h6>
                  </div>
                  <div className="card-body">
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
                                height: `${(month.revenue / 20000) * 150}px`,
                                width: "30px",
                                cursor: "pointer",
                              }}
                              title={`$${month.revenue.toLocaleString()}`}
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
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="mb-0 d-flex align-items-center">
                      <Activity size={18} className="me-2 text-primary" />
                      System Health
                    </h6>
                  </div>
                  <div className="card-body">
                    {systemHealth.map((item, index) => (
                      <div className="mb-3" key={index}>
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted d-flex align-items-center">
                            {item.icon}
                            <span className="ms-2">{item.label}</span>
                          </small>
                          <small className={`text-${item.color} fw-bold`}>
                            {item.value}%
                          </small>
                        </div>
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar bg-${item.color}`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Categories */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Course Categories Distribution</h6>
                <Link to="/admin/courses" className="btn btn-sm btn-link">
                  View All
                </Link>
              </div>
              <div className="card-body">
                <div className="row">
                  {courseCategories.map((cat, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                      <div className="d-flex align-items-center">
                        <div
                          className={`rounded-circle bg-${cat.color} bg-opacity-10 p-2 me-3`}
                        >
                          <BookOpen size={16} className={`text-${cat.color}`} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{cat.category}</h6>
                          <small className="text-muted">
                            {cat.courses} courses
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-xl-4">
            {/* Recent Activity */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Recent Activity</h6>
                <Link to="/admin/activity" className="btn btn-sm btn-link">
                  View All
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="list-group-item border-0 py-3"
                    >
                      <div className="d-flex align-items-start">
                        <div
                          className={`avatar-sm bg-${getActivityColor(
                            activity.type
                          )} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{activity.user}</h6>
                          <p className="mb-1 small">
                            {activity.action} in{" "}
                            <strong>{activity.course}</strong>
                          </p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h6 className="mb-0 fw-bold">Pending Course Reviews</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Instructor</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingReviews.slice(0, 3).map((review) => (
                        <tr key={review.id}>
                          <td>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: "100px" }}
                            >
                              {review.course}
                            </div>
                          </td>
                          <td>{review.instructor}</td>
                          <td>
                            <span
                              className={`badge bg-${getStatusColor(
                                review.status
                              )}`}
                            >
                              {review.status}
                            </span>
                          </td>
                          <td>
                            <NavLink
                              href={"/courses"}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Eye size={12} />
                            </NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-3">
                  <Link
                    to="/admin/reviews"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View All Reviews
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="card border-0 shadow-sm mt-4">
              <div className="card-body">
                <h6 className="card-title mb-3">Quick Actions</h6>
                <div className="row g-2">
                  <QuickActionBtn
                    icon={<Settings />}
                    label="System Settings"
                    color="secondary"
                    link="/admin/settings"
                  />
                  <QuickActionBtn
                    icon={<UserCheck />}
                    label="Manage Users"
                    color="primary"
                    link="/admin/users"
                  />
                  <QuickActionBtn
                    icon={<Download />}
                    label="Export Reports"
                    color="success"
                    link="/admin/reports"
                  />
                  <QuickActionBtn
                    icon={<Upload />}
                    label="Import Data"
                    color="info"
                    link="/admin/import"
                  />
                  <QuickActionBtn
                    icon={<Shield />}
                    label="Security"
                    color="warning"
                    link="/admin/security"
                  />
                  <QuickActionBtn
                    icon={<FileText />}
                    label="Analytics"
                    color="danger"
                    link="/admin/analytics"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Storage Usage */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">Storage Usage</h6>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  This Month
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item">This Week</button>
                  </li>
                  <li>
                    <button className="dropdown-item">This Month</button>
                  </li>
                  <li>
                    <button className="dropdown-item">This Year</button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="progress mb-3" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${dashboardData.storageUsed}%` }}
              ></div>
              <div
                className="progress-bar bg-success"
                style={{ width: "25%" }}
              ></div>
              <div
                className="progress-bar bg-warning"
                style={{ width: "10%" }}
              ></div>
            </div>
            <div className="row text-center">
              <div className="col">
                <small className="text-muted">Courses</small>
                <h6 className="mb-0">350GB</h6>
              </div>
              <div className="col">
                <small className="text-muted">Media</small>
                <h6 className="mb-0">125GB</h6>
              </div>
              <div className="col">
                <small className="text-muted">Backups</small>
                <h6 className="mb-0">50GB</h6>
              </div>
              <div className="col">
                <small className="text-muted">Free</small>
                <h6 className="mb-0">175GB</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ icon, color, value, label, trend, link, detail }) => (
  <div className="col-xl-3 col-md-6">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div
              className={`avatar-sm bg-${color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3`}
            >
              {React.cloneElement(icon, {
                className: `text-${color}`,
                size: 20,
              })}
            </div>
            <h3 className="mb-1">{value}</h3>
            <p className="text-muted mb-2">{label}</p>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted"
              data-bs-toggle="dropdown"
            >
              <MoreVertical size={16} />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to={link}>
                  View Details
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to={`${link}/analytics`}>
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small
            className={`text-${trend.includes("+") ? "success" : "warning"}`}
          >
            <TrendingUp size={12} className="me-1" />
            {trend}
          </small>
          <Link to={link} className="btn btn-sm btn-link">
            {detail} →
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Quick Action Button
const QuickActionBtn = ({ icon, label, color, link }) => (
  <div className="col-6">
    <Link
      to={link}
      className={`btn btn-soft-${color} w-100 py-3 d-flex flex-column align-items-center text-decoration-none mb-2`}
    >
      <div className="mb-2">{React.cloneElement(icon, { size: 20 })}</div>
      <span className="small fw-medium">{label}</span>
    </Link>
  </div>
);

// Helper functions
const getActivityColor = (type) => {
  switch (type) {
    case "enrollment":
      return "success";
    case "assignment":
      return "info";
    case "completion":
      return "primary";
    case "certificate":
      return "warning";
    case "comment":
      return "secondary";
    default:
      return "secondary";
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case "enrollment":
      return <UserCheck size={16} className="text-success" />;
    case "assignment":
      return <FileText size={16} className="text-info" />;
    case "completion":
      return <Award size={16} className="text-primary" />;
    case "certificate":
      return <Award size={16} className="text-warning" />;
    case "comment":
      return <MessageSquare size={16} className="text-secondary" />;
    default:
      return <Activity size={16} className="text-secondary" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "needs-revision":
      return "info";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "secondary";
  }
};

export default AdminDashboard;
