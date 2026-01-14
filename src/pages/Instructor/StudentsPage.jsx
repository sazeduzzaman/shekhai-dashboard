import React, { Component } from "react";
import { Link } from "react-router-dom";

class StudentsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [
        {
          id: 1,
          studentId: "STU001",
          name: "John Smith",
          email: "john.smith@student.edu",
          course: "Mathematics 101",
          enrollmentDate: "2023-09-01",
          status: "active",
          grade: "A",
          lastActivity: "2023-10-15",
          assignmentsCompleted: 8,
          totalAssignments: 10,
          attendance: "95%",
        },
        {
          id: 2,
          studentId: "STU002",
          name: "Sarah Johnson",
          email: "sarah.j@student.edu",
          course: "Mathematics 101",
          enrollmentDate: "2023-09-01",
          status: "active",
          grade: "B+",
          lastActivity: "2023-10-14",
          assignmentsCompleted: 7,
          totalAssignments: 10,
          attendance: "92%",
        },
        {
          id: 3,
          studentId: "STU003",
          name: "Michael Chen",
          email: "m.chen@student.edu",
          course: "Computer Science 201",
          enrollmentDate: "2023-09-05",
          status: "active",
          grade: "A-",
          lastActivity: "2023-10-15",
          assignmentsCompleted: 9,
          totalAssignments: 10,
          attendance: "98%",
        },
        {
          id: 4,
          studentId: "STU004",
          name: "Emily Davis",
          email: "emily.davis@student.edu",
          course: "Physics 101",
          enrollmentDate: "2023-09-02",
          status: "active",
          grade: "B",
          lastActivity: "2023-10-13",
          assignmentsCompleted: 6,
          totalAssignments: 10,
          attendance: "90%",
        },
        {
          id: 5,
          studentId: "STU005",
          name: "Robert Wilson",
          email: "robert.w@student.edu",
          course: "Mathematics 101",
          enrollmentDate: "2023-09-01",
          status: "inactive",
          grade: "C+",
          lastActivity: "2023-10-05",
          assignmentsCompleted: 4,
          totalAssignments: 10,
          attendance: "75%",
        },
        {
          id: 6,
          studentId: "STU006",
          name: "Lisa Brown",
          email: "lisa.b@student.edu",
          course: "Literature 301",
          enrollmentDate: "2023-09-03",
          status: "active",
          grade: "A",
          lastActivity: "2023-10-15",
          assignmentsCompleted: 10,
          totalAssignments: 10,
          attendance: "100%",
        },
        {
          id: 7,
          studentId: "STU007",
          name: "David Miller",
          email: "d.miller@student.edu",
          course: "Chemistry 150",
          enrollmentDate: "2023-09-04",
          status: "active",
          grade: "B+",
          lastActivity: "2023-10-14",
          assignmentsCompleted: 8,
          totalAssignments: 10,
          attendance: "96%",
        },
        {
          id: 8,
          studentId: "STU008",
          name: "Jennifer Lee",
          email: "j.lee@student.edu",
          course: "Computer Science 201",
          enrollmentDate: "2023-09-05",
          status: "active",
          grade: "A",
          lastActivity: "2023-10-15",
          assignmentsCompleted: 9,
          totalAssignments: 10,
          attendance: "99%",
        },
      ],
      courses: [
        "All Courses",
        "Mathematics 101",
        "Computer Science 201",
        "Physics 101",
        "Literature 301",
        "Chemistry 150",
      ],
      statuses: ["All Status", "active", "inactive"],
      selectedCourse: "All Courses",
      selectedStatus: "All Status",
      searchTerm: "",
      sortField: "name",
      sortDirection: "asc",
      selectedStudents: [],
      currentPage: 1,
      itemsPerPage: 10,
      showExportModal: false,
      showSendMessageModal: false,
      showBulkActions: false,
    };
  }

  // Filter students based on selections
  getFilteredStudents = () => {
    const { students, selectedCourse, selectedStatus, searchTerm } = this.state;

    let filtered = [...students];

    // Filter by course
    if (selectedCourse !== "All Courses") {
      filtered = filtered.filter(
        (student) => student.course === selectedCourse
      );
    }

    // Filter by status
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter(
        (student) => student.status === selectedStatus
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.studentId.toLowerCase().includes(term) ||
          student.course.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Sort students
  getSortedStudents = () => {
    const { sortField, sortDirection } = this.state;
    const filtered = this.getFilteredStudents();

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special fields
      if (sortField === "assignmentsCompleted") {
        aValue = a.assignmentsCompleted / a.totalAssignments;
        bValue = b.assignmentsCompleted / b.totalAssignments;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Get paginated students
  getPaginatedStudents = () => {
    const sorted = this.getSortedStudents();
    const { currentPage, itemsPerPage } = this.state;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return sorted.slice(startIndex, endIndex);
  };

  // Handle sorting
  handleSort = (field) => {
    this.setState((prevState) => ({
      sortField: field,
      sortDirection:
        prevState.sortField === field && prevState.sortDirection === "asc"
          ? "desc"
          : "asc",
      currentPage: 1,
    }));
  };

  // Handle filter changes
  handleCourseChange = (e) => {
    this.setState({
      selectedCourse: e.target.value,
      currentPage: 1,
      selectedStudents: [],
    });
  };

  handleStatusChange = (e) => {
    this.setState({
      selectedStatus: e.target.value,
      currentPage: 1,
      selectedStudents: [],
    });
  };

  handleSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
      currentPage: 1,
      selectedStudents: [],
    });
  };

  // Handle student selection
  handleSelectStudent = (studentId) => {
    this.setState((prevState) => {
      const isSelected = prevState.selectedStudents.includes(studentId);
      const updatedSelection = isSelected
        ? prevState.selectedStudents.filter((id) => id !== studentId)
        : [...prevState.selectedStudents, studentId];

      return {
        selectedStudents: updatedSelection,
        showBulkActions: updatedSelection.length > 0,
      };
    });
  };

  handleSelectAll = () => {
    const filtered = this.getFilteredStudents();
    const allIds = filtered.map((student) => student.id);

    this.setState((prevState) => ({
      selectedStudents:
        prevState.selectedStudents.length === allIds.length ? [] : allIds,
      showBulkActions: !(prevState.selectedStudents.length === allIds.length),
    }));
  };

  // Handle pagination
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  // Get status badge class
  getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "inactive":
        return "bg-secondary";
      default:
        return "bg-warning text-dark";
    }
  };

  // Get grade badge class
  getGradeBadgeClass = (grade) => {
    if (grade.includes("A")) return "bg-success";
    if (grade.includes("B")) return "bg-info";
    if (grade.includes("C")) return "bg-warning text-dark";
    return "bg-danger";
  };

  // Get progress percentage
  getProgressPercentage = (student) => {
    return Math.round(
      (student.assignmentsCompleted / student.totalAssignments) * 100
    );
  };

  // Get progress bar color
  getProgressBarColor = (percentage) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 70) return "bg-primary";
    if (percentage >= 50) return "bg-warning";
    return "bg-danger";
  };

  // Handle export
  handleExport = () => {
    const filtered = this.getFilteredStudents();
    const exportData = filtered.map((student) => ({
      "Student ID": student.studentId,
      Name: student.name,
      Email: student.email,
      Course: student.course,
      Status: student.status,
      Grade: student.grade,
      "Enrollment Date": student.enrollmentDate,
      "Assignments Completed": `${student.assignmentsCompleted}/${student.totalAssignments}`,
      Attendance: student.attendance,
      "Last Activity": student.lastActivity,
    }));

    // Convert to CSV
    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.setState({ showExportModal: false });
    alert("✓ Student data exported successfully!");
  };

  // Handle send message
  handleSendMessage = () => {
    const { selectedStudents, students } = this.state;
    const selectedNames = students
      .filter((s) => selectedStudents.includes(s.id))
      .map((s) => s.name)
      .join(", ");

    alert(`Message dialog would open for: ${selectedNames}`);
    this.setState({
      showSendMessageModal: false,
      selectedStudents: [],
      showBulkActions: false,
    });
  };

  // Handle bulk status change
  handleBulkStatusChange = (newStatus) => {
    const { selectedStudents, students } = this.state;

    // In a real app, you would make an API call here
    const updatedStudents = students.map((student) =>
      selectedStudents.includes(student.id)
        ? { ...student, status: newStatus }
        : student
    );

    this.setState({
      students: updatedStudents,
      selectedStudents: [],
      showBulkActions: false,
    });

    alert(`✓ ${selectedStudents.length} student(s) marked as ${newStatus}`);
  };

  // Calculate statistics
  calculateStats = () => {
    const filtered = this.getFilteredStudents();
    const total = filtered.length;
    const active = filtered.filter((s) => s.status === "active").length;
    const averageProgress =
      total > 0
        ? Math.round(
            filtered.reduce(
              (sum, s) => sum + this.getProgressPercentage(s),
              0
            ) / total
          )
        : 0;

    return { total, active, averageProgress };
  };

  render() {
    const {
      courses,
      statuses,
      selectedCourse,
      selectedStatus,
      searchTerm,
      sortField,
      sortDirection,
      selectedStudents,
      currentPage,
      itemsPerPage,
      showExportModal,
      showSendMessageModal,
      showBulkActions,
    } = this.state;

    const filteredStudents = this.getFilteredStudents();
    const paginatedStudents = this.getPaginatedStudents();
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const stats = this.calculateStats();

    return (
      <div className="page-content">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Students Management</h1>
              <p className="text-muted">
                View and manage all students enrolled in your courses
              </p>
            </div>
            <div>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => this.setState({ showExportModal: true })}
              >
                <i className="bi bi-download me-2"></i>
                Export
              </button>
              <Link
                to="/instructor/announcements"
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-megaphone me-2"></i>
                Announcements
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Students</h6>
                      <h3 className="mb-0">{stats.total}</h3>
                      <small className="text-muted">Across all courses</small>
                    </div>
                    <div className="bg-primary rounded-circle p-3">
                      <i className="bi bi-people text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Active Students</h6>
                      <h3 className="mb-0">{stats.active}</h3>
                      <small className="text-muted">
                        {stats.total > 0
                          ? Math.round((stats.active / stats.total) * 100)
                          : 0}
                        % of total
                      </small>
                    </div>
                    <div className="bg-success rounded-circle p-3">
                      <i className="bi bi-check-circle text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Avg. Progress</h6>
                      <h3 className="mb-0">{stats.averageProgress}%</h3>
                      <small className="text-muted">
                        Assignments completed
                      </small>
                    </div>
                    <div className="bg-info rounded-circle p-3">
                      <i className="bi bi-graph-up text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <div className="alert alert-info d-flex justify-content-between align-items-center mb-4">
              <div>
                <i className="bi bi-info-circle me-2"></i>
                <strong>{selectedStudents.length} student(s) selected</strong>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => this.handleBulkStatusChange("active")}
                >
                  <i className="bi bi-check-circle me-1"></i> Mark Active
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => this.handleBulkStatusChange("inactive")}
                >
                  <i className="bi bi-x-circle me-1"></i> Mark Inactive
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => this.setState({ showSendMessageModal: true })}
                >
                  <i className="bi bi-envelope me-1"></i> Send Message
                </button>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Filter by Course</label>
                  <select
                    className="form-select"
                    value={selectedCourse}
                    onChange={this.handleCourseChange}
                  >
                    {courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Filter by Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={this.handleStatusChange}
                  >
                    {statuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Search Students</label>
                  <div className="input-group">
                    <span className="input-group-text">S</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, student ID, or course..."
                      value={searchTerm}
                      onChange={this.handleSearchChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selectedStudents.length ===
                              filteredStudents.length &&
                            filteredStudents.length > 0
                          }
                          onChange={this.handleSelectAll}
                        />
                      </th>
                      <th>
                        <button
                          className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                          onClick={() => this.handleSort("name")}
                        >
                          Student
                          {sortField === "name" && (
                            <i
                              className={`bi bi-arrow-${
                                sortDirection === "asc" ? "up" : "down"
                              } ms-1`}
                            ></i>
                          )}
                        </button>
                      </th>
                      <th>
                        <button
                          className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                          onClick={() => this.handleSort("course")}
                        >
                          Course
                          {sortField === "course" && (
                            <i
                              className={`bi bi-arrow-${
                                sortDirection === "asc" ? "up" : "down"
                              } ms-1`}
                            ></i>
                          )}
                        </button>
                      </th>
                      <th>Status</th>
                      <th>Grade</th>
                      <th>
                        <button
                          className="btn btn-link p-0 text-decoration-none text-dark fw-bold"
                          onClick={() =>
                            this.handleSort("assignmentsCompleted")
                          }
                        >
                          Progress
                          {sortField === "assignmentsCompleted" && (
                            <i
                              className={`bi bi-arrow-${
                                sortDirection === "asc" ? "up" : "down"
                              } ms-1`}
                            ></i>
                          )}
                        </button>
                      </th>
                      <th>Attendance</th>
                      <th>Last Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <i className="bi bi-people fs-1 text-muted mb-3"></i>
                          <h5>No students found</h5>
                          <p className="text-muted">
                            {searchTerm ||
                            selectedCourse !== "All Courses" ||
                            selectedStatus !== "All Status"
                              ? "Try adjusting your filters or search term"
                              : "No students enrolled yet"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((student) => (
                        <tr
                          key={student.id}
                          className={
                            selectedStudents.includes(student.id)
                              ? "table-primary"
                              : ""
                          }
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() =>
                                this.handleSelectStudent(student.id)
                              }
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-3">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <div>
                                <strong>{student.name}</strong>
                                <div className="text-muted small">
                                  {student.email}
                                  <br />
                                  <small>ID: {student.studentId}</small>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge course-tag">
                              <i className="bi bi-journal me-1"></i>{" "}
                              {student.course}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${this.getStatusBadgeClass(
                                student.status
                              )}`}
                            >
                              {student.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${this.getGradeBadgeClass(
                                student.grade
                              )}`}
                            >
                              {student.grade}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="progress flex-grow-1 me-2"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className={`progress-bar ${this.getProgressBarColor(
                                    this.getProgressPercentage(student)
                                  )}`}
                                  style={{
                                    width: `${this.getProgressPercentage(
                                      student
                                    )}%`,
                                  }}
                                  role="progressbar"
                                ></div>
                              </div>
                              <small>
                                {this.getProgressPercentage(student)}%
                              </small>
                            </div>
                            <small className="text-muted">
                              {student.assignmentsCompleted}/
                              {student.totalAssignments} assignments
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-calendar-check me-1"></i>{" "}
                              {student.attendance}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>{" "}
                              {student.lastActivity}
                            </small>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary border-0"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-eye me-2"></i> View
                                    Profile
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-envelope me-2"></i> Send
                                    Message
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item">
                                    <i className="bi bi-pencil me-2"></i> Edit
                                    Grade
                                  </button>
                                </li>
                                <li>
                                  <hr className="dropdown-divider" />
                                </li>
                                <li>
                                  <button className="dropdown-item text-danger">
                                    <i className="bi bi-trash me-2"></i> Remove
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-between align-items-center mt-4">
                  <small className="text-muted">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredStudents.length
                    )}{" "}
                    of {filteredStudents.length} students
                  </small>
                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => this.handlePageChange(currentPage - 1)}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li
                          key={page}
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => this.handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => this.handlePageChange(currentPage + 1)}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>

          {/* Export Modal */}
          {showExportModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Export Student Data</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => this.setState({ showExportModal: false })}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>Export student data to CSV file?</p>
                    <small className="text-muted">
                      This will include {filteredStudents.length} student(s)
                      based on your current filters.
                    </small>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => this.setState({ showExportModal: false })}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleExport}
                    >
                      <i className="bi bi-download me-2"></i>
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Message Modal */}
          {showSendMessageModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Send Message to Students</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        this.setState({ showSendMessageModal: false })
                      }
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Send message to {selectedStudents.length} selected
                      student(s)?
                    </p>
                    <div className="mb-3">
                      <label className="form-label">Message Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter subject..."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message Content</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter your message..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        this.setState({ showSendMessageModal: false })
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.handleSendMessage}
                    >
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backdrop for modals */}
          {(showExportModal || showSendMessageModal) && (
            <div className="modal-backdrop fade show"></div>
          )}
        </div>
      </div>
    );
  }
}

export default StudentsPage;
