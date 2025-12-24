import React, { useState } from "react";
import { Github } from "react-bootstrap-icons";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Code,
  ExternalLink,
  FileText,
} from "react-feather";

const Assignments = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const assignments = [
    {
      id: 1,
      title: "Operating Systems - Kernel Sync",
      subject: "Computer Science",
      dueDate: "Dec 30, 2025",
      status: "pending",
      description:
        "Implementing mutex locks and semaphores for thread synchronization in a simulated environment.",
      priority: "High",
    },
    {
      id: 2,
      title: "E-Commerce Database Schema",
      subject: "Database Management",
      dueDate: "Jan 05, 2026",
      status: "pending",
      description:
        "Designing a normalized (3NF) database schema for a multi-vendor retail platform.",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Portfolio Website v1",
      subject: "Web Development",
      submittedDate: "Dec 20, 2025",
      status: "submitted",
      grade: "A+",
      github: "https://github.com",
      demo: "https://demo.com",
      description:
        "A fully responsive personal portfolio built with React and Bootstrap 5.",
    },
  ];

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter(
    (a) => a.status === "submitted"
  );

  return (
    <div className="container py-5 min-vh-100 mt-5 pt-5">
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="fw-bold text-dark display-6">Assignment Dashboard</h1>
          <p className="text-muted">
            Manage your upcoming deadlines and track your academic progress.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 shadow-sm d-inline-flex border">
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${
              activeTab === "pending" ? "active shadow-sm" : "text-secondary"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending{" "}
            <span className="ms-2 badge bg-danger-soft text-danger">
              {pendingAssignments.length}
            </span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${
              activeTab === "submitted" ? "active shadow-sm" : "text-secondary"
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            Submitted{" "}
            <span className="ms-2 badge bg-success-soft text-success">
              {submittedAssignments.length}
            </span>
          </button>
        </li>
      </ul>

      {/* Content Section */}
      <div className="tab-content">
        {activeTab === "pending" ? (
          <div className="row g-4">
            {pendingAssignments.map((task) => (
              <div key={task.id} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm border-start border-danger border-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-light text-dark border">
                        {task.subject}
                      </span>
                      <span
                        className={`small fw-bold ${
                          task.priority === "High"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                      >
                        <AlertCircle size={14} className="me-1" />{" "}
                        {task.priority} Priority
                      </span>
                    </div>
                    <h5 className="fw-bold mb-2">{task.title}</h5>
                    <p className="text-muted small mb-4">{task.description}</p>
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
                      <div className="small text-secondary">
                        <Calendar size={14} className="me-2 text-danger" />
                        Due: <strong>{task.dueDate}</strong>
                      </div>
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        Submit Now <ArrowRight size={14} className="ms-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {submittedAssignments.map((task) => (
              <div key={task.id} className="col-12">
                <div className="card border-0 shadow-sm border-start border-success border-4">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center mb-2">
                          <CheckCircle
                            size={18}
                            className="text-success me-2"
                          />
                          <h5 className="fw-bold mb-0">{task.title}</h5>
                        </div>
                        <p className="text-muted small mb-3">
                          {task.description}
                        </p>
                        <div className="d-flex gap-3">
                          <a
                            href={task.github}
                            className="text-decoration-none small text-dark d-flex align-items-center"
                          >
                            <Github size={14} className="me-1" /> Github
                          </a>
                          <a
                            href={task.demo}
                            className="text-decoration-none small text-primary d-flex align-items-center"
                          >
                            <ExternalLink size={14} className="me-1" /> View
                            Demo
                          </a>
                        </div>
                      </div>
                      <div className="col-md-4 text-md-end mt-3 mt-md-0 border-start ps-4">
                        <div className="h4 fw-bold text-success mb-0">
                          {task.grade}
                        </div>
                        <div className="small text-muted">
                          Submitted on {task.submittedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .nav-pills .nav-link.active {
          background-color: #fff;
          color: #0d6efd;
          font-weight: 600;
        }
        .bg-danger-soft { background-color: #fee2e2; }
        .bg-success-soft { background-color: #dcfce7; }
        .bg-primary-soft { background-color: #eff6ff; }
        .nav-pills .nav-link:not(.active):hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default Assignments;
