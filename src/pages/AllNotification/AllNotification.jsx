import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";

// ----------------------------------------------------
// Mock Data (Replace with your actual API data)
// ----------------------------------------------------
const mockNotifications = [
  {
    id: 1,
    type: "New Task",
    title: "Website Redesign Project Assigned",
    time: "5 min ago",
    status: "new",
    color: "primary",
    icon: "fas fa-tasks",
  },
  {
    id: 2,
    type: "Billing",
    title: "Invoice #1098 is now overdue",
    time: "1 hr ago",
    status: "unread",
    color: "danger",
    icon: "fas fa-exclamation-triangle",
  },
  {
    id: 3,
    type: "System",
    title: "Server maintenance scheduled for 10 PM",
    time: "3 hrs ago",
    status: "read",
    color: "warning",
    icon: "fas fa-cogs",
  },
  {
    id: 4,
    type: "Comment",
    title: "John Smith commented on your report",
    time: "Yesterday",
    status: "unread",
    color: "success",
    icon: "fas fa-comment-dots",
  },
  {
    id: 5,
    type: "New Task",
    title: "App Bug Fixing Assigned",
    time: "Dec 1st",
    status: "read",
    color: "primary",
    icon: "fas fa-tasks",
  },
  {
    id: 6,
    type: "System",
    title: "Database backup completed successfully",
    time: "Dec 1st",
    status: "read",
    color: "info",
    icon: "fas fa-check-circle",
  },
];

// ----------------------------------------------------
// Component
// ----------------------------------------------------

const AllNotification = () => {
  document.title = "All Notifications";
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  // --- Handlers ---

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({
      ...n,
      status: "read",
      color: "secondary",
    }));
    setNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.status === "unread" || n.status === "new";
    if (filter === "system") return n.type === "System";
    if (filter === "task") return n.type === "New Task";
    return true;
  });

  const getUnreadCount = () => {
    return notifications.filter(
      (n) => n.status === "unread" || n.status === "new"
    ).length;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Dashboard" breadcrumbItem="Notifications" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                {/* Header and Actions */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                  <h4 className="card-title mb-0">
                    All Notifications (
                    {getUnreadCount() > 0 && (
                      <Badge color="danger" pill>
                        {getUnreadCount()} New
                      </Badge>
                    )}
                    )
                  </h4>
                  <div className="d-flex gap-2">
                    <Button
                      color="light"
                      size="sm"
                      onClick={handleMarkAllRead}
                      disabled={getUnreadCount() === 0}
                    >
                      Mark All as Read
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      outline
                      onClick={handleClearNotifications}
                      disabled={notifications.length === 0}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Filter Tabs (UX Improvement) */}
                <div className="d-flex mb-4 gap-3">
                  <Button
                    color={filter === "all" ? "primary" : "light"}
                    onClick={() => setFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    color={filter === "unread" ? "primary" : "light"}
                    onClick={() => setFilter("unread")}
                    size="sm"
                  >
                    Unread{" "}
                    <Badge color="danger" className="ms-1">
                      {getUnreadCount()}
                    </Badge>
                  </Button>
                  <Button
                    color={filter === "task" ? "primary" : "light"}
                    onClick={() => setFilter("task")}
                    size="sm"
                  >
                    Tasks
                  </Button>
                  <Button
                    color={filter === "system" ? "primary" : "light"}
                    onClick={() => setFilter("system")}
                    size="sm"
                  >
                    System Alerts
                  </Button>
                </div>

                {/* Notifications List */}
                <ListGroup className="notification-list">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                      <ListGroupItem
                        key={n.id}
                        // Highlight unread items with a background color/shadow
                        className={`d-flex align-items-center mb-2 p-3 rounded shadow-sm ${
                          n.status === "unread" || n.status === "new"
                            ? "bg-light border-start border-4 border-primary"
                            : ""
                        }`}
                      >
                        <div className={`avatar-xs me-3 flex-shrink-0`}>
                          {/* Icon for type of notification */}
                          <span
                            className={`avatar-title rounded-circle bg-${n.color}-subtle text-${n.color} font-size-16`}
                          >
                            <i className={n.icon}></i>{" "}
                            {/* Requires Font Awesome or similar icon library */}
                          </span>
                        </div>

                        <div className="flex-grow-1">
                          <h6
                            className={`mb-1 font-size-14 ${
                              n.status === "unread" || n.status === "new"
                                ? "fw-bold"
                                : "text-muted"
                            }`}
                          >
                            {n.title}
                          </h6>
                          <p className="text-muted mb-0">
                            <i className="far fa-clock me-1"></i> {n.time}
                          </p>
                        </div>

                        <div className="ms-auto flex-shrink-0">
                          {n.status === "new" && (
                            <Badge color="success" pill>
                              NEW
                            </Badge>
                          )}
                          {n.status === "unread" && (
                            <Badge color="primary" pill>
                              Unread
                            </Badge>
                          )}
                          {n.status === "read" && (
                            <Badge color="secondary" pill>
                              Read
                            </Badge>
                          )}

                          {/* Optional: Add a 'Mark as read' button or click handler here */}
                        </div>
                      </ListGroupItem>
                    ))
                  ) : (
                    <div className="text-center p-5 text-muted">
                      <i className="fas fa-bell-slash display-4 mb-3"></i>
                      <h5>You're all caught up!</h5>
                      <p>No notifications match the current filter.</p>
                    </div>
                  )}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllNotification;
