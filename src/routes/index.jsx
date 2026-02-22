// React Router
import { Navigate } from "react-router-dom";

// ==============================
// Authentication Pages
// ==============================
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import UserProfile from "../pages/Authentication/UserProfile";

// ==============================
// Dashboard & Common Pages
// ==============================
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Settings from "../pages/Settings/Settings";
import AllNotification from "../pages/AllNotification/AllNotification";
import ContactsList from "../pages/Contacts/ContactList/contactsList";

// ==============================
// Category Management
// ==============================
import Categories from "../pages/Categories/Categories";
import AddCategory from "../pages/Categories/AddCategory";

// ==============================
// Course Management
// ==============================
import AllCourses from "../pages/Courses/AllCourses";
import AddCourses from "../pages/Courses/AddCourses";
import EditCourse from "../pages/Courses/EditCourse";

// ==============================
// Student Management (Admin)
// ==============================
import Students from "../pages/Students/Students";
import AddStudent from "../pages/Students/AddStudent";

// ==============================
// User & Role Management
// ==============================
import Users from "../pages/Users/Users";
import AddUsers from "../pages/Users/AddUsers";
import RolePermissions from "../pages/RolePermissions/RolePermissions";

// ==============================
// Instructor Management (Admin)
// ==============================
import AllInstructor from "../pages/AllInstructor/AllInstructor";
import InstructorAdd from "../pages/AllInstructor/InstructorAdd";
import InstructorPerformance from "../pages/AllInstructor/InstructorPerformance";

// ==============================
// Student Portal
// ==============================
import MyCourses from "../pages/Student/MyCourses";
import ContinueCourses from "../pages/Student/ContinueCourses";
import BrowseCourses from "../pages/Student/BrowseCourses";
import Certificates from "../pages/Student/Certificates";
import Assignments from "../pages/Student/Assignments";

// ==============================
// Instructor Portal
// ==============================
import InstructorCourses from "../pages/Instructor/InstructorCourses";
import InstructorQuizzes from "../pages/Instructor/InstructorQuizzes";
import CreateQuiz from "../pages/Instructor/CreateQuiz";
import AnnouncementsPage from "../pages/Instructor/AnnouncementsPage";
import CreateAnnouncementForm from "../pages/Instructor/CreateAnnouncementForm";
import StudentsPage from "../pages/Instructor/StudentsPage";
import AttendancePage from "../pages/Instructor/AttendancePage";
import LiveSessionPage from "../pages/Instructor/LiveSessionPage";

// ==============================
// Webinar & Mentor Room
// ==============================
import WebinarManagement from "../pages/WebinerRoom/WebinarManagement";
import WebinarManagementCreate from "../pages/WebinerRoom/WebinarManagementCreate";
import WebinarManagementEdit from "../pages/WebinerRoom/WebinarManagementEdit";
import WebinarManagementRegister from "../pages/WebinerRoom/WebinarManagementRegister";
import MentorRoomManagement from "../pages/MentorRoom/MentorRoomManagement";

// ==============================
// Home Page Management
// ==============================
import HomePageManagement from "../pages/HomePage/HomePageManagement";
import Enrollments from "../pages/Enrollements/Enrollements";
import CreateLiveSessionPage from "../pages/Instructor/AddLiveSession";
import StudyBit from "../pages/Dashboard/StudyBit/StudyBit";
import EditLiveSession from "../pages/Instructor/EditLiveSession";

// ======================================================================
// 🔒 AUTH PROTECTED ROUTES
// (Accessible only after login)
// ======================================================================
const authProtectedRoutes = [
  // Dashboard & Profile
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <UserProfile /> },

  // Categories
  { path: "/all-categories", component: <Categories /> },
  { path: "/categories/add", component: <AddCategory /> },

  // Users & Roles
  { path: "/users", component: <Users /> },
  { path: "/users/add", component: <AddUsers /> },
  { path: "/role-permissions", component: <RolePermissions /> },

  // Courses
  { path: "/all-courses", component: <AllCourses /> },
  { path: "/courses/add", component: <AddCourses /> },
  { path: "/courses/edit/:id", component: <EditCourse /> },

  // Students (Admin)
  { path: "/students", component: <Students /> },
  { path: "/students/add", component: <AddStudent /> },

  // Notifications & Settings
  { path: "/all-notification", component: <AllNotification /> },
  { path: "/settings", component: <Settings /> },

  // Instructor (Admin)
  { path: "/all-instructors", component: <AllInstructor /> },
  { path: "/instructors/add", component: <InstructorAdd /> },
  { path: "/instructors/performance", component: <InstructorPerformance /> },

  // Student Portal
  { path: "/student/my-courses", component: <MyCourses /> },
  // { path: "/student/continue-courses", component: <ContinueCourses /> },
  { path: "/student/continue-courses/:courseId", component: <ContinueCourses /> },
  { path: "/student/browse-courses", component: <BrowseCourses /> },
  { path: "/student/certificates", component: <Certificates /> },
  { path: "/student/assignments", component: <Assignments /> },
  { path: "/student/enrollements", component: <Enrollments /> },

  // Instructor Portal
  { path: "/instructor/courses", component: <InstructorCourses /> },
  { path: "/instructor/quizzes", component: <InstructorQuizzes /> },
  { path: "/instructor/quizzes/create", component: <CreateQuiz /> },
  { path: "/instructor/announcements", component: <AnnouncementsPage /> },
  { path: "/instructor/announcements/create", component: <CreateAnnouncementForm /> },
  { path: "/instructor/enrolled/students", component: <StudentsPage /> },
  { path: "/instructor/enrolled/students/attendance", component: <AttendancePage /> },
  { path: "/all/live-sessions", component: <LiveSessionPage /> },
  { path: "/live-sessions/create", component: <CreateLiveSessionPage /> },
  { path: "/live-sessions/edit/:id", component: <EditLiveSession /> },

  // Webinar & Mentor Room
  { path: "/webinar-management", component: <WebinarManagement /> },
  { path: "/webinar-management/create", component: <WebinarManagementCreate /> },
  { path: "/webinar-management/edit/:id", component: <WebinarManagementEdit /> },
  { path: "/webinar-management/register", component: <WebinarManagementRegister /> },
  { path: "/mentor-room", component: <MentorRoomManagement /> },
  { path: "/study-bit", component: <StudyBit /> },

  // Home Page Management
  { path: "/home-page", component: <HomePageManagement /> },

  // Utilities
  { path: "/calendar", component: <Calendar /> },
  { path: "/contacts-list", component: <ContactsList /> },

  // Default Redirect
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];


// ======================================================================
// 🌐 PUBLIC ROUTES
// (Accessible without login)
// ======================================================================
const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/logout", component: <Logout /> },
];

// Export Routes
export { authProtectedRoutes, publicRoutes };
