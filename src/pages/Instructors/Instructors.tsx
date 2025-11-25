import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const Instructors = () => {
  const initialData = [
    {
      id: "691d4064aa68a720909c8be3",
      name: "Bosses",
      email: "bosses@example.com",
      role: "Instructor",
      totalCourses: 1,
      totalStudents: 0,
      status: "Active",
    },
    {
      id: "691d4064aa68a720909c8be4",
      name: "John Doe",
      email: "john@example.com",
      role: "Instructor",
      totalCourses: 2,
      totalStudents: 540,
      status: "Active",
    },
    {
      id: "691d4064aa68a720909c8be5",
      name: "Sarah Lee",
      email: "sarah@example.com",
      role: "Instructor",
      totalCourses: 1,
      totalStudents: 210,
      status: "Active",
    },
    {
      id: "691d4064aa68a720909c8be6",
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "Instructor",
      totalCourses: 1,
      totalStudents: 280,
      status: "Active",
    },
    {
      id: "691d4064aa68a720909c8be7",
      name: "Alex Brown",
      email: "alex@example.com",
      role: "Instructor",
      totalCourses: 1,
      totalStudents: 470,
      status: "Inactive",
    },
  ];

  document.title = "Instructors | LMS Dashboard";

  const [search, setSearch] = useState("");

  const filteredData = initialData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Instructors" breadcrumbItem="All Instructors" />

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link to="/instructor/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i>
              Add Instructor
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
                    <th>Role</th>
                    <th>Total Courses</th>
                    <th>Total Students</th>
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
                      <td>{item.role}</td>
                      <td>{item.totalCourses}</td>
                      <td>{item.totalStudents}</td>
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
                <p className="text-center mt-3">No results found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructors;
