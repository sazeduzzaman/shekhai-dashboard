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
  Spinner,
  UncontrolledTooltip,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
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
  const [deletingId, setDeletingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
      console.log(
        "Fetching users with token:",
        token ? "Token exists" : "No token",
      );

      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/users",
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 second timeout
        },
      );

      console.log("API Response:", res);
      console.log("Response data:", res.data);

      // Handle the data structure returned by your API
      const usersData = res.data.users || res.data.data || [];
      setUsers(usersData);

      // Calculate total pages
      setTotalPages(Math.ceil(usersData.length / itemsPerPage));
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch error details:", err);

      if (err.code === "ECONNABORTED") {
        toast.error("Request timeout - please check your connection");
      } else if (err.response) {
        // The request was made and the server responded with a status code
        console.log("Error response:", err.response);
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);

        if (err.response.status === 401) {
          toast.error("Unauthorized - please login again");
          localStorage.removeItem("authUser");
          navigate("/login");
        } else if (err.response.status === 403) {
          toast.error("Access forbidden");
        } else if (err.response.status === 404) {
          toast.error("API endpoint not found");
        } else {
          toast.error(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.log("No response received:", err.request);
        toast.error(
          "No response from server - please check if the server is running",
        );
      } else {
        // Something happened in setting up the request
        toast.error(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick update for Role (via Select Box in Table)
  const handleInlineRoleUpdate = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await axios.put(
        `https://shekhai-server.onrender.com/api/v1/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
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
        `https://shekhai-server.onrender.com/api/v1/users/${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, ...formData } : u,
        ),
      );
      toast.success("User updated successfully!");
      toggleEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  // Delete functionality
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeletingId(selectedUser._id);
    try {
      await axios.delete(
        `https://shekhai-server.onrender.com/api/v1/users/${selectedUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Remove user from list
      const updatedUsers = users.filter((u) => u._id !== selectedUser._id);
      setUsers(updatedUsers);

      // Recalculate total pages
      setTotalPages(Math.ceil(updatedUsers.length / itemsPerPage));

      // Adjust current page if necessary
      if (currentPage > Math.ceil(updatedUsers.length / itemsPerPage)) {
        setCurrentPage(
          Math.max(1, Math.ceil(updatedUsers.length / itemsPerPage)),
        );
      }

      toast.success("User deleted successfully!");
      toggleDeleteModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter data based on search
  const filteredData = users.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination logic
  useEffect(() => {
    // Update total pages when filtered data changes
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page on new search
  }, [search, filteredData.length, itemsPerPage]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    document
      .querySelector(".table-responsive")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of visible page buttons

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);

      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) pageNumbers.push("...");
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
              <>
                <div className="table-responsive">
                  <Table hover striped className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>User Image</th>
                        <th>User Details</th>
                        <th>Role Management</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((user, index) => (
                          <tr key={user._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt="User"
                                  className="rounded-circle avatar-sm"
                                />
                              ) : (
                                <div className="bg-light rounded-circle avatar-sm d-flex align-items-center justify-content-center">
                                  <i className="mdi mdi-account text-muted"></i>
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="fw-bold">{user.name}</div>
                              <div className="text-muted small">
                                {user.email}
                              </div>
                            </td>
                            <td style={{ width: "220px" }}>
                              <div className="d-flex align-items-center">
                                <Input
                                  type="select"
                                  className="form-select-sm"
                                  value={user.role}
                                  disabled={updatingId === user._id}
                                  onChange={(e) =>
                                    handleInlineRoleUpdate(
                                      user._id,
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="student">Student</option>
                                  <option value="instructor">Instructor</option>
                                  <option value="admin">Admin</option>
                                </Input>
                                {updatingId === user._id && (
                                  <Spinner
                                    size="sm"
                                    color="primary"
                                    className="ms-2"
                                  />
                                )}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`badge bg-${user.status === "Active" ? "success" : "warning"}`}
                              >
                                {user.status || "Active"}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-2 justify-content-center">
                                {/* Edit Button */}
                                <Button
                                  color="soft-info"
                                  size="sm"
                                  onClick={() => handleEditClick(user)}
                                  id={`edit-${user._id}`}
                                >
                                  <i className="mdi mdi-pencil font-size-14"></i>
                                </Button>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`edit-${user._id}`}
                                >
                                  Edit User
                                </UncontrolledTooltip>

                                {/* Delete Button */}
                                <Button
                                  color="soft-danger"
                                  size="sm"
                                  onClick={() => handleDeleteClick(user)}
                                  disabled={deletingId === user._id}
                                  id={`delete-${user._id}`}
                                >
                                  {deletingId === user._id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <i className="mdi mdi-delete font-size-14"></i>
                                  )}
                                </Button>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`delete-${user._id}`}
                                >
                                  Delete User
                                </UncontrolledTooltip>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                  <Row className="mt-4">
                    <Col sm="12" md="6" className="d-flex align-items-center">
                      <div className="text-muted">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                        {filteredData.length} entries
                      </div>
                    </Col>
                    <Col sm="12" md="6">
                      <Pagination className="pagination justify-content-end mb-0">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={handlePreviousPage}
                          />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                          <PaginationItem
                            key={index}
                            active={currentPage === page}
                            disabled={page === "..."}
                          >
                            {page === "..." ? (
                              <PaginationLink disabled>...</PaginationLink>
                            ) : (
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink next onClick={handleNextPage} />
                        </PaginationItem>
                      </Pagination>
                    </Col>
                  </Row>
                )}

                {/* Items per page selector - optional */}
                {filteredData.length > 0 && (
                  <Row className="mt-3">
                    <Col sm="12">
                      <div className="text-muted small text-end">
                        Page {currentPage} of {totalPages}
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>
          Update User Permissions
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Input
                type="select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div>
              <p className="mb-3">
                Are you sure you want to delete the following user?
              </p>
              <div className="bg-light p-3 rounded">
                <p className="mb-1">
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="mb-0">
                  <strong>Role:</strong> {selectedUser.role}
                </p>
              </div>
              <p className="text-danger mt-3 mb-0">
                <i className="mdi mdi-alert-circle me-1"></i>
                This action cannot be undone. All data associated with this user
                will be permanently removed.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={handleDelete}
            disabled={deletingId === selectedUser?._id}
          >
            {deletingId === selectedUser?._id ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Yes, Delete User"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RolePermissions;
