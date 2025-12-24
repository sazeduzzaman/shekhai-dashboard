import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import userAvatar from "../../assets/images/users/avatar-1.jpg";
import "react-toastify/dist/ReactToastify.css";

const AllInstructor = () => {
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "instructor",
    status: "Active",
  });

  document.title = "All Instructors | LMS Dashboard";

  const saved = localStorage.getItem("authUser");
  const parsed = saved ? JSON.parse(saved) : null;
  const token = parsed?.token;

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://shekhai-server-production.up.railway.app/api/v1/users?role=instructor",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const instructorData = res.data.users || res.data.data || [];
      setInstructors(instructorData);
    } catch (err) {
      toast.error("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("authUser");
      window.location.href = "/login";
      return;
    }
    fetchInstructors();
  }, []);

  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      role: "instructor",
      status: instructor.status || "Active",
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `https://shekhai-server-production.up.railway.app/api/v1/users/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Instructor updated!");
      setInstructors((prev) =>
        prev.map((i) => (i._id === id ? { ...i, ...formData } : i))
      );
      setEditModalOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      axios
        .delete(
          `https://shekhai-server-production.up.railway.app/api/v1/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setInstructors((prev) => prev.filter((i) => i._id !== id));
          toast.success("Instructor removed");
        })
        .catch(() => toast.error("Delete failed"));
    }
  };

  const filteredData = instructors.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <ToastContainer position="top-right" />
      <div className="container-fluid">
        <Breadcrumbs title="Management" breadcrumbItem="Instructors" />

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white pt-4 pb-3">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search instructors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-md-end mt-3 mt-md-0">
                    <Link
                      to="/instructors/add"
                      className="btn btn-primary px-4"
                    >
                      <i className="mdi mdi-plus-circle me-1"></i> Add
                      Instructor
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                    <p className="mt-2 text-muted">Loading...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>Instructor</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={userAvatar}
                                  className="rounded-circle avatar-xs me-2"
                                  alt=""
                                />
                                <span className="fw-medium">{item.name}</span>
                              </div>
                            </td>
                            <td>{item.email}</td>
                            <td>
                              <span
                                className={`badge rounded-pill ${
                                  item.status === "Active"
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {item.status || "Active"}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-info outline me-1"
                                onClick={() => {
                                  setSelectedInstructor(item);
                                  setViewModalOpen(true);
                                }}
                              >
                                <i className="mdi mdi-eye-outline"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-warning outline me-1"
                                onClick={() => handleEdit(item)}
                              >
                                <i className="mdi mdi-pencil-outline"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger outline"
                                onClick={() => handleDelete(item._id)}
                              >
                                <i className="mdi mdi-trash-can-outline"></i>
                              </button>
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
      </div>

      {/* --- PURE BOOTSTRAP VIEW MODAL --- */}
      {viewModalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Instructor Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body text-center pb-4">
                <img
                  src={userAvatar}
                  className="rounded-circle img-thumbnail avatar-xl mb-3"
                  alt=""
                />
                <h4 className="mb-1">{selectedInstructor?.name}</h4>
                <p className="text-muted mb-3">{selectedInstructor?.email}</p>
                <div className="d-flex justify-content-around bg-light p-3 rounded">
                  <div>
                    <small className="text-muted d-block">Role</small>
                    <strong>Instructor</strong>
                  </div>
                  <div>
                    <small className="text-muted d-block">Status</small>
                    <strong>{selectedInstructor?.status || "Active"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PURE BOOTSTRAP EDIT MODAL --- */}
      {editModalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Instructor</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  className="btn btn-light"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdate(selectedInstructor._id)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInstructor;
