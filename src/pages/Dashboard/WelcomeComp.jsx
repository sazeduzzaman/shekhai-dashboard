import { Card, CardBody, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

const WelcomeComp = () => {
  // Get user from localStorage
  const getAuthUser = () => {
    try {
      const authData = localStorage.getItem("authUser");
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error("Error parsing auth data:", error);
      return null;
    }
  };

  const authUser = getAuthUser();

  // If no user is logged in, show login prompt
  if (!authUser) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Alert color="warning">
            <h5 className="alert-heading">Authentication Required</h5>
            <p>Please log in to view your dashboard</p>
            <Link to="/login" className="btn btn-primary mt-2">
              Go to Login
            </Link>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const { user, token } = authUser;
  const { role } = user;

  // Show AdminDashboard for admin, StudentDashboard for student, InstructorDashboard for everything else
  if (role === "admin") {
    return <AdminDashboard user={user} token={token} />;
  } else if (role === "student") {
    return <StudentDashboard user={user} token={token} />;
  } else {
    return <InstructorDashboard user={user} token={token} />;
  }
};

export default WelcomeComp;
