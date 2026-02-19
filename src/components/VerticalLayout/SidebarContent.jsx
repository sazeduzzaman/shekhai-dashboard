import PropTypes from "prop-types";
import { useEffect, useRef, useCallback } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";

// Comprehensive Icon Imports
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Settings,
  Award,
  Calendar,
  Video,
  DollarSign,
  Globe,
  HelpCircle,
  Layers,
  Bell,
  User,
} from "react-feather";
import { BookAlert, DollarSignIcon, Repeat1, Sliders, SunsetIcon, Users2 } from "lucide-react";

const SidebarContent = ({ t }) => {
  const ref = useRef();
  const location = useLocation();
  const metisMenuRef = useRef();

  // Get user role from localStorage
  const auth = JSON.parse(localStorage.getItem("authUser"));
  const userRole = auth?.user?.role || "student";

  const scrollElement = (item) => {
    if (item && ref.current) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  // Logic to collapse all dropdowns (Used when clicking single links or Dashboard)
  const collapseAll = useCallback(() => {
    const ul = document.getElementById("side-menu");
    if (ul) {
      const opens = ul.querySelectorAll(".mm-show");
      const actives = ul.querySelectorAll(".mm-active");
      opens.forEach((el) => el.classList.remove("mm-show"));
      actives.forEach((el) => el.classList.remove("mm-active"));
    }
  }, []);

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    let parent = item.parentElement; // li

    while (parent && parent.id !== "side-menu") {
      parent.classList.add("mm-active");
      const parentUl = parent.parentElement; // ul

      if (parentUl && parentUl.id !== "side-menu") {
        parentUl.classList.add("mm-show");
        const parentLi = parentUl.parentElement;
        if (parentLi) {
          parentLi.classList.add("mm-active");
        }
      }
      parent = parent.parentElement;
    }
    scrollElement(item);
  }, []);

  const activeMenu = useCallback(() => {
    const pathName = location.pathname;
    const ul = document.getElementById("side-menu");
    if (!ul) return;

    const items = ul.getElementsByTagName("a");
    // Remove previous activations
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("active");
    }

    let matchingMenuItem = null;
    for (let i = 0; i < items.length; i++) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    } else {
      // If it's a root path or dashboard, ensure clean state
      collapseAll();
    }
  }, [location.pathname, activateParentDropdown, collapseAll]);

  // Initialization
  useEffect(() => {
    // Initialize MetisMenu with toggle: true for Accordion effect
    metisMenuRef.current = new MetisMenu("#side-menu", {
      toggle: true
    });

    activeMenu();

    return () => {
      if (metisMenuRef.current) metisMenuRef.current.dispose();
    };
  }, [userRole]); // Re-init on role change

  // Route Change Logic
  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  return (
    <SimpleBar style={{ maxHeight: "100vh" }} ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{t("Main")}</li>
          <li>
            <Link to="/dashboard" onClick={collapseAll}>
              <Home size={18} className="align-middle me-2" />
              <span>{t("Dashboard")}</span>
            </Link>
          </li>

          {/* STUDENT MENUS */}
          {userRole === "student" && (
            <>
              <li>
                <Link to="/#" className="has-arrow">
                  <BookOpen size={18} className="align-middle me-2" />
                  <span>{t("My Learning")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/student/my-courses">
                      <BookOpen size={16} className="me-2" />
                      {t("My Courses")}
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/student/continue-courses">
                      <PlayCircle size={16} className="me-2" />
                      {t("Continue Learning")}
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/student/browse-courses">
                      <Globe size={16} className="me-2" />
                      {t("Browse Courses")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/student/certificates">
                      <Award size={16} className="me-2" />
                      {t("Certificates")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <FileText size={18} className="align-middle me-2" />
                  <span>{t("Assignments")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/student/assignments">
                      {t("All Assignments")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/calendar" onClick={collapseAll}>
                  <Calendar size={18} className="me-2" />
                  {t("Calendar")}
                </Link>
              </li>
            </>
          )}

          {/* INSTRUCTOR MENUS */}
          {userRole === "instructor" && (
            <>
              <li>
                <Link to="/#" className="has-arrow">
                  <BookOpen size={18} className="align-middle me-2" />
                  <span>{t("Courses")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/instructor/courses">{t("My Courses")}</Link>
                  </li>
                  <li>
                    <Link to="/courses/add">
                      {t("Create Course")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <Video size={18} className="align-middle me-2" />
                  <span>{t("Content")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/instructor/quizzes">{t("Quizzes")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/announcements">
                      {t("Announcements")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <Users size={18} className="align-middle me-2" />
                  <span>{t("Students")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/instructor/enrolled/students">{t("All Students")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/enrolled/students/attendance">
                      {t("Attendance")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/all/live-sessions" onClick={collapseAll}>
                  <Video size={18} className="me-2" />
                  {t("Live Sessions")}
                </Link>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <DollarSign size={18} className="align-middle me-2" />
                  <span>{t("Revenue")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/instructor/revenue">{t("Earnings")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/analytics">{t("Analytics")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/reports">{t("Reports")}</Link>
                  </li>
                </ul>
              </li>
            </>
          )}

          {/* ADMIN MENUS */}
          {userRole === "admin" && (
            <>
              <li>
                <Link to="/#" className="has-arrow">
                  <Layers size={18} className="align-middle me-2" />
                  <span>{t("Categories")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/all-categories">{t("All Categories")}</Link>
                  </li>
                  <li>
                    <Link to="/categories/add">{t("Add Category")}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <Users size={18} className="align-middle me-2" />
                  <span>{t("Users")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/users">{t("All Users")}</Link>
                  </li>
                  <li>
                    <Link to="/users/add">{t("Add User")}</Link>
                  </li>
                  <li>
                    <Link to="/role-permissions">
                      {t("Roles & Permissions")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <BookOpen size={18} className="align-middle me-2" />
                  <span>{t("Courses")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/all-courses">{t("All Courses")}</Link>
                  </li>
                  <li>
                    <Link to="/courses/add">{t("Add Course")}</Link>
                  </li>
                  {/* <li>
                    <Link to="/courses/review">{t("Course Reviews")}</Link>
                  </li> */}
                  {/* <li>
                    <Link to="/courses/approval">{t("Approval Queue")}</Link>
                  </li> */}
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <DollarSignIcon size={18} className="align-middle me-2" />
                  <span>{t("Enrollments")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/student/enrollements">{t("All Enrollments")}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <Award size={18} className="align-middle me-2" />
                  <span>{t("Instructors")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/all-instructors">{t("All Instructors")}</Link>
                  </li>
                  <li>
                    <Link to="/instructors/add">{t("Add Instructor")}</Link>
                  </li>
                  {/* <li>
                    <Link to="/instructors/performance">
                      {t("Performance")}
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li>
                <Link to="/contacts-list" onClick={collapseAll}>
                  <Repeat1 size={18} className="me-2" />
                  {t("Contact List")}
                </Link>
              </li>
              <li>
                <Link to="/webinar-management" onClick={collapseAll}>
                  <SunsetIcon size={18} className="me-2" />
                  {t("Webinar Management")}
                </Link>
              </li>
              <li>
                <Link to="/mentor-room" onClick={collapseAll}>
                  <Users2 size={18} className="me-2" />
                  {t("Mentor Room")}
                </Link>
              </li>
              <li>
                <Link to="/home-page" onClick={collapseAll}>
                  <Sliders size={18} className="me-2" />
                  {t("Home Page")}
                </Link>
              </li>
              <li>
                <Link to="/all/live-sessions" onClick={collapseAll}>
                  <Video size={18} className="me-2" />
                  {t("Live Sessions")}
                </Link>
              </li>
              <li>
                <Link to="/study-bit" onClick={collapseAll}>
                  <BookAlert size={18} className="me-2" />
                  {t("Study Bit")}
                </Link>
              </li>
              {/* <li>
                <Link to="/#" className="has-arrow">
                  <DollarSign size={18} className="align-middle me-2" />
                  <span>{t("Finance")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/admin/revenue">{t("Revenue")}</Link>
                  </li>
                  <li>
                    <Link to="/admin/payouts">{t("Payouts")}</Link>
                  </li>
                  <li>
                    <Link to="/admin/transactions">{t("Transactions")}</Link>
                  </li>
                  <li>
                    <Link to="/admin/invoices">{t("Invoices")}</Link>
                  </li>
                </ul>
              </li> */}

            </>
          )}

          {/* COMMON FOOTER MENUS */}
          <li className="menu-title">{t("Personal")}</li>
          <li>
            <Link to="/profile" onClick={collapseAll}>
              <User size={18} className="me-2" />
              {t("Profile")}
            </Link>
          </li>
          <li>
            <Link to="/all-notification" onClick={collapseAll}>
              <Bell size={18} className="me-2" />
              {t("Notifications")}
              <span className="badge bg-danger rounded-pill float-end">5</span>
            </Link>
          </li>
          <li>
            <Link to="/help" onClick={collapseAll}>
              <HelpCircle size={18} className="me-2" />
              {t("Help Center")}
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={collapseAll}>
              <Settings size={18} className="me-2" />
              {t("Settings")}
            </Link>
          </li>
        </ul>
      </div>
    </SimpleBar>
  );
};

SidebarContent.propTypes = { t: PropTypes.func };
export default withTranslation()(SidebarContent);