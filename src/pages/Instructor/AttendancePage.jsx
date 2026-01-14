import React, { Component } from "react";
import { Link } from "react-router-dom";

class AttendancePage extends Component {
  constructor(props) {
    super(props);

    // Sample courses with schedule
    const courses = [
      {
        id: 1,
        name: "Mathematics 101",
        code: "MATH101",
        schedule: "Mon, Wed, Fri 10:00 AM",
        totalSessions: 30,
      },
      {
        id: 2,
        name: "Computer Science 201",
        code: "CS201",
        schedule: "Tue, Thu 2:00 PM",
        totalSessions: 20,
      },
      {
        id: 3,
        name: "Physics 101",
        code: "PHYS101",
        schedule: "Mon, Wed 1:00 PM",
        totalSessions: 25,
      },
    ];

    // Sample students data with attendance records
    const students = [
      {
        id: 1,
        studentId: "STU001",
        name: "John Smith",
        email: "john.smith@student.edu",
        courseId: 1,
        course: "Mathematics 101",
        attendanceRecords: [
          { date: "2023-10-02", status: "present", notes: "" },
          { date: "2023-10-04", status: "present", notes: "" },
          { date: "2023-10-06", status: "absent", notes: "Excused - Medical" },
          { date: "2023-10-09", status: "present", notes: "" },
          { date: "2023-10-11", status: "late", notes: "15 minutes late" },
          { date: "2023-10-13", status: "present", notes: "" },
        ],
      },
      {
        id: 2,
        studentId: "STU002",
        name: "Sarah Johnson",
        email: "sarah.j@student.edu",
        courseId: 1,
        course: "Mathematics 101",
        attendanceRecords: [
          { date: "2023-10-02", status: "present", notes: "" },
          { date: "2023-10-04", status: "present", notes: "" },
          { date: "2023-10-06", status: "present", notes: "" },
          { date: "2023-10-09", status: "present", notes: "" },
          { date: "2023-10-11", status: "present", notes: "" },
          { date: "2023-10-13", status: "present", notes: "" },
        ],
      },
      {
        id: 3,
        studentId: "STU003",
        name: "Michael Chen",
        email: "m.chen@student.edu",
        courseId: 2,
        course: "Computer Science 201",
        attendanceRecords: [
          { date: "2023-10-03", status: "present", notes: "" },
          { date: "2023-10-05", status: "present", notes: "" },
          { date: "2023-10-10", status: "absent", notes: "No excuse" },
          { date: "2023-10-12", status: "present", notes: "" },
        ],
      },
      {
        id: 4,
        studentId: "STU004",
        name: "Emily Davis",
        email: "emily.davis@student.edu",
        courseId: 3,
        course: "Physics 101",
        attendanceRecords: [
          { date: "2023-10-02", status: "late", notes: "10 minutes late" },
          { date: "2023-10-04", status: "present", notes: "" },
          { date: "2023-10-09", status: "present", notes: "" },
          { date: "2023-10-11", status: "present", notes: "" },
        ],
      },
      {
        id: 5,
        studentId: "STU005",
        name: "Robert Wilson",
        email: "robert.w@student.edu",
        courseId: 1,
        course: "Mathematics 101",
        attendanceRecords: [
          { date: "2023-10-02", status: "absent", notes: "" },
          { date: "2023-10-04", status: "absent", notes: "" },
          { date: "2023-10-06", status: "present", notes: "" },
          { date: "2023-10-09", status: "absent", notes: "" },
          { date: "2023-10-11", status: "present", notes: "" },
          { date: "2023-10-13", status: "absent", notes: "" },
        ],
      },
      {
        id: 6,
        studentId: "STU006",
        name: "Lisa Brown",
        email: "lisa.b@student.edu",
        courseId: 2,
        course: "Computer Science 201",
        attendanceRecords: [
          { date: "2023-10-03", status: "present", notes: "" },
          { date: "2023-10-05", status: "present", notes: "" },
          { date: "2023-10-10", status: "present", notes: "" },
          { date: "2023-10-12", status: "present", notes: "" },
        ],
      },
    ];

    // Generate session dates for the selected course
    const generateSessionDates = (courseId) => {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return [];

      // Generate sample dates based on course schedule
      const dates = [];
      let currentDate = new Date("2023-10-02");

      for (let i = 0; i < course.totalSessions && i < 10; i++) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]);
        // Add 2 days for next session (simplified)
        currentDate.setDate(currentDate.getDate() + 2);
      }

      return dates;
    };

    this.state = {
      courses: courses,
      students: students,
      selectedCourse: courses[0].id,
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      sessionDates: generateSessionDates(courses[0].id),
      attendanceStatus: {},
      showTakeAttendanceModal: false,
      showBulkAttendanceModal: false,
      selectedDate: new Date().toISOString().split("T")[0],
      bulkStatus: "present",
      isSubmitting: false,
      viewMode: "calendar", // "calendar" or "summary"
      attendanceSummary: {},
    };

    // Initialize attendance status from student records
    this.initializeAttendanceStatus();
  }

  initializeAttendanceStatus = () => {
    const { students, selectedCourse, sessionDates } = this.state;

    const courseStudents = students.filter(
      (s) => s.courseId === selectedCourse
    );
    const status = {};

    // Initialize status for each student and date
    courseStudents.forEach((student) => {
      status[student.id] = {};
      sessionDates.forEach((date) => {
        // Find existing record for this date
        const existingRecord = student.attendanceRecords.find(
          (r) => r.date === date
        );
        status[student.id][date] = existingRecord
          ? existingRecord.status
          : "not_marked";
      });
    });

    this.setState({ attendanceStatus: status });
    this.calculateAttendanceSummary();
  };

  handleCourseChange = (courseId) => {
    const { courses } = this.state;
    const selectedCourse = courses.find((c) => c.id === courseId);

    // Generate new session dates for selected course
    const sessionDates = [];
    let currentDate = new Date("2023-10-02");

    for (let i = 0; i < selectedCourse.totalSessions && i < 10; i++) {
      sessionDates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 2);
    }

    this.setState(
      {
        selectedCourse: courseId,
        sessionDates: sessionDates,
      },
      () => {
        this.initializeAttendanceStatus();
      }
    );
  };

  handleMonthChange = (monthIndex) => {
    this.setState({ selectedMonth: monthIndex }, () => {
      this.calculateAttendanceSummary();
    });
  };

  handleStatusChange = (studentId, date, status) => {
    this.setState(
      (prevState) => ({
        attendanceStatus: {
          ...prevState.attendanceStatus,
          [studentId]: {
            ...prevState.attendanceStatus[studentId],
            [date]: status,
          },
        },
      }),
      () => {
        this.calculateAttendanceSummary();
      }
    );
  };

  handleBulkStatusChange = (date, status) => {
    const { students, selectedCourse } = this.state;
    const courseStudents = students.filter(
      (s) => s.courseId === selectedCourse
    );

    const updatedStatus = { ...this.state.attendanceStatus };

    courseStudents.forEach((student) => {
      if (!updatedStatus[student.id]) {
        updatedStatus[student.id] = {};
      }
      updatedStatus[student.id][date] = status;
    });

    this.setState(
      {
        attendanceStatus: updatedStatus,
        showBulkAttendanceModal: false,
      },
      () => {
        this.calculateAttendanceSummary();
      }
    );

    alert(`✓ Attendance marked as "${status}" for all students on ${date}`);
  };

  calculateAttendanceSummary = () => {
    const { students, selectedCourse, sessionDates, attendanceStatus } =
      this.state;
    const courseStudents = students.filter(
      (s) => s.courseId === selectedCourse
    );

    const summary = {
      totalStudents: courseStudents.length,
      totalSessions: sessionDates.length,
      attendanceByStudent: {},
      overallStats: {
        present: 0,
        absent: 0,
        late: 0,
        notMarked: 0,
        total: 0,
      },
    };

    // Calculate for each student
    courseStudents.forEach((student) => {
      const studentStatus = attendanceStatus[student.id] || {};
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      let notMarkedCount = 0;

      sessionDates.forEach((date) => {
        const status = studentStatus[date] || "not_marked";
        if (status === "present") presentCount++;
        else if (status === "absent") absentCount++;
        else if (status === "late") lateCount++;
        else if (status === "not_marked") notMarkedCount++;
      });

      const totalMarked = presentCount + absentCount + lateCount;
      const attendancePercentage =
        totalMarked > 0
          ? Math.round(((presentCount + lateCount * 0.5) / totalMarked) * 100)
          : 0;

      summary.attendanceByStudent[student.id] = {
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        notMarked: notMarkedCount,
        percentage: attendancePercentage,
        status:
          attendancePercentage >= 80
            ? "good"
            : attendancePercentage >= 60
            ? "warning"
            : "poor",
      };

      // Update overall stats
      summary.overallStats.present += presentCount;
      summary.overallStats.absent += absentCount;
      summary.overallStats.late += lateCount;
      summary.overallStats.notMarked += notMarkedCount;
      summary.overallStats.total += sessionDates.length;
    });

    this.setState({ attendanceSummary: summary });
  };

  getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <span className="badge bg-success">Present</span>;
      case "absent":
        return <span className="badge bg-danger">Absent</span>;
      case "late":
        return <span className="badge bg-warning text-dark">Late</span>;
      case "not_marked":
        return <span className="badge bg-secondary">Not Marked</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  getAttendancePercentageColor = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 80) return "text-primary";
    if (percentage >= 70) return "text-warning";
    return "text-danger";
  };

  handleSaveAttendance = () => {
    this.setState({ isSubmitting: true });

    // Simulate API call
    setTimeout(() => {
      alert("✓ Attendance records saved successfully!");
      this.setState({ isSubmitting: false });
    }, 1000);
  };

  handleExportAttendance = () => {
    const { students, selectedCourse, sessionDates, attendanceStatus } =
      this.state;
    const courseStudents = students.filter(
      (s) => s.courseId === selectedCourse
    );
    const course = this.state.courses.find((c) => c.id === selectedCourse);

    // Prepare CSV data
    const headers = [
      "Student ID",
      "Name",
      "Email",
      ...sessionDates,
      "Present Count",
      "Absent Count",
      "Late Count",
      "Attendance %",
    ];

    const rows = courseStudents.map((student) => {
      const studentStatus = attendanceStatus[student.id] || {};
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      const dateStatuses = sessionDates.map((date) => {
        const status = studentStatus[date] || "not_marked";
        if (status === "present") presentCount++;
        else if (status === "absent") absentCount++;
        else if (status === "late") lateCount++;

        return status === "present"
          ? "P"
          : status === "absent"
          ? "A"
          : status === "late"
          ? "L"
          : "-";
      });

      const totalMarked = presentCount + absentCount + lateCount;
      const attendancePercentage =
        totalMarked > 0
          ? Math.round(((presentCount + lateCount * 0.5) / totalMarked) * 100)
          : 0;

      return [
        student.studentId,
        student.name,
        student.email,
        ...dateStatuses,
        presentCount.toString(),
        absentCount.toString(),
        lateCount.toString(),
        `${attendancePercentage}%`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${course.code}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("✓ Attendance data exported successfully!");
  };

  render() {
    const {
      courses,
      students,
      selectedCourse,
      sessionDates,
      attendanceStatus,
      showTakeAttendanceModal,
      showBulkAttendanceModal,
      selectedDate,
      bulkStatus,
      isSubmitting,
      viewMode,
      attendanceSummary,
    } = this.state;

    const course = courses.find((c) => c.id === selectedCourse);
    const courseStudents = students.filter(
      (s) => s.courseId === selectedCourse
    );
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="page-content">
        <div className="container-fluid">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Attendance Management</h1>
              <p className="text-muted">
                Track and manage student attendance for your courses
              </p>
            </div>
            <div>
              <Link
                to="/instructor/students"
                className="btn btn-outline-secondary me-2"
              >
                <i className="bi bi-people me-2"></i>
                Students
              </Link>
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
            <div className="col-md-3 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Students</h6>
                      <h3 className="mb-0">
                        {attendanceSummary.totalStudents || 0}
                      </h3>
                      <small className="text-muted">In selected course</small>
                    </div>
                    <div className="bg-primary rounded-circle p-3">
                      <i className="bi bi-people text-white fs-4"></i>
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
                      <h6 className="text-muted">Sessions</h6>
                      <h3 className="mb-0">{sessionDates.length}</h3>
                      <small className="text-muted">Total sessions</small>
                    </div>
                    <div className="bg-info rounded-circle p-3">
                      <i className="bi bi-calendar-week text-white fs-4"></i>
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
                      <h6 className="text-muted">Present Rate</h6>
                      <h3 className="mb-0">
                        {attendanceSummary.overallStats?.total > 0
                          ? Math.round(
                              ((attendanceSummary.overallStats.present +
                                attendanceSummary.overallStats.late * 0.5) /
                                (attendanceSummary.overallStats.total -
                                  attendanceSummary.overallStats.notMarked)) *
                                100
                            )
                          : 0}
                        %
                      </h3>
                      <small className="text-muted">Average attendance</small>
                    </div>
                    <div className="bg-success rounded-circle p-3">
                      <i className="bi bi-check-circle text-white fs-4"></i>
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
                      <h6 className="text-muted">Completion</h6>
                      <h3 className="mb-0">
                        {attendanceSummary.overallStats?.total > 0
                          ? Math.round(
                              ((attendanceSummary.overallStats.total -
                                attendanceSummary.overallStats.notMarked) /
                                attendanceSummary.overallStats.total) *
                                100
                            )
                          : 0}
                        %
                      </h3>
                      <small className="text-muted">Records filled</small>
                    </div>
                    <div className="bg-warning rounded-circle p-3">
                      <i className="bi bi-clipboard-check text-white fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Select Course</label>
                  <select
                    className="form-select"
                    value={selectedCourse}
                    onChange={(e) =>
                      this.handleCourseChange(parseInt(e.target.value))
                    }
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.code}) - {course.schedule}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">View Mode</label>
                  <div className="btn-group w-100">
                    <button
                      className={`btn ${
                        viewMode === "calendar"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => this.setState({ viewMode: "calendar" })}
                    >
                      <i className="bi bi-calendar me-2"></i> Calendar
                    </button>
                    <button
                      className={`btn ${
                        viewMode === "summary"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => this.setState({ viewMode: "summary" })}
                    >
                      <i className="bi bi-bar-chart me-2"></i> Summary
                    </button>
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Month</label>
                  <select
                    className="form-select"
                    value={this.state.selectedMonth}
                    onChange={(e) =>
                      this.handleMonthChange(parseInt(e.target.value))
                    }
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>
                        {month} 2023
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-success w-100"
                    onClick={this.handleSaveAttendance}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center me-4">
                        <div
                          className="bg-success rounded-circle me-2"
                          style={{ width: "12px", height: "12px" }}
                        ></div>
                        <small>Present</small>
                      </div>
                      <div className="d-flex align-items-center me-4">
                        <div
                          className="bg-danger rounded-circle me-2"
                          style={{ width: "12px", height: "12px" }}
                        ></div>
                        <small>Absent</small>
                      </div>
                      <div className="d-flex align-items-center me-4">
                        <div
                          className="bg-warning rounded-circle me-2"
                          style={{ width: "12px", height: "12px" }}
                        ></div>
                        <small>Late</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-secondary rounded-circle me-2"
                          style={{ width: "12px", height: "12px" }}
                        ></div>
                        <small>Not Marked</small>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={this.handleExportAttendance}
                      >
                        <i className="bi bi-download me-2"></i>
                        Export
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          this.setState({ showBulkAttendanceModal: true })
                        }
                      >
                        <i className="bi bi-check-all me-2"></i>
                        Bulk Mark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="alert alert-info mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">
                  {course?.name} ({course?.code})
                </h6>
                <small className="text-muted">
                  <i className="bi bi-calendar me-1"></i> Schedule:{" "}
                  {course?.schedule} |<i className="bi bi-people mx-1"></i>{" "}
                  Students: {courseStudents.length} |
                  <i className="bi bi-clock mx-1"></i> Total Sessions:{" "}
                  {course?.totalSessions}
                </small>
              </div>
              <span className="badge bg-primary">
                <i className="bi bi-info-circle me-1"></i>
                Click on attendance cells to mark status
              </span>
            </div>
          </div>

          {/* Attendance Table */}
          {viewMode === "calendar" ? (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover attendance-table">
                    <thead>
                      <tr>
                        <th style={{ width: "200px" }}>Student</th>
                        {sessionDates.map((date, index) => (
                          <th key={date} style={{ minWidth: "100px" }}>
                            <div className="text-center">
                              <div>Session {index + 1}</div>
                              <small className="text-muted">
                                {new Date(date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </small>
                            </div>
                          </th>
                        ))}
                        <th style={{ width: "100px" }}>Present</th>
                        <th style={{ width: "100px" }}>Absent</th>
                        <th style={{ width: "100px" }}>Late</th>
                        <th style={{ width: "120px" }}>Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseStudents.map((student) => {
                        const studentSummary =
                          attendanceSummary.attendanceByStudent?.[student.id] ||
                          {};

                        return (
                          <tr key={student.id}>
                            <td>
                              <div>
                                <strong>{student.name}</strong>
                                <div className="text-muted small">
                                  ID: {student.studentId}
                                </div>
                              </div>
                            </td>

                            {sessionDates.map((date) => {
                              const status =
                                attendanceStatus[student.id]?.[date] ||
                                "not_marked";

                              return (
                                <td key={date} className="text-center">
                                  <div
                                    className="attendance-cell"
                                    onClick={() => {
                                      const statuses = [
                                        "present",
                                        "absent",
                                        "late",
                                        "not_marked",
                                      ];
                                      const currentIndex =
                                        statuses.indexOf(status);
                                      const nextIndex =
                                        (currentIndex + 1) % statuses.length;
                                      this.handleStatusChange(
                                        student.id,
                                        date,
                                        statuses[nextIndex]
                                      );
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {this.getStatusBadge(status)}
                                  </div>
                                </td>
                              );
                            })}

                            <td className="text-center">
                              <span className="badge bg-success">
                                {studentSummary.present || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-danger">
                                {studentSummary.absent || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">
                                {studentSummary.late || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${this.getAttendancePercentageColor(
                                  studentSummary.percentage || 0
                                )}`}
                              >
                                <strong>
                                  {studentSummary.percentage || 0}%
                                </strong>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Summary View */
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Attendance Summary</h5>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th className="text-center">Present</th>
                        <th className="text-center">Absent</th>
                        <th className="text-center">Late</th>
                        <th className="text-center">Not Marked</th>
                        <th className="text-center">Attendance %</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseStudents.map((student) => {
                        const studentSummary =
                          attendanceSummary.attendanceByStudent?.[student.id] ||
                          {};

                        return (
                          <tr key={student.id}>
                            <td>
                              <div>
                                <strong>{student.name}</strong>
                                <div className="text-muted small">
                                  {student.email} | ID: {student.studentId}
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">
                                {studentSummary.present || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-danger">
                                {studentSummary.absent || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">
                                {studentSummary.late || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-secondary">
                                {studentSummary.notMarked || 0}
                              </span>
                            </td>
                            <td className="text-center">
                              <div
                                className="progress"
                                style={{ height: "20px" }}
                              >
                                <div
                                  className={`progress-bar ${this.getAttendancePercentageColor(
                                    studentSummary.percentage || 0
                                  ).replace("text-", "bg-")}`}
                                  style={{
                                    width: `${studentSummary.percentage || 0}%`,
                                  }}
                                  role="progressbar"
                                >
                                  {studentSummary.percentage || 0}%
                                </div>
                              </div>
                            </td>
                            <td>
                              {studentSummary.status === "good" ? (
                                <span className="badge bg-success">Good</span>
                              ) : studentSummary.status === "warning" ? (
                                <span className="badge bg-warning text-dark">
                                  Needs Attention
                                </span>
                              ) : (
                                <span className="badge bg-danger">Poor</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-eye"></i> View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Attendance Modal */}
          {showBulkAttendanceModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Bulk Attendance Marking</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        this.setState({ showBulkAttendanceModal: false })
                      }
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Select Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) =>
                          this.setState({ selectedDate: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Attendance Status for All Students
                      </label>
                      <select
                        className="form-select"
                        value={bulkStatus}
                        onChange={(e) =>
                          this.setState({ bulkStatus: e.target.value })
                        }
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="not_marked">Not Marked</option>
                      </select>
                    </div>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      This will mark attendance for{" "}
                      <strong>{courseStudents.length}</strong> students in{" "}
                      <strong>{course?.name}</strong> on{" "}
                      <strong>{selectedDate}</strong>.
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        this.setState({ showBulkAttendanceModal: false })
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        this.handleBulkStatusChange(selectedDate, bulkStatus)
                      }
                    >
                      <i className="bi bi-check-all me-2"></i>
                      Apply to All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-lightbulb text-warning me-2"></i>
                    Quick Tips
                  </h6>
                  <ul className="small">
                    <li>
                      Click on any attendance cell to cycle through statuses
                    </li>
                    <li>
                      Use "Bulk Mark" to mark attendance for all students at
                      once
                    </li>
                    <li>Switch between Calendar and Summary views</li>
                    <li>Export data for reporting or record-keeping</li>
                    <li>Save changes regularly to avoid data loss</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-graph-up text-primary me-2"></i>
                    Attendance Guidelines
                  </h6>
                  <div className="small">
                    <p>
                      <strong>Attendance Policy:</strong>
                    </p>
                    <ul>
                      <li>80%+ attendance: Good standing</li>
                      <li>60-79% attendance: Warning zone</li>
                      <li>
                        Below 60%: Poor attendance - intervention required
                      </li>
                    </ul>
                    <p className="mb-0">
                      <strong>Note:</strong> Late attendance counts as 50% of a
                      present mark.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop for modal */}
          {showBulkAttendanceModal && (
            <div className="modal-backdrop fade show"></div>
          )}
        </div>
      </div>
    );
  }
}

export default AttendancePage;
