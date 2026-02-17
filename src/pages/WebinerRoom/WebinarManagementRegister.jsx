import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Alert,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://shekhai-server.onrender.com/api/v1";

const WebinarManagementRegister = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [webinarDropdownOpen, setWebinarDropdownOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const navigate = useNavigate();

  // Fetch all webinars (without status=all since it's not working)
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
      console.log("Webinars API Response:", result);

      if (result.success) {
        const webinarsData = result.data || [];
        console.log("Webinars data:", webinarsData);
        setWebinars(webinarsData);

        // Select first webinar by default
        if (webinarsData.length > 0 && !selectedWebinar) {
          const firstWebinar = webinarsData[0];
          console.log("Selecting first webinar:", firstWebinar);
          setSelectedWebinar(firstWebinar);
          fetchRegistrations(firstWebinar._id);
        } else if (selectedWebinar) {
          // Refresh registrations for already selected webinar
          fetchRegistrations(selectedWebinar._id);
        }
      } else {
        throw new Error(result.message || "Failed to load webinars");
      }
    } catch (error) {
      console.error("Error fetching webinars:", error);
      setError(error.message);
      toast.error("Failed to load webinars");
    } finally {
      setLoading(false);
    }
  };

  // Fetch registrations for a webinar
  const fetchRegistrations = async (webinarId, page = 1) => {
    if (!webinarId) {
      console.error("No webinar ID provided");
      toast.error("No webinar selected");
      return;
    }

    setRegLoading(true);
    setError(null);

    try {
      console.log("Fetching registrations for webinar:", webinarId);
      const url = `${API_BASE_URL}/webinars/${webinarId}/registrations?page=${page}&limit=${pagination.limit}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
      console.log("Registration API URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error("Registration API error status:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Registrations API response:", result);

      if (result.success) {
        const registrationsData = result.data || [];
        console.log("Registrations data:", registrationsData);
        setRegistrations(registrationsData);

        if (result.pagination) {
          setPagination(result.pagination);
        } else {
          // If no pagination in response, create default
          setPagination({
            page: 1,
            limit: pagination.limit,
            total: registrationsData.length,
            pages: 1,
          });
        }

        toast.success(`Loaded ${registrationsData.length} registration(s)`);
      } else {
        throw new Error(result.message || "Failed to load registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setError(error.message);
      toast.error(error.message || "Failed to load registrations");
      setRegistrations([]);
    } finally {
      setRegLoading(false);
    }
  };

  // Handle webinar selection
  const handleWebinarSelect = (webinar) => {
    console.log("Webinar selected:", webinar);
    setSelectedWebinar(webinar);
    setSearchTerm("");
    setStatusFilter("all");
    fetchRegistrations(webinar._id);
  };

  // Delete registration
  const handleDeleteRegistration = async () => {
    if (!registrationToDelete) return;

    try {
      // Try to cancel the registration
      const response = await fetch(
        `${API_BASE_URL}/registrations/${registrationToDelete._id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: "Admin deleted" }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success("Registration cancelled successfully!");

          // Update in state
          setRegistrations(
            registrations.filter((reg) => reg._id !== registrationToDelete._id),
          );

          // Update webinar participant count
          if (selectedWebinar) {
            setSelectedWebinar({
              ...selectedWebinar,
              currentParticipants: Math.max(
                0,
                (selectedWebinar.currentParticipants || 0) - 1,
              ),
            });
          }
        }
      } else {
        // If cancel endpoint doesn't exist, just remove locally
        toast.success("Registration removed locally!");
        setRegistrations(
          registrations.filter((reg) => reg._id !== registrationToDelete._id),
        );
      }

      setDeleteModal(false);
      setRegistrationToDelete(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Failed to delete registration");
    }
  };

  // Update registration status
  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrations/${registrationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success("Registration status updated!");

          // Update in state
          setRegistrations(
            registrations.map((reg) =>
              reg._id === registrationId ? { ...reg, status: newStatus } : reg,
            ),
          );
        }
      } else {
        // Update locally as fallback
        toast.success("Status updated locally!");
        setRegistrations(
          registrations.map((reg) =>
            reg._id === registrationId ? { ...reg, status: newStatus } : reg,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Update locally as fallback
      toast.success("Status updated locally!");
      setRegistrations(
        registrations.map((reg) =>
          reg._id === registrationId ? { ...reg, status: newStatus } : reg,
        ),
      );
    }
  };

  // Export registrations to CSV
  const exportToCSV = () => {
    if (!registrations.length) {
      toast.warning("No registrations to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Organization",
      "Status",
      "Registered At",
      "Payment Status",
      "Payment Amount",
    ];

    const csvData = registrations.map((reg, index) => {
      const registrationNo = `REG-${Date.now().toString().slice(-5)}-${index + 1}`;

      return [
        `"${registrationNo}"`,
        `"${reg.user?.name || ""}"`,
        `"${reg.user?.email || ""}"`,
        `"${reg.user?.phone || ""}"`,
        `"${reg.user?.role || ""}"`,
        `"${reg.user?.organization || ""}"`,
        `"${reg.status || ""}"`,
        `"${formatDate(reg.createdAt)}"`,
        `"${reg.payment?.status || "N/A"}"`,
        // `"${reg.payment?.amount ?? "N/A"}"`,
      ];
    });


    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${selectedWebinar?.title?.replace(/[^a-z0-9]/gi, "_") || "webinar"}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Registrations exported successfully!");
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      registered: "success",
      attended: "primary",
      cancelled: "danger",
      waitlisted: "warning",
      pending: "secondary",
    };
    return colors[status] || "secondary";
  };

  // Get payment status color
  const getPaymentColor = (status) => {
    const colors = {
      completed: "success",
      pending: "warning",
      failed: "danger",
      refunded: "info",
    };
    return colors[status] || "secondary";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Format webinar date
  const formatWebinarDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Filter registrations based on search term and status
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchTerm === "" ||
      (reg.user?.name &&
        reg.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reg.user?.email &&
        reg.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reg.user?.phone && reg.user.phone.includes(searchTerm)) ||
      (reg.user?.organization &&
        reg.user.organization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchWebinars();
  }, []);

  // Handle status filter change
  useEffect(() => {
    if (selectedWebinar) {
      fetchRegistrations(selectedWebinar._id);
    }
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center my-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading webinars...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Registration Management</h4>
            <p className="text-muted">
              Manage webinar registrations and participants
            </p>
          </div>
          <div className="d-flex gap-2 mt-2">
            <Button color="secondary" size="sm" onClick={fetchWebinars}>
              <i className="mdi mdi-refresh me-1"></i>
              Refresh Webinars
            </Button>
          </div>
        </div>

        {error && (
          <Alert color="danger" className="mb-3">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                {/* Webinar Selection */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                  <div className="mb-3 mb-md-0">
                    <h5 className="card-title mb-0">Select Webinar</h5>
                    <p className="text-muted mb-0">
                      Choose a webinar to view its registrations
                    </p>
                    <small className="text-info">
                      Found {webinars.length} webinar(s) in system
                    </small>
                  </div>

                  {webinars.length > 0 ? (
                    <Input className="w-25"
                      type="select"
                      value={selectedWebinar?._id || ""}
                      onChange={(e) => {
                        const webinar = webinars.find(
                          (w) => w._id === e.target.value,
                        );
                        handleWebinarSelect(webinar);
                      }}
                    >
                      <option value="" disabled>
                        Select Webinar
                      </option>

                      {webinars.map((webinar) => (
                        <option key={webinar._id} value={webinar._id}>
                          {webinar.title} |{" "}
                          {formatWebinarDate(webinar.startTime)} | Participants:{" "}
                          {webinar.currentParticipants || 0} | Status:{" "}
                          {webinar.status}
                        </option>
                      ))}
                    </Input>
                  ) : (
                    <Alert color="warning" className="mb-0">
                      <i className="ri-alert-line me-1"></i>
                      No webinars found. Please create webinars first.
                    </Alert>
                  )}
                </div>

                {/* Selected Webinar Info */}
                {selectedWebinar && (
                  <Card className="mb-4 bg-light">
                    <CardBody>
                      <Row>
                        <Col md={8}>
                          <h6 className="mb-2">{selectedWebinar.title}</h6>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <Badge color="info">
                              {selectedWebinar.badge || "Webinar"}
                            </Badge>
                            <Badge
                              color={getStatusColor(selectedWebinar.status)}
                            >
                              {selectedWebinar.status}
                            </Badge>
                            {selectedWebinar.isFree ? (
                              <Badge color="success">FREE</Badge>
                            ) : (
                              <Badge color="primary">
                                ${selectedWebinar.price}
                              </Badge>
                            )}
                            {selectedWebinar.isFeatured && (
                              <Badge color="warning">Featured</Badge>
                            )}
                          </div>
                          <p className="mb-1 text-muted">
                            <small>
                              <strong>Date:</strong>{" "}
                              {formatDate(selectedWebinar.startTime)}
                            </small>
                          </p>
                          <p className="mb-1 text-muted">
                            <small>
                              <strong>Instructor:</strong>{" "}
                              {selectedWebinar.instructor?.name ||
                                "Not specified"}
                            </small>
                          </p>
                          <p className="mb-0 text-muted">
                            <small>
                              <strong>Webinar ID:</strong> {selectedWebinar._id}
                            </small>
                          </p>
                        </Col>
                        <Col md={4} className="text-md-end">
                          <div className="mb-3">
                            <strong>Participants:</strong>{" "}
                            {selectedWebinar.currentParticipants || 0} /{" "}
                            {selectedWebinar.maxParticipants || "∞"}
                            <div
                              className="progress mt-1"
                              style={{ height: "8px" }}
                            >
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${Math.min(100, ((selectedWebinar.currentParticipants || 0) / (selectedWebinar.maxParticipants || 100)) * 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <strong>Seats Available:</strong>{" "}
                            {Math.max(
                              0,
                              (selectedWebinar.maxParticipants || 0) -
                              (selectedWebinar.currentParticipants || 0),
                            )}
                          </div>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/webinar-management/edit/${selectedWebinar._id}`,
                              )
                            }
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Edit Webinar
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )}

                {/* Actions Bar */}
                {selectedWebinar && (
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                    <div className="mb-3 mb-md-0">
                      <h5 className="card-title mb-0">
                        Registrations ({filteredRegistrations.length})
                        {pagination.total > 0 && ` of ${pagination.total}`}
                      </h5>
                      <p className="text-muted mb-0">
                        Webinar ID: {selectedWebinar._id}
                      </p>
                    </div>

                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Button
                        color="secondary"
                        onClick={() => fetchRegistrations(selectedWebinar._id)}
                        disabled={regLoading}
                        className="btn-sm"
                      >
                        <i className="mdi mdi-refresh me-1"></i>
                        {regLoading ? "Loading..." : "Refresh"}
                      </Button>

                      <Button
                        color="success"
                        onClick={exportToCSV}
                        disabled={!registrations.length}
                        className="btn-sm"
                      >
                        <i className="mdi mdi-download me-1"></i>
                        Export CSV
                      </Button>

                      <Button
                        color="primary"
                        onClick={() => navigate(`/webinar-management`)}
                        className="btn-sm"
                      >
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Back to Webinars
                      </Button>
                    </div>
                  </div>
                )}

                {/* Filters and Search */}
                {selectedWebinar && (
                  <Row className="mb-4">
                    <Col md={6}>
                      <Input
                        type="text"
                        placeholder="Search by name, email, phone, or organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2 mb-md-0"
                      />
                    </Col>
                    <Col md={3}>
                      <Input
                        type="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="registered">Registered</option>
                        <option value="attended">Attended</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="waitlisted">Waitlisted</option>
                      </Input>
                    </Col>
                    <Col md={3} className="text-md-end">
                      <div className="text-muted">
                        Showing {filteredRegistrations.length} registration
                        {filteredRegistrations.length !== 1 ? "s" : ""}
                        {selectedWebinar.currentParticipants > 0 && (
                          <div className="text-success">
                            <i className="mdi mdi-check-circle me-1"></i>
                            {selectedWebinar.currentParticipants} total
                            registered
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}

                {/* Registrations Table */}
                {regLoading ? (
                  <div className="text-center my-5">
                    <Spinner color="primary" />
                    <p className="mt-2">Loading registrations...</p>
                    <small className="text-muted">
                      Fetching from: /webinars/{selectedWebinar?._id}
                      /registrations
                    </small>
                  </div>
                ) : selectedWebinar ? (
                  filteredRegistrations.length === 0 ? (
                    <div className="text-center my-5 py-5">
                      <i className="ri-user-line display-4 text-muted"></i>
                      <h4 className="mt-3">No registrations found</h4>
                      <p className="text-muted">
                        {searchTerm || statusFilter !== "all"
                          ? "No registrations match your filters."
                          : `No registrations found for "${selectedWebinar.title}"`}
                      </p>
                      {selectedWebinar.currentParticipants > 0 ? (
                        <Alert color="info" className="mt-3">
                          <strong>Note:</strong> Webinar shows{" "}
                          {selectedWebinar.currentParticipants} participant(s)
                          but no registration data was returned by the API.
                        </Alert>
                      ) : (
                        <p className="text-muted">
                          This webinar has no registered participants yet.
                        </p>
                      )}
                      {(searchTerm || statusFilter !== "all") && (
                        <Button
                          color="secondary"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                          }}
                          className="mt-3"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Alert color="success" className="mb-3">
                        <i className="mdi mdi-check-circle me-1"></i>
                        Found {filteredRegistrations.length} registration(s) for
                        this webinar
                      </Alert>

                      <div className="table-responsive">
                        <Table hover className="table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Participant</th>
                              <th>Contact Info</th>
                              <th>Registration Date</th>
                              <th>Status</th>
                              <th>Payment</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRegistrations.map(
                              (registration, index) => (
                                <tr key={registration._id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div>
                                      <strong>
                                        {registration.user?.name || "N/A"}
                                      </strong>
                                      <div className="small text-muted">
                                        {registration.user?.role || "N/A"} •{" "}
                                        {registration.user?.organization ||
                                          "N/A"}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div>
                                        <i className="ri-mail-line me-1"></i>
                                        {registration.user?.email || "N/A"}
                                      </div>
                                      <div className="small text-muted">
                                        <i className="ri-phone-line me-1"></i>
                                        {registration.user?.phone || "N/A"}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      {formatDate(registration.createdAt)}
                                    </div>
                                    <small className="text-muted">
                                      ID: {registration._id?.substring(0, 8)}...
                                    </small>
                                  </td>
                                  <td>
                                    <Badge
                                      color={getStatusColor(
                                        registration.status,
                                      )}
                                    >
                                      {registration.status}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div>
                                      <Badge
                                        color={getPaymentColor(
                                          registration.payment?.status,
                                        )}
                                      >
                                        {registration.payment?.status || "N/A"}
                                      </Badge>
                                      {registration.payment?.amount > 0 && (
                                        <div className="small mt-1">
                                          ${registration.payment?.amount}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      {/* <Button
                                      color="info"
                                      size="sm"
                                      onClick={() => {
                                        // View registration details
                                        console.log("Registration details:", registration);
                                        toast.info(`Viewing registration for ${registration.user?.name}`);
                                      }}
                                      title="View Details"
                                    >
                                      <i className="mdi mdi-eye"></i>
                                    </Button> */}
                                      <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                          setRegistrationToDelete(registration);
                                          setDeleteModal(true);
                                        }}
                                        title="Delete Registration"
                                      >
                                        <i className="mdi mdi-delete"></i>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )
                ) : (
                  <div className="text-center my-5 py-5">
                    <i className="ri-presentation-line display-4 text-muted"></i>
                    <h4 className="mt-3">Select a Webinar</h4>
                    <p className="text-muted">
                      {webinars.length === 0
                        ? "No webinars available. Please create webinars first."
                        : "Please select a webinar from the dropdown above to view its registrations."}
                    </p>
                    {webinars.length === 0 && (
                      <Button
                        color="primary"
                        onClick={() => navigate("/webinar-management/create")}
                        className="mt-3"
                      >
                        <i className="mdi mdi-plus me-1"></i>
                        Create First Webinar
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          {registrationToDelete && (
            <div>
              <p>
                Are you sure you want to delete the registration for{" "}
                <strong>"{registrationToDelete.user?.name}"</strong>?
              </p>
              <p className="text-danger">
                <i className="ri-alert-line me-1"></i>
                This action cannot be undone. The participant will be removed
                from the webinar.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              setDeleteModal(false);
              setRegistrationToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteRegistration}>
            Delete Registration
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

export default WebinarManagementRegister;
