// components/PendingReviews.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "react-feather";

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "warning";
    case "needs-revision": return "info";
    case "approved": return "success";
    case "rejected": return "danger";
    default: return "secondary";
  }
};

const PendingReviews = ({ reviews }) => {
  const reviewData = reviews || [
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
  ];

  return (
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
              {reviewData.map((review) => (
                <tr key={review.id}>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: "100px" }}>
                      {review.course}
                    </div>
                  </td>
                  <td>{review.instructor}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(review.status)}`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/reviews/${review.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <Eye size={12} />
                    </Link>
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
  );
};

export default PendingReviews;