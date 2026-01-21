// components/CourseCategories.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "react-feather";

const CourseCategories = ({ categories }) => {
  const categoryData = categories || [
    { category: "Technology", courses: 18, color: "primary" },
    { category: "Business", courses: 12, color: "success" },
    { category: "Design", courses: 8, color: "warning" },
    { category: "Science", courses: 6, color: "info" },
    { category: "Arts", courses: 4, color: "danger" },
  ];

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold">Course Categories Distribution</h6>
        <Link to="/admin/courses" className="btn btn-sm btn-link">
          View All
        </Link>
      </div>
      <div className="card-body">
        <div className="row">
          {categoryData.map((cat, index) => (
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
  );
};

export default CourseCategories;