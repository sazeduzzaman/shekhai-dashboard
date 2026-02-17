import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardTitle,
  Spinner,
  Badge,
} from "reactstrap";

import Breadcrumb from "../../components/Common/Breadcrumb";
import EditProfileForm from "./EditProfileForm";

const UserProfile = () => {
  document.title = "Profile | Dashboard";

  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("authUser"));
        const token = authData?.token;

        if (!token) {
          setError("You are not authenticated");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://shekhai-server.onrender.com/api/v1/users/me",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setError(res.data.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner size="sm" /> Loading...
      </div>
    );

  if (!user) return <div className="text-center mt-5">No user data found.</div>;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Dashboard" breadcrumbItem="Profile" />

        {/* Alerts */}
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Row className="g-4">
          {/* LEFT COLUMN */}
          <Col lg="4">
            {/* Profile Card */}
            <Card className="shadow-sm border-0 overflow-hidden">
              <div className="bg-primary-subtle bg-soft-primary p-3 text-center">
                <h5 className="text-primary mb-1">Welcome Back!</h5>
                <p className="text-muted mb-0">Glad to see you again.</p>
              </div>

              <CardBody className="text-center pt-4">
                <div className="profile-avatar mb-3">
                  <img
                    src={
                      user.avatarUrl ||
                      "https://themesbrand.com/skote/layouts/assets/images/profile-img.png"
                    }
                    alt="User"
                    className="rounded-circle img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <h5 className="fw-bold text-capitalize">{user.name}</h5>
                <p className="text-muted mb-1">{user.email}</p>
                <div className="d-flex gap-2 justify-content-center mt-2">
                  <Badge color="info" className="text-capitalize">
                    {user.role}
                  </Badge>
                  {user.isActive ? (
                    <Badge color="success">Active</Badge>
                  ) : (
                    <Badge color="danger">Inactive</Badge>
                  )}
                  {user.isEmailVerified ? (
                    <Badge color="primary">Email Verified</Badge>
                  ) : (
                    <Badge color="warning">Email Unverified</Badge>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* All Information Card */}
            <Card className="shadow-sm mt-4">
              <CardBody>
                <h5 className="mb-3 fw-bold">All Information</h5>
                <div className="table-responsive pt-2">
                  <table className="table table-borderless table-striped mb-0">
                    <tbody>
                      <tr>
                        <th className="text-muted" style={{ width: "40%" }}>
                          Full Name:
                        </th>
                        <td className="text-capitalize">{user.name}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">Email:</th>
                        <td>{user.email}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">Role:</th>
                        <td className="text-capitalize">{user.role}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">Bio:</th>
                        <td>{user.bio || "No bio added"}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">Status:</th>
                        <td>
                          {user.isActive ? (
                            <Badge color="success" pill>
                              Active
                            </Badge>
                          ) : (
                            <Badge color="danger" pill>
                              Inactive
                            </Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-muted">Email Verified:</th>
                        <td>
                          {user.isEmailVerified ? (
                            <Badge color="primary" pill>
                              Verified
                            </Badge>
                          ) : (
                            <Badge color="warning" pill>
                              Not Verified
                            </Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-muted">Rating:</th>
                        <td>
                          {user.rating > 0 ? (
                            <span>⭐ {user.rating.toFixed(1)}</span>
                          ) : (
                            "No ratings yet"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-muted">Total Students:</th>
                        <td>
                          <Badge color="info" pill>
                            {user.totalStudents || 0}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <th className="text-muted">Member Since:</th>
                        <td>{formatDate(user.createdAt)}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">Last Updated:</th>
                        <td>{formatDate(user.updatedAt)}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">User ID:</th>
                        <td>
                          <small className="text-muted">{user._id}</small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Courses Information Cards */}
            {user.role === "instructor" && (
              <Card className="shadow-sm mt-4">
                <CardBody>
                  <h5 className="mb-3 fw-bold">Instructor Stats</h5>
                  <div className="d-flex justify-content-around text-center">
                    <div>
                      <h6 className="text-muted">Courses</h6>
                      <h4 className="mb-0">{user.courses?.length || 0}</h4>
                    </div>
                    <div>
                      <h6 className="text-muted">Expertise</h6>
                      <h4 className="mb-0">{user.expertise?.length || 0}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {user.role === "student" && (
              <Card className="shadow-sm mt-4">
                <CardBody>
                  <h5 className="mb-3 fw-bold">Student Stats</h5>
                  <div className="text-center">
                    <h6 className="text-muted">Enrolled Courses</h6>
                    <h4 className="mb-0">{user.enrolledCourses?.length || 0}</h4>
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>

          {/* RIGHT COLUMN — EDIT FORM */}
          <Col lg="8">
            <EditProfileForm
              user={user}
              setUser={setUser}
              setSuccess={setSuccess}
              setError={setError}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfile;