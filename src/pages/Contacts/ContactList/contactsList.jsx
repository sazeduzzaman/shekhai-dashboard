import React, { useEffect, useState, useMemo, useCallback } from "react";
import withRouter from "../../../components/Common/withRouter";
import TableContainer from "../../../components/Common/TableContainer";
import Spinner from "../../../components/Common/Spinner";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
  Button,
  Badge,
  Alert,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import moment from "moment";

// Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import DeleteModal from "/src/components/Common/DeleteModal";

// Import toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API Configuration
const API_BASE_URL = "https://shekhai-server.onrender.com/api/v1";

// API Service matching your backend API
const apiService = {
  // Get all contacts
  async getContacts() {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },

  // Update contact status using PATCH as per your backend
  async updateContactStatus(id, status, notes = "") {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...(notes && { notes }), // Include notes only if provided
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
          `Failed to update contact. Status: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating contact status:", error);
      throw error;
    }
  },

  // Delete contact
  async deleteContact(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },
};

const ContactsList = () => {
  // Meta title
  document.title =
    "Contact Messages | shekhai - Vite React Admin & Dashboard Template";

  // State Management
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Status options - MATCHING YOUR BACKEND STATUS VALUES
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New", color: "primary" },
    { value: "in_progress", label: "In Progress", color: "warning" },
    { value: "resolved", label: "Resolved", color: "success" },
    { value: "closed", label: "Closed", color: "secondary" },
  ];

  // Status badge colors mapping
  const statusColors = {
    new: "primary",
    in_progress: "warning",
    resolved: "success",
    closed: "secondary",
  };

  // Subject options mapping
  const subjectOptions = {
    general: "General Inquiry",
    support: "Technical Support",
    billing: "Billing & Payment",
    feedback: "Feedback & Suggestions",
    partnership: "Partnership",
    other: "Other",
  };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Apply filter when contacts or statusFilter changes
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) => contact.status === statusFilter,
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, statusFilter]);

  // Fetch contacts function
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getContacts();

      if (response.success) {
        const mappedContacts = response.data.map((contact) => ({
          id: contact._id,
          _id: contact._id,
          name: `${contact.firstName} ${contact.lastName}`,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          subjectLabel: subjectOptions[contact.subject] || contact.subject,
          message: contact.message,
          status: contact.status,
          notes: contact.notes || "",
          ipAddress: contact.ipAddress,
          createdAt: contact.createdAt,
          formattedDate: moment(contact.createdAt).format("MMM DD, YYYY HH:mm"),
          formattedDateLong: moment(contact.createdAt).format(
            "MMMM Do YYYY, h:mm:ss a",
          ),
        }));

        setContacts(mappedContacts);
        setSuccessMessage(`${mappedContacts.length} contact messages loaded`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.message || "Failed to load contacts");
      }
    } catch (error) {
      setError(error.message || "Failed to load contacts. Please try again.");
      console.error("Error details:", error);
      toast.error(error.message || "Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation for editing contact
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: selectedContact?.status || "new",
      notes: selectedContact?.notes || "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      notes: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        if (selectedContact?._id) {
          const response = await apiService.updateContactStatus(
            selectedContact._id,
            values.status,
            values.notes,
          );

          if (response.success) {
            toast.success("Contact status updated successfully");

            // Update local state immediately
            setContacts((prevContacts) =>
              prevContacts.map((contact) =>
                contact._id === selectedContact._id
                  ? {
                    ...contact,
                    status: values.status,
                    notes: values.notes,
                  }
                  : contact,
              ),
            );

            // Reset form and close modal
            validation.resetForm();
            setModal(false);
            setIsEdit(false);
            setSelectedContact(null);
          } else {
            throw new Error(response.message || "Failed to update contact");
          }
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(error.message || "Failed to update contact status");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle view contact details
  const handleViewClick = useCallback((contact) => {
    setSelectedContact(contact);
    setIsEdit(false);
    setModal(true);
  }, []);

  // Handle edit contact status
  const handleEditClick = useCallback(
    (contact) => {
      setSelectedContact(contact);
      validation.setValues({
        status: contact.status,
        notes: contact.notes || "",
      });
      setIsEdit(true);
      setModal(true);
    },
    [validation],
  );

  // Handle delete contact
  const handleDeleteClick = useCallback((contact) => {
    setSelectedContact(contact);
    setDeleteModal(true);
  }, []);

  // Quick status update
  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      // Update local state immediately for better UX
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === contactId
            ? { ...contact, status: newStatus }
            : contact,
        ),
      );

      // Update via API
      const response = await apiService.updateContactStatus(
        contactId,
        newStatus,
      );

      if (!response.success) {
        // If API fails, revert local state
        toast.error(response.message || "Failed to update status on server");
        // Re-fetch to get correct state
        await fetchContacts();
      } else {
        toast.success(
          `Status updated to ${statusOptions.find((opt) => opt.value === newStatus)?.label || newStatus}`,
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
      // Re-fetch to get correct state
      await fetchContacts();
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedContact?._id) return;

    setIsLoading(true);
    try {
      await apiService.deleteContact(selectedContact._id);
      toast.success("Contact deleted successfully");

      // Update local state immediately
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== selectedContact._id),
      );

      setDeleteModal(false);
      setSelectedContact(null);
      setModal(false);
    } catch (error) {
      toast.error("Failed to delete contact");
    } finally {
      setIsLoading(false);
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "_id",
        cell: (cell) => (
          <div className="avatar-xs">
            <span className="avatar-title bg-primary rounded-circle">
              {cell.row.original.firstName?.charAt(0) || "C"}
            </span>
          </div>
        ),
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => (
          <>
            <h5 className="font-size-14 mb-1">{cell.getValue()}</h5>
            <p className="text-muted mb-0">{cell.row.original.subjectLabel}</p>
          </>
        ),
      },
      {
        header: "Contact Info",
        enableColumnFilter: false,
        cell: (cell) => (
          <div>
            <div>
              <a
                href={`mailto:${cell.row.original.email}`}
                className="text-primary"
              >
                {cell.row.original.email}
              </a>
            </div>
            <div className="text-muted small">
              {cell.row.original.phone || "No phone"}
            </div>
          </div>
        ),
      },
      {
        header: "Message",
        accessorKey: "message",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="text-truncate" style={{ maxWidth: "200px" }}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          const status = cell.getValue();
          const contact = cell.row.original;
          return (
            <div className="d-flex align-items-center">
              <Badge color={statusColors[status] || "light"} className="me-2">
                {getStatusLabel(status)}
              </Badge>
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="span"
                  className="text-muted"
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-chevron-down"></i>
                </DropdownToggle>
                <DropdownMenu>
                  {statusOptions
                    .filter(
                      (opt) => opt.value !== "all" && opt.value !== status,
                    )
                    .map((option) => (
                      <DropdownItem
                        key={option.value}
                        onClick={() =>
                          handleStatusUpdate(contact._id, option.value)
                        }
                      >
                        <i
                          className={`mdi mdi-circle text-${option.color} me-1`}
                        ></i>
                        {option.label}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        },
      },
      {
        header: "Date",
        accessorKey: "formattedDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => (
          <div className="text-muted small">{cell.getValue()}</div>
        ),
      },
      {
        header: "Actions",
        cell: (cellProps) => {
          const contact = cellProps.row.original;
          return (
            <div className="d-flex gap-2">
              <Button
                color="info"
                size="sm"
                onClick={() => handleViewClick(contact)}
                className="btn-sm"
                title="View Details"
              >
                <i className="mdi mdi-eye font-size-14" />
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={() => handleEditClick(contact)}
                className="btn-sm"
                title="Edit Status"
              >
                <i className="mdi mdi-pencil font-size-14" />
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDeleteClick(contact)}
                className="btn-sm"
                title="Delete"
              >
                <i className="mdi mdi-delete font-size-14" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleViewClick, handleEditClick, handleDeleteClick],
  );

  return (
    <React.Fragment>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Contact Message"
        message={`Are you sure you want to delete the message from ${selectedContact?.name || "this contact"}? This action cannot be undone.`}
      />

      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Messages" />

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
              <i className="mdi mdi-check-circle-outline me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              <i className="mdi mdi-alert-circle-outline me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="card-title mb-0">Contact Messages</h4>
                    <div className="d-flex gap-2">
                      {/* Status Filter */}
                      <UncontrolledDropdown>
                        <DropdownToggle color="light" caret>
                          <i className="mdi mdi-filter me-1"></i>
                          {statusOptions.find(
                            (opt) => opt.value === statusFilter,
                          )?.label || "Filter by Status"}
                        </DropdownToggle>
                        <DropdownMenu>
                          {statusOptions.map((option) => (
                            <DropdownItem
                              key={option.value}
                              active={statusFilter === option.value}
                              onClick={() => setStatusFilter(option.value)}
                            >
                              {option.value !== "all" && (
                                <i
                                  className={`mdi mdi-circle text-${option.color} me-1`}
                                ></i>
                              )}
                              {option.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading contact messages...</p>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={filteredContacts}
                      isGlobalFilter={true}
                      isPagination={false}
                      SearchPlaceholder="Search messages..."
                      isCustomPageSize={true}
                      defaultPageSize={10}
                      tableClass="align-middle table-nowrap table-hover"
                      theadClass="table-light"
                      paginationWrapper="d-flex justify-content-between align-items-center"
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* View/Edit Contact Modal */}
          <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
            <ModalHeader toggle={() => setModal(!modal)}>
              {isEdit ? "Update Status" : "Message Details"} -{" "}
              {selectedContact?.name}
            </ModalHeader>
            <ModalBody>
              {selectedContact && (
                <>
                  {/* View Mode */}
                  {!isEdit ? (
                    <div>
                      <Row className="mb-4">
                        <Col md={6}>
                          <h6 className="text-muted">Contact Information</h6>
                          <p>
                            <strong>Name:</strong> {selectedContact.name}
                            <br />
                            <strong>Email:</strong>{" "}
                            <a href={`mailto:${selectedContact.email}`}>
                              {selectedContact.email}
                            </a>
                            <br />
                            {selectedContact.phone && (
                              <>
                                <strong>Phone:</strong> {selectedContact.phone}
                                <br />
                              </>
                            )}
                            <strong>Subject:</strong>{" "}
                            {selectedContact.subjectLabel}
                          </p>
                        </Col>
                        <Col md={6} className="text-end">
                          <div className="mb-2">
                            <Badge
                              color={
                                statusColors[selectedContact.status] || "light"
                              }
                            >
                              {getStatusLabel(selectedContact.status)}
                            </Badge>
                          </div>
                          <p className="text-muted small">
                            <strong>Received:</strong>{" "}
                            {selectedContact.formattedDateLong}
                            <br />
                            <strong>IP Address:</strong>{" "}
                            {selectedContact.ipAddress}
                          </p>
                        </Col>
                      </Row>

                      {selectedContact.notes && (
                        <div className="mb-3">
                          <h6 className="text-muted">Admin Notes</h6>
                          <div className="border rounded p-3 bg-warning bg-opacity-10">
                            {selectedContact.notes}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <h6 className="text-muted">Message</h6>
                        <div className="border rounded p-3 bg-light">
                          {selectedContact.message}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Button
                          color="secondary"
                          onClick={() => setModal(false)}
                        >
                          Close
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            color="primary"
                            onClick={() => handleEditClick(selectedContact)}
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Update Status
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => {
                              setModal(false);
                              handleDeleteClick(selectedContact);
                            }}
                          >
                            <i className="mdi mdi-delete me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <Form onSubmit={validation.handleSubmit}>
                      <Row className="mb-4">
                        <Col md={6}>
                          <h6>Contact: {selectedContact.name}</h6>
                          <p className="text-muted small">
                            {selectedContact.email}
                            <br />
                            Submitted: {selectedContact.formattedDate}
                          </p>
                        </Col>
                        <Col md={6} className="text-end">
                          <Badge
                            color={
                              statusColors[selectedContact.status] || "light"
                            }
                          >
                            Current: {getStatusLabel(selectedContact.status)}
                          </Badge>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <div className="mb-3 flex-column">
                            <Label htmlFor="status">Update Status *</Label> <br />
                            <Input
                              className="w-50"
                              type="select"
                              id="status"
                              name="status"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.status}
                              invalid={
                                validation.touched.status &&
                                validation.errors.status
                              }
                              disabled={isSubmitting}
                            >
                              {statusOptions
                                .filter((opt) => opt.value !== "all")
                                .map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                            </Input>
                            {validation.touched.status &&
                              validation.errors.status && (
                                <FormFeedback type="invalid">
                                  {validation.errors.status}
                                </FormFeedback>
                              )}
                          </div>
                        </Col>

                        <Col md={12}>
                          <div className="mb-3">
                            <Label htmlFor="notes">Admin Notes</Label>
                            <Input
                              type="textarea"
                              id="notes"
                              name="notes"
                              rows="3"
                              placeholder="Add any notes about this contact (optional)..."
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.notes}
                              disabled={isSubmitting}
                            />
                            <small className="text-muted">
                              These notes are for internal use only.
                            </small>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-4 d-flex justify-content-end gap-2">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => setIsEdit(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" />
                              Updating...
                            </>
                          ) : (
                            "Update Status"
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </>
              )}
            </ModalBody>
          </Modal>
        </Container>
      </div>

      {/* Toast Container */}
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
    </React.Fragment>
  );
};

export default withRouter(ContactsList);