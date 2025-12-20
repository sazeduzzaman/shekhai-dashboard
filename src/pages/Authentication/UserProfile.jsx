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
          "https://shekhai-server-production.up.railway.app/api/v1/users/me",
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

  if (loading)
    return (
      <p className="text-center mt-5">
        <Spinner size="sm" /> Loading...
      </p>
    );

  if (!user) return <p className="text-center mt-5">No user data found.</p>;

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
                <span className="badge bg-info text-dark text-capitalize">
                  {user.role}
                </span>
              </CardBody>
            </Card>

            {/* Personal Info */}
            <Card className="shadow-sm mt-4">
              <CardBody>
                <h1 className="mb-3">
                  All Info
                </h1>
                <div className="table-responsive pt-3">
                  <table className="table table-borderless table-striped mb-0">
                    <tbody>
                      <tr>
                        <th className="text-muted">Full Name:</th>
                        <td>{user.name}</td>
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
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
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
