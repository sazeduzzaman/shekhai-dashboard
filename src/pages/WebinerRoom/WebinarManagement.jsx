import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Button,
  Table,
  Badge,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api/v1";

const WebinarManagement = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch webinars from API
  const fetchWebinars = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching webinars from:", `${API_BASE_URL}/webinars`);
      const response = await fetch(`${API_BASE_URL}/webinars`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        setWebinars(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        throw new Error(result.message || "Failed to load webinars");
      }
    } catch (error) {
      console.error("Error fetching webinars:", error);
      setError(error.message);
      toast.error("Failed to load webinars");
      setWebinars([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle webinar deletion
  const handleDelete = async () => {
    if (!selectedWebinar) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/webinars/${selectedWebinar._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();
      console.log("Delete response:", result);

      if (response.ok && result.success) {
        toast.success("Webinar deleted successfully!");

        // Remove webinar from state
        setWebinars(
          webinars.filter((webinar) => webinar._id !== selectedWebinar._id),
        );

        // Update total count
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
        }));

        // Close modal
        setDeleteModal(false);
        setSelectedWebinar(null);
      } else {
        throw new Error(result.message || "Failed to delete webinar");
      }
    } catch (error) {
      console.error("Error deleting webinar:", error);
      toast.error(error.message || "Failed to delete webinar");
    } finally {
      setDeleting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (webinar) => {
    setSelectedWebinar(webinar);
    setDeleteModal(true);
  };

  // Navigate to edit page
  const handleEdit = (webinarId) => {
    navigate(`/webinar-management/edit/${webinarId}`);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      published: "success",
      draft: "secondary",
      scheduled: "warning",
      cancelled: "danger",
      completed: "info",
    };
    return colors[status] || "secondary";
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Format time only
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get registration status
  const getRegistrationStatus = (webinar) => {
    if (!webinar.registrationOpen) {
      return <Badge color="danger">Closed</Badge>;
    }

    const now = new Date();
    const startTime = new Date(webinar.startTime);
    const endTime = new Date(webinar.endTime);

    if (now < startTime) {
      return <Badge color="success">Open</Badge>;
    } else if (now >= startTime && now <= endTime) {
      return <Badge color="warning">Live</Badge>;
    } else {
      return <Badge color="secondary">Ended</Badge>;
    }
  };

  // Check if webinar is upcoming
  const isUpcoming = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return start > now;
  };

  // Check if webinar is live
  const isLive = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <div className="mb-3">
          <h4 className="mb-0">Webinar Management</h4>
          <p className="text-muted">Manage all webinars in the system</p>
        </div>

        {error && (
          <Alert color="danger" className="mb-3">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Webinar List</h5>
              <div className="d-flex gap-2">
                <Button
                  color="primary"
                  onClick={fetchWebinars}
                  className="btn-sm"
                >
                  <i className="mdi mdi-refresh me-1"></i>
                  Refresh
                </Button>
                <Link
                  className="btn btn-success btn-sm"
                  to="/webinar-management/create"
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Add Webinar
                </Link>
                <Link
                  className="btn btn-info btn-sm"
                  to="/webinar-management/register"
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Register Participants
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading webinars...</p>
              </div>
            ) : (
              <>
                {webinars.length === 0 ? (
                  <div className="text-center my-5 py-5">
                    <i className="ri-video-line display-4 text-muted"></i>
                    <h4 className="mt-3">No webinars found</h4>
                    <p className="text-muted">
                      There are no webinars in the system yet.
                    </p>
                    <Link
                      className="btn btn-primary mt-3"
                      to="/webinar-management/create"
                    >
                      <i className="mdi mdi-plus me-1"></i>
                      Create First Webinar
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>Instructor</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Registration</th>
                          <th>Participants</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webinars.map((webinar, index) => (
                          <tr key={webinar._id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                <strong>{webinar.title}</strong>
                                <div>
                                  <small className="text-muted">
                                    {webinar.shortDescription?.substring(0, 60)}
                                    ...
                                  </small>
                                </div>
                                {webinar.isFeatured && (
                                  <Badge color="warning" className="mt-1">
                                    Featured
                                  </Badge>
                                )}
                                {isLive(webinar.startTime, webinar.endTime) && (
                                  <Badge color="danger" className="ms-1 mt-1">
                                    Live Now
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{webinar.instructor?.name}</strong>
                                <br />
                                <small className="text-muted">
                                  {webinar.instructor?.title}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>
                                  {formatDateTime(webinar.startTime)}
                                </strong>
                                <br />
                                <small>to {formatTime(webinar.endTime)}</small>
                              </div>
                            </td>
                            <td>
                              <Badge color={getStatusColor(webinar.status)}>
                                {webinar.status}
                              </Badge>
                            </td>
                            <td>{getRegistrationStatus(webinar)}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span>{webinar.currentParticipants || 0}</span>
                                <span>/</span>
                                <span>{webinar.maxParticipants || "∞"}</span>
                                <div
                                  className="progress flex-grow-1"
                                  style={{ width: "80px", height: "6px" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${((webinar.currentParticipants || 0) / (webinar.maxParticipants || 1)) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              {webinar.isFree ? (
                                <Badge color="success">FREE</Badge>
                              ) : (
                                <strong>${webinar.price || 0}</strong>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => handleEdit(webinar._id)}
                                  title="Edit webinar"
                                >
                                  <i className="mdi mdi-pencil"></i> Edit
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => openDeleteModal(webinar)}
                                  title="Delete webinar"
                                >
                                  <i className="mdi mdi-delete"></i> Delete
                                </Button>
                                <Link
                                  to={`/webinars/${webinar._id}`}
                                  className="btn btn-primary btn-sm"
                                  title="View webinar details"
                                >
                                  <i className="mdi mdi-eye"></i> View
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                {webinars.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted">
                      <i className="ri-information-line me-1"></i>
                      Showing {webinars.length} webinar
                      {webinars.length !== 1 ? "s" : ""} of {pagination.total}
                    </div>
                    <div className="text-muted">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          {selectedWebinar && (
            <div>
              <p>
                Are you sure you want to delete the webinar{" "}
                <strong>{selectedWebinar.title}</strong>?
              </p>
              <p className="text-danger">
                <i className="ri-alert-line me-1"></i>
                This action cannot be undone. All associated data will be
                permanently deleted.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              setDeleteModal(false);
              setSelectedWebinar(null);
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deleting...
              </>
            ) : (
              "Delete Webinar"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default WebinarManagement;
