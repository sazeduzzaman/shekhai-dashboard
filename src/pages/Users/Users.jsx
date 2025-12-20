import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import userAvatar from "../../assets/images/users/avatar-1.jpg";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";

const Users = () => {
  const [instructors, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  document.title = "All Users | LMS Dashboard";

  const saved = localStorage.getItem("authUser");
  const parsed = saved ? JSON.parse(saved) : null;
  const token = parsed?.token;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://shekhai-server-production.up.railway.app/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err)
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
    fetchUsers();
  }, []);

  // -----------------
  // VIEW MODAL
  // -----------------
  const handleView = (user) => {
    setSelectedInstructor(user);
    setViewModalOpen(true);
  };

  // -----------------
  // EDIT MODAL
  // -----------------
  const handleEdit = (user) => {
    setSelectedInstructor(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "Active",
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `https://shekhai-server-production.up.railway.app/api/v1/users/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Instructor updated successfully!");
      // Update local state
      setUsers((prev) =>
        prev.map((i) => (i._id === id ? res.data.user : i))
      );
      setEditModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update instructor");
    }
  };

  // -----------------
  // DELETE
  // -----------------
  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="d-flex gap-2 mt-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(`https://shekhai-server-production.up.railway.app/api/v1/users/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setUsers((prev) => prev.filter((i) => i._id !== id));
                toast.success("User deleted successfully!");
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to delete User"
                );
              }
            }}
          >
            Yes
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const filteredData = instructors.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <ToastContainer position="top-right" />
      <div className="container-fluid">
        <Breadcrumbs title="Instructors" breadcrumbItem="All Users" />

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <input
              type="text"
              className="form-control"
              style={{ width: "280px" }}
              placeholder="Search instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/users/add" className="btn btn-success">
              <i className="mdi mdi-plus me-1"></i> Add Instructor
            </Link>
          </div>

          <div className="card-body pt-0">
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p className="mt-2">Loading instructors...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table bordered striped>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ width: "160px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No data found.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.role === "student"
                                  ? "bg-primary"
                                  : item.role === "admin"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${
                                item.status === "Active" ? "success" : "danger"
                              }`}
                            >
                              {item.status || "Active"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleView(item)}
                              >
                                <i className="mdi mdi-eye"></i>
                              </Button>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <i className="mdi mdi-pencil"></i>
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDelete(item._id)}
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
      <Modal isOpen={viewModalOpen} toggle={() => setViewModalOpen(!viewModalOpen)}>
        <ModalHeader toggle={() => setViewModalOpen(!viewModalOpen)}>
          Instructor Profile
        </ModalHeader>
        <ModalBody>
          {selectedInstructor && (
            <div className="text-center">
              <img
                src={userAvatar}
                alt="Instructor"
                className="rounded-circle mb-3"
                width={120}
                height={120}
              />
              <h5>{selectedInstructor.name}</h5>
              <p>{selectedInstructor.email}</p>
              <p>Role: {selectedInstructor.role}</p>
              <span
                className={`badge bg-${
                  selectedInstructor.status === "Active" ? "success" : "danger"
                }`}
              >
                {selectedInstructor.status || "Active"}
              </span>
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
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(!editModalOpen)}>
        <ModalHeader toggle={() => setEditModalOpen(!editModalOpen)}>
          Edit Instructor
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Input type="select" name="role" value={formData.role} onChange={handleFormChange}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => handleUpdate(selectedInstructor._id)}>
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
