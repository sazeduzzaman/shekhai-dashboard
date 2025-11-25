import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const Students = () => {
  const initialData = [
    {
      id: "stu001",
      name: "Alice Smith",
      email: "alice@example.com",
      enrolledCourses: 3,
      totalProgress: "75%", // optional
      status: "Active",
    },
    {
      id: "stu002",
      name: "Bob Johnson",
      email: "bob@example.com",
      enrolledCourses: 2,
      totalProgress: "50%",
      status: "Active",
    },
    {
      id: "stu003",
      name: "Charlie Lee",
      email: "charlie@example.com",
      enrolledCourses: 1,
      totalProgress: "20%",
      status: "Inactive",
    },
    {
      id: "stu004",
      name: "Diana King",
      email: "diana@example.com",
      enrolledCourses: 4,
      totalProgress: "90%",
      status: "Active",
    },
    {
      id: "stu005",
      name: "Ethan Brown",
      email: "ethan@example.com",
      enrolledCourses: 2,
      totalProgress: "60%",
      status: "Active",
    },
  ];

  document.title = "Students | LMS Dashboard";

  const [search, setSearch] = useState("");

  const filteredData = initialData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Students" breadcrumbItem="All Students" />

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link to="/students/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i>
              Add Student
            </Link>
          </div>

          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrolled Courses</th>
                    <th>Total Progress</th>
                    <th>Status</th>
                    <th style={{ width: "130px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.enrolledCourses}</td>
                      <td>{item.totalProgress}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            item.status === "Active" ? "success" : "danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary">
                            <i className="mdi mdi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-warning">
                            <i className="mdi mdi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="mdi mdi-delete"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <p className="text-center mt-3">No students found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
