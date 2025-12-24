import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  MessageSquare,
  BookOpen,
  Download,
  Filter,
  Eye,
  Activity,
  Target,
  Zap,
  Calendar,
  TrendingUp as TrendingUpIcon,
  PieChart,
  LineChart,
  Settings,
} from "react-feather";

const InstructorPerformance = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [activeMetric, setActiveMetric] = useState("overall");

  // Performance metrics data
  const performanceMetrics = {
    overall: {
      score: 87,
      change: "+5.4%",
      trend: "up",
      details: "Based on 15+ performance indicators",
    },
    teaching: {
      score: 92,
      change: "+2.1%",
      trend: "up",
      details: "Student satisfaction & content quality",
    },
    engagement: {
      score: 78,
      change: "-1.2%",
      trend: "down",
      details: "Student interaction & participation",
    },
    revenue: {
      score: 95,
      change: "+12.5%",
      trend: "up",
      details: "Course sales & conversions",
    },
  };

  // Monthly performance data
  const monthlyData = [
    { month: "Jan", score: 82, students: 120 },
    { month: "Feb", score: 85, students: 135 },
    { month: "Mar", score: 84, students: 128 },
    { month: "Apr", score: 88, students: 142 },
    { month: "May", score: 90, students: 156 },
    { month: "Jun", score: 92, students: 168 },
  ];

  // Top courses
  const topCourses = [
    { title: "React Masterclass", students: 450, rating: 4.9, revenue: 12500 },
    { title: "UI/UX Design Pro", students: 320, rating: 4.8, revenue: 8500 },
    {
      title: "Node.js Architecture",
      students: 180,
      rating: 4.7,
      revenue: 5000,
    },
  ];

  // Quick stats
  const quickStats = [
    {
      label: "Total Students",
      value: "1,245",
      icon: <Users />,
      change: "+12%",
    },
    { label: "Avg. Rating", value: "4.8/5", icon: <Star />, change: "+0.3" },
    {
      label: "Completion Rate",
      value: "92%",
      icon: <CheckCircle />,
      change: "+2%",
    },
    { label: "Response Time", value: "4.2h", icon: <Clock />, change: "-1.2h" },
  ];

  return (
    <div className="container-fluid px-3 px-lg-4 py-4 mt-5 pt-5">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="h3 fw-bold mb-2">Performance Dashboard</h1>
              <p className="text-muted mb-0">
                Track and optimize your teaching performance
              </p>
            </div>
            <div className="d-flex gap-2">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <Filter size={16} className="me-2" />
                  {timeRange === "monthly" ? "Monthly" : "Quarterly"}
                </button>
                <ul className="dropdown-menu shadow-sm">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeRange("weekly")}
                    >
                      Weekly
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeRange("monthly")}
                    >
                      Monthly
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimeRange("quarterly")}
                    >
                      Quarterly
                    </button>
                  </li>
                </ul>
              </div>
              <button className="btn btn-primary">
                <Download size={16} className="me-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    {React.cloneElement(stat.icon, {
                      className: "text-primary",
                      size: 20,
                    })}
                  </div>
                  <span
                    className={`badge ${
                      stat.change.startsWith("+") ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="fw-bold mb-1">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Left Column - Performance Metrics */}
        <div className="col-lg-8">
          {/* Performance Score Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title mb-1">Performance Score</h5>
                  <p className="text-muted mb-0">
                    Your overall teaching performance
                  </p>
                </div>
                <div className="btn-group" role="group">
                  {Object.keys(performanceMetrics).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`btn btn-sm ${
                        activeMetric === key
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveMetric(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center py-4">
                <div className="position-relative d-inline-block">
                  <div className="display-1 fw-bold text-primary">
                    {performanceMetrics[activeMetric].score}%
                  </div>
                  <div
                    className={`position-absolute top-0 end-0 badge ${
                      performanceMetrics[activeMetric].trend === "up"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {performanceMetrics[activeMetric].trend === "up" ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {performanceMetrics[activeMetric].change}
                  </div>
                </div>
                <p className="text-muted mt-2">
                  {performanceMetrics[activeMetric].details}
                </p>
              </div>

              {/* Progress Visualization */}
              <div className="mt-4">
                {monthlyData.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small">{item.month}</span>
                      <span className="small fw-bold">{item.score}%</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Top Courses */}
        <div className="col-lg-4">
          {/* Top Courses */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Top Performing Courses</h5>
                <Link to="/instructor/courses" className="btn btn-link btn-sm">
                  View All
                </Link>
              </div>

              <div className="list-group list-group-flush">
                {topCourses.map((course, index) => (
                  <div
                    key={index}
                    className="list-group-item border-0 px-0 py-3"
                  >
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <BookOpen size={16} className="text-primary" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{course.title}</h6>
                        <div className="d-flex align-items-center small text-muted mb-2">
                          <Star size={12} className="text-warning me-1" />
                          <span className="me-3">{course.rating}</span>
                          <Users size={12} className="me-1" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-success fw-bold">
                            ${course.revenue.toLocaleString()}
                          </span>
                          <button className="btn btn-outline-primary btn-sm">
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-white text-black bg-opacity-20 rounded-circle p-2 me-3">
                  <Zap size={20} />
                </div>
                <h5 className="card-title mb-0">Performance Insights</h5>
              </div>
              <p className="mb-3 opacity-75">
                Your response time has improved by 15% this month. Keep engaging
                with students promptly.
              </p>
              <div className="bg-white bg-opacity-10 rounded p-3 mb-3">
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-1 px-2 me-2">
                    <TrendingUpIcon size={12} className="text-dark" />
                  </div>
                  <div>
                    <small className="opacity-75">Trending Up</small>
                    <p className="mb-0 fw-bold">Student engagement +8%</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-light w-100">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4 mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Recent Activity</h5>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Course</th>
                      <th>Impact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Today</td>
                      <td>Live Q&A Session</td>
                      <td>React Masterclass</td>
                      <td>
                        <span className="badge bg-success">+12 Engagement</span>
                      </td>
                      <td>
                        <span className="badge bg-success">Completed</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Yesterday</td>
                      <td>Course Update</td>
                      <td>UI/UX Design</td>
                      <td>
                        <span className="badge bg-info">Content Improved</span>
                      </td>
                      <td>
                        <span className="badge bg-info">Published</span>
                      </td>
                    </tr>
                    <tr>
                      <td>2 days ago</td>
                      <td>Student Feedback</td>
                      <td>Node.js Architecture</td>
                      <td>
                        <span className="badge bg-warning">Review Pending</span>
                      </td>
                      <td>
                        <span className="badge bg-warning">In Progress</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPerformance;
