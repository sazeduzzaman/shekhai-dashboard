import React, { useState, useEffect } from "react";
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
import "react-toastify/dist/ReactToastify.css";

const RolePermissions = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  document.title = "Role Permissions | LMS Dashboard";

  // Auth logic matching your snippet
  const saved = localStorage.getItem("authUser");
  const parsed = saved ? JSON.parse(saved) : null;
  const token = parsed?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("authUser");
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://shekhai-server-production.up.railway.app/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle the data structure returned by your API
      setUsers(res.data.users || res.data.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Quick update for Role (via Select Box in Table)
  const handleInlineRoleUpdate = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await axios.put(
        `https://shekhai-server-production.up.railway.app/api/v1/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      toast.success("Role updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // Full Edit Modal Logic
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "Active",
    });
    toggleEditModal();
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://shekhai-server-production.up.railway.app/api/v1/users/${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsers((prev) =>
        prev.map((u) => (u._id === selectedUser._id ? { ...u, ...formData } : u))
      );
      toast.success("User updated successfully!");
      toggleEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const filteredData = users.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <ToastContainer position="top-right" />
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Role & Permissions" />

        <div className="card mb-3 shadow-none border">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white border-bottom">
            <div className="search-box">
              <Input
                type="text"
                className="form-control"
                style={{ width: "300px" }}
                placeholder="Search name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button color="primary" onClick={fetchUsers} disabled={loading}>
              <i className="mdi mdi-refresh me-1"></i> Refresh List
            </Button>
          </div>

          <div className="card-body pt-3">
            {loading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="mt-2 text-muted">Loading user database...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover striped className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User Details</th>
                      <th>Role Management</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No users found.</td>
                      </tr>
                    ) : (
                      filteredData.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="fw-bold">{user.name}</div>
                            <div className="text-muted small">{user.email}</div>
                          </td>
                          <td style={{ width: "220px" }}>
                            <div className="d-flex align-items-center">
                              <Input
                                type="select"
                                className="form-select-sm"
                                value={user.role}
                                disabled={updatingId === user._id}
                                onChange={(e) => handleInlineRoleUpdate(user._id, e.target.value)}
                              >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Admin</option>
                              </Input>
                              {updatingId === user._id && <Spinner size="sm" color="primary" className="ms-2" />}
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${user.status === "Active" ? "success" : "warning"}`}>
                              {user.status || "Active"}
                            </span>
                          </td>
                          <td className="text-center">
                            <Button color="soft-info" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                              <i className="mdi mdi-pencil font-size-14"></i> Edit
                            </Button>
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

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Update User Permissions</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Input
                type="select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Account Status</Label>
              <Input
                type="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
          <Button color="primary" onClick={handleUpdate}>Save Changes</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RolePermissions;