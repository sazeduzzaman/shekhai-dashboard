import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";

// Import role-specific dashboard components
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import WelcomeComp from "./WelcomeComp";

const Dashboard = ({ t }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Get user from localStorage on component mount
  useEffect(() => {
    const getAuthUser = () => {
      try {
        const authData = localStorage.getItem("authUser");
        if (authData) {
          const parsedData = JSON.parse(authData);
          setAuthUser(parsedData);
          setUserRole(parsedData?.user?.role || null);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    };

    getAuthUser();

    // Set page title
    document.title =
      "Dashboard | Skote - Vite React Admin & Dashboard Template";
  }, []);

  // If no user is logged in, show WelcomeComp
  if (!authUser) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={t("Dashboards")}
            breadcrumbItem={t("Dashboard")}
          />
          <WelcomeComp />
        </Container>
      </div>
    );
  }

  // Get the dashboard component based on role
  const getDashboardComponent = () => {
    if (userRole === "admin") {
      return <AdminDashboard user={authUser.user} token={authUser.token} />;
    } else if (userRole === "student") {
      return <StudentDashboard user={authUser.user} token={authUser.token} />;
    } else {
      // For instructor or any other role
      return (
        <InstructorDashboard user={authUser.user} token={authUser.token} />
      );
    }
  };

  // Get dashboard title based on role
  const getDashboardTitle = () => {
    if (userRole === "admin") return "Admin Dashboard";
    if (userRole === "student") return "Student Dashboard";
    return "Instructor Dashboard";
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={t("Dashboards")}
          breadcrumbItem={getDashboardTitle()}
        />
        {getDashboardComponent()}
      </Container>
    </div>
  );
};

export default withTranslation()(Dashboard);
