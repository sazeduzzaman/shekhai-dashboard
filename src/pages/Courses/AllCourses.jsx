import { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

const AllCourses = () => {
  document.title = "Courses | LMS Dashboard";

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // --------- AUTH ----------
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const token = authUser?.token;
  const userRole = authUser?.user?.role; // "admin" or "instructor"
  const userId = authUser?.user?._id;
  const userEmail = authUser?.user?.email;

  console.log("Auth User Data:", {
    role: userRole,
    userId: userId,
    userEmail: userEmail,
    token: token ? "Exists" : "Missing"
  });

  // --------- FETCH COURSES ----------
  const fetchCourses = async () => {
    try {
      const res = await fetch(
        "https://shekhai-server-production.up.railway.app/api/v1/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await res.json();
      console.log("API Response:", data);

      if (data.success && Array.isArray(data.courses)) {
        console.log("Total courses fetched:", data.courses.length);
        
        // Filter courses based on user role
        let filteredCourses = data.courses;
        
        if (userRole === "instructor") {
          console.log("Filtering courses for instructor...");
          
          // Multiple ways to filter - check ID, email, or name
          filteredCourses = data.courses.filter(course => {
            const instructor = course.instructor;
            
            console.log("Checking course:", {
              courseTitle: course.title,
              courseInstructorId: instructor?._id,
              courseInstructorEmail: instructor?.email,
              courseInstructorName: instructor?.name,
              userId: userId,
              userEmail: userEmail
            });
            
            // Check if instructor exists and matches current user
            if (!instructor) return false;
            
            // Try matching by ID first (most reliable)
            if (instructor._id && userId && instructor._id === userId) {
              console.log("Matched by ID");
              return true;
            }
            
            // Try matching by email
            if (instructor.email && userEmail && instructor.email === userEmail) {
              console.log("Matched by email");
              return true;
            }
            
            // Try matching by name (least reliable but as fallback)
            const userName = authUser?.user?.name;
            if (instructor.name && userName && instructor.name === userName) {
              console.log("Matched by name");
              return true;
            }
            
            return false;
          });
          
          console.log("Filtered courses count:", filteredCourses.length);
        }
        
        setCourses(filteredCourses);
      } else {
        console.error("Invalid API response:", data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
    } else {
      console.error("No token found in localStorage");
      setLoading(false);
    }
  }, [token]);

  // --------- DELETE COURSE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(
        `https://shekhai-server-production.up.railway.app/api/v1/courses/${id}`,
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
      alert("Error deleting course.");
    }
  };

  // --------- SEARCH FILTER ----------
  const filteredData = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Courses" breadcrumbItem="All Courses" />

        {/* Debug Panel - Remove in production */}
        <div className="alert alert-info mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>User Info:</strong> 
              <span className="ms-2 badge bg-primary">{userRole || "Unknown"}</span>
              <span className="ms-2">ID: {userId?.substring(0, 8) || "N/A"}...</span>
              <span className="ms-2">Email: {userEmail || "N/A"}</span>
            </div>
            <div>
              <strong>Courses:</strong> 
              <span className="ms-2 badge bg-success">{courses.length} total</span>
              <span className="ms-2 badge bg-warning">{filteredData.length} filtered</span>
            </div>
          </div>
        </div>

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            {/* Search */}
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Link to="/courses/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i>
              Add Course
            </Link>
          </div>

          <div className="card-body pt-0">
            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading courses...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center mt-5 py-5">
                <div className="mb-3">
                  <i className="mdi mdi-book-remove-outline display-4 text-muted"></i>
                </div>
                <h4>No courses found</h4>
                <p className="text-muted mb-4">
                  {userRole === "instructor" 
                    ? "You haven't created any courses yet. Create your first course to get started."
                    : "No courses available in the system."}
                </p>
                {userRole === "instructor" && (
                  <Link to="/courses/add" className="btn btn-primary">
                    <i className="mdi mdi-plus me-1"></i>
                    Create Your First Course
                  </Link>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Banner</th>
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
                    {filteredData.map((item, index) => {
                      const isMyCourse = userRole === "instructor" && 
                        (item.instructor?._id === userId || 
                         item.instructor?.email === userEmail);
                      
                      return (
                        <tr key={item._id} className={isMyCourse ? "table-active" : ""}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              className="img-fluid rounded"
                              style={{ width: "150px", height: "100px", objectFit: "cover" }}
                              src={item.bannerUrl || "https://via.placeholder.com/150x100?text=No+Banner"}
                              alt={item.title}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150x100?text=No+Banner";
                              }}
                            />
                          </td>
                          <td>
                            <strong>{item.title}</strong>
                            {item.shortDescription && (
                              <p className="text-muted mb-0 small" style={{ maxWidth: "300px" }}>
                                {item.shortDescription.substring(0, 80)}...
                              </p>
                            )}
                          </td>
                          <td>
                            <div>
                              <strong>{item.instructor?.name || "N/A"}</strong>
                              <br />
                              <small className="text-muted">{item.instructor?.email}</small>
                              {isMyCourse && (
                                <span className="badge bg-info ms-2">You</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${item.level === 'Advanced' ? 'danger' : item.level === 'Intermediate' ? 'warning' : 'success'}`}>
                              {item.level}
                            </span>
                          </td>
                          <td>{item.totalModules || item.modules?.length || 0}</td>
                          <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td>
                            <span
                              className={`badge bg-${item.published ? "success" : "danger"}`}
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
                                title="View"
                              >
                                <i className="mdi mdi-eye"></i>
                              </Link>

                              {/* Edit Button */}
                              {(userRole === "admin" || isMyCourse) && (
                                <Link
                                  to={`/courses/edit/${item._id}`}
                                  className="btn btn-sm btn-warning"
                                  title="Edit"
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                              )}

                              {/* Delete Button */}
                              {(userRole === "admin" || isMyCourse) && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(item._id)}
                                  title="Delete"
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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