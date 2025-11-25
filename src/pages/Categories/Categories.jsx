import { useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const Categories = () => {
  const initialData = [
    {
      id: 1,
      courseName: "React for Beginners",
      instructor: "John Doe",
      category: "Web Development",
      students: 320,
      createdAt: "2024/04/12",
      status: "Active",
    },
    {
      id: 2,
      courseName: "Advanced JavaScript",
      instructor: "Sarah Lee",
      category: "Programming",
      students: 210,
      createdAt: "2024/01/28",
      status: "Active",
    },
    {
      id: 3,
      courseName: "UI/UX Complete Bootcamp",
      instructor: "Michael Smith",
      category: "Design",
      students: 150,
      createdAt: "2023/12/18",
      status: "Inactive",
    },
    {
      id: 4,
      courseName: "Node.js & Express Mastery",
      instructor: "Emily Johnson",
      category: "Backend Development",
      students: 280,
      createdAt: "2024/02/10",
      status: "Active",
    },
  ];

  document.title = "Categories | LMS Dashboard";

  const [search, setSearch] = useState("");

  const filteredData = initialData.filter((item) =>
    item.courseName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <Breadcrumbs title="Courses" breadcrumbItem="All Categories" />
        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            {/* Search Box */}
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Add Category Button */}
            <Link to="/categories/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i>
              Add Category
            </Link>
          </div>
          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Course Name</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Enrolled</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th style={{ width: "130px" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.courseName}</td>
                      <td>{item.instructor}</td>
                      <td>{item.category}</td>
                      <td>{item.students}</td>
                      <td>{item.createdAt}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            item.status === "Active" ? "success" : "danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
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

export default Categories;
