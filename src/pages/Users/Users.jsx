import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import userAvatar from "../../assets/images/users/avatar-1.jpg";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";
import { User } from "lucide-react";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  document.title = "All Users | LMS Dashboard";

  // Helper function to get token
  const getToken = () => {
    const saved = localStorage.getItem("authUser");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return parsed?.token || null;
    } catch (error) {
      console.error("Error parsing auth user:", error);
      return null;
    }
  };

  // Check authentication status
  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      localStorage.removeItem("authUser");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Fetch users with retry mechanism
  const fetchUsers = async (retryCount = 0) => {
    const token = getToken();
    
    if (!token) {
      if (retryCount < 2) {
        // Wait and retry (useful right after login)
        setTimeout(() => fetchUsers(retryCount + 1), 500);
        return;
      }
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched users:", res.data);
      setUsers(res.data.users || []);
      setAuthChecked(true);
    } catch (err) {
      console.error("Fetch error:", err);
      
      // Handle unauthorized error
      if (err.response?.status === 401 || err.response?.status === 403) {
        if (retryCount < 2) {
          // Wait and retry (token might be being refreshed)
          setTimeout(() => fetchUsers(retryCount + 1), 1000);
          return;
        }
        // If still unauthorized after retries, redirect to login
        localStorage.removeItem("authUser");
        navigate("/login");
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Initialize on mount and when localStorage changes
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!checkAuth()) return;
      
      if (mounted) {
        await fetchUsers();
      }
    };

    initialize();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "authUser") {
        const newToken = getToken();
        if (!newToken && mounted) {
          navigate("/login");
        } else if (newToken && mounted) {
          fetchUsers();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      mounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only once on mount

  // Add a visibility change listener to refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && checkAuth()) {
        fetchUsers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // VIEW MODAL
  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  // EDIT MODAL
  const handleEdit = (user) => {
    console.log("Editing user:", user);
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "student",
      status: user.status || "Active",
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (id) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      console.log("Sending update data:", updateData);

      const res = await axios.put(
        `https://shekhai-server.onrender.com/api/v1/users/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update response:", res.data);

      if (res.data && res.data.user) {
        setUsers((prevUsers) => 
          prevUsers.map((user) => 
            user._id === id ? res.data.user : user
          )
        );
        toast.success("User updated successfully!");
      } else {
        setUsers((prevUsers) => 
          prevUsers.map((user) => 
            user._id === id ? { ...user, ...updateData } : user
          )
        );
        toast.success("User updated successfully!");
      }
      
      setEditModalOpen(false);
      
      // Refresh to ensure latest data
      fetchUsers();
      
    } catch (err) {
      console.error("Update error:", err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("authUser");
        navigate("/login");
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to update user");
      }
    }
  };

  // DELETE
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    toast.info(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="d-flex gap-2 mt-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(
                  `https://shekhai-server.onrender.com/api/v1/users/${id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                setUsers((prev) => prev.filter((user) => user._id !== id));
                toast.success("User deleted successfully!");
              } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                  localStorage.removeItem("authUser");
                  navigate("/login");
                  toast.error("Session expired. Please login again.");
                } else {
                  toast.error(err.response?.data?.message || "Failed to delete user");
                }
              }
            }}
          >
            Yes, Delete
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const filteredData = users.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase())
  );

  // Show loading spinner while checking auth and initial fetch
  if (initialLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <Spinner color="primary" style={{ width: "3rem", height: "3rem" }}>
                Loading...
              </Spinner>
              <p className="mt-3">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container-fluid">
        <Breadcrumbs title="Users" breadcrumbItem="All Users" />

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <input
              type="text"
              className="form-control"
              style={{ width: "280px" }}
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/users/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i> Add User
            </Link>
          </div>

          <div className="card-body pt-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner color="primary" style={{ width: "3rem", height: "3rem" }}>
                  Loading...
                </Spinner>
                <p className="mt-3">Loading users...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table bordered striped hover>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                                <User size={18} className="text-muted" />
                              </div>
                            )}
                          </td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>
                            {new Date(item.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            {new Date(item.updatedAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.role === "student"
                                  ? "bg-primary"
                                  : item.role === "admin"
                                  ? "bg-success"
                                  : "bg-info"
                              }`}
                            >
                              {item.role?.charAt(0).toUpperCase() + item.role?.slice(1) || "Student"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "Active" ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {item.status || "Active"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleView(item)}
                                title="View"
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                title="Edit"
                              >
                                <i className="mdi mdi-pencil"></i>
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(item._id)}
                                title="Delete"
                              >
                                <i className="mdi mdi-delete"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      <Modal
        isOpen={viewModalOpen}
        toggle={() => setViewModalOpen(!viewModalOpen)}
      >
        <ModalHeader toggle={() => setViewModalOpen(!viewModalOpen)}>
          User Profile
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div className="text-center">
              <img
                src={selectedUser.image || userAvatar}
                alt="User"
                className="rounded-circle mb-3"
                width={120}
                height={120}
                style={{ objectFit: "cover" }}
              />
              <h5>{selectedUser.name}</h5>
              <p className="text-muted">{selectedUser.email}</p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    selectedUser.status === "Active" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {selectedUser.status || "Active"}
                </span>
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModalOpen}
        toggle={() => setEditModalOpen(!editModalOpen)}
      >
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          Edit User
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="editName">Name</Label>
              <Input
                id="editName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="editRole">Role</Label>
              <Input
                id="editRole"
                type="select"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => handleUpdate(selectedUser?._id)}
          >
            Save Changes
          </Button>
          <Button color="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Users;