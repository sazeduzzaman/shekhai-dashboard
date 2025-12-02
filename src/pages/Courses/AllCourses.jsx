import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const AllCourses = () => {
  document.title = "Courses | LMS Dashboard";

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ⛔ Replace this with your auth system
  const authUser = JSON.parse(localStorage.getItem("authUser")); 
  const token = authUser?.token;
  const userRole = authUser?.role; // "admin" or "instructor"
  const userId = authUser?._id;

  // ----------------------------
  // ⭐ Fetch Courses from API
  // ----------------------------
  const fetchCourses = async () => {
    try {
      const res = await fetch(
        "https://shekhai-server.up.railway.app/api/v1/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        let filtered = data.courses;

        // ⭐ Role-based filtering
        if (userRole === "instructor") {
          filtered = filtered.filter(
            (c) => c.instructor?._id === userId
          );
        }

        setCourses(filtered);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ----------------------------
  // ⭐ Delete Course
  // ----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(
        `https://shekhai-server.up.railway.app/api/v1/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        alert("Course deleted successfully!");
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ----------------------------
  // ⭐ Search Filter
  // ----------------------------
  const filteredData = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Courses" breadcrumbItem="All Courses" />

        {/* Header */}
        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {(userRole === "admin" || userRole === "instructor") && (
              <Link to="/courses/add" className="btn btn-success">
                <i className="mdi mdi-plus me-1"></i>
                Add Course
              </Link>
            )}
          </div>

          {/* Table */}
          <div className="card-body pt-0">
            {loading ? (
              <p className="text-center mt-3">Loading...</p>
            ) : filteredData.length === 0 ? (
              <p className="text-center mt-3">No courses found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Course Name</th>
                      <th>Instructor</th>
                      <th>Level</th>
                      <th>Total Modules</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.instructor?.name || "N/A"}</td>
                        <td>{item.level}</td>
                        <td>{item.totalModules}</td>
                        <td>{item.createdAt?.split("T")[0]}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              item.published ? "success" : "danger"
                            }`}
                          >
                            {item.published ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/courses/view/${item._id}`}
                              className="btn btn-sm btn-primary"
                            >
                              <i className="mdi mdi-eye"></i>
                            </Link>

                            <Link
                              to={`/courses/edit/${item._id}`}
                              className="btn btn-sm btn-warning"
                            >
                              <i className="mdi mdi-pencil"></i>
                            </Link>

                            {(userRole === "admin" ||
                              item.instructor?._id === userId) && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(item._id)}
                              >
                                <i className="mdi mdi-delete"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
