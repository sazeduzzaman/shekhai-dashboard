import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
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
  BarChart2,
  Settings,
  Award,
  Calendar,
  MessageSquare,
  Video,
  DollarSign,
  Globe,
  HelpCircle,
  Star,
  Layers,
  Bell,
  User,
  PlayCircle,
} from "react-feather";

const SidebarContent = ({ t }) => {
  const ref = useRef();
  const location = useLocation();

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

  // Helper to remove all active classes before applying new ones
  const removeActivation = (items) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.classList.remove("active");
      const parent = item.parentElement;
      if (parent) {
        parent.classList.remove("mm-active");
        const subMenu = parent.querySelector("ul");
        if (subMenu) subMenu.classList.remove("mm-show");
      }
    }
  };

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
          const anchor = parentLi.querySelector("a");
          if (anchor) anchor.classList.add("mm-active");
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
    removeActivation(items);

    let matchingMenuItem = null;
    for (let i = 0; i < items.length; i++) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [location.pathname, activateParentDropdown]);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();
    return () => metisMenu.dispose();
  }, [activeMenu, userRole]); // Re-init if role changes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  return (
    <SimpleBar style={{ maxHeight: "100vh" }} ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{t("Main")}</li>
          <li>
            <Link to="/dashboard">
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
                  <li>
                    <Link to="/student/continue-courses">
                      <PlayCircle size={16} className="me-2" />
                      {t("Continue Learning")}
                    </Link>
                  </li>
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
              {/* <li>
                <Link to="/#" className="has-arrow">
                  <BarChart2 size={18} className="align-middle me-2" />
                  <span>{t("Grades & Progress")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/student/grades">{t("My Grades")}</Link>
                  </li>
                  <li>
                    <Link to="/student/progress">{t("Learning Progress")}</Link>
                  </li>
                  <li>
                    <Link to="/student/certificates">{t("Achievements")}</Link>
                  </li>
                  <li>
                    <Link to="/student/analytics">{t("Study Analytics")}</Link>
                  </li>
                </ul>
              </li> */}
              <li>
                <Link to="/#">
                  <Calendar size={18} className="me-2" />
                  {t("Calendar")}
                </Link>
              </li>
              {/* <li>
                <Link to="/#" className="has-arrow">
                  <Users size={18} className="align-middle me-2" />
                  <span>{t("Study Groups")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/student/groups">{t("My Groups")}</Link>
                  </li>
                  <li>
                    <Link to="/student/groups/discover">
                      {t("Discover Groups")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/student/forum">{t("Discussion Forum")}</Link>
                  </li>
                </ul>
              </li> */}
              {/* <li>
                <Link to="/student/messages">
                  <MessageSquare size={18} className="me-2" />
                  <span>{t("Messages")}</span>
                  <span className="badge bg-danger rounded-pill float-end">
                    3
                  </span>
                </Link>
              </li> */}
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
                  {/* <li>
                    <Link to="/instructor/courses/draft">{t("Drafts")}</Link>
                  </li> */}
                  {/* <li>
                    <Link to="/instructor/courses/analytics">
                      {t("Course Analytics")}
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <Video size={18} className="align-middle me-2" />
                  <span>{t("Content")}</span>
                </Link>
                <ul className="sub-menu">
                  {/* <li>
                    <Link to="/instructor/lessons">{t("Lessons")}</Link>
                  </li> */}
                  <li>
                    <Link to="/instructor/quizzes">{t("Quizzes")}</Link>
                  </li>
                  {/* <li>
                    <Link to="/instructor/resources">{t("Resources")}</Link>
                  </li> */}
                  <li>
                    <Link to="/instructor/announcements">
                      {t("Announcements")}
                    </Link>
                  </li>
                </ul>
              </li>
              {/* <li>
                <Link to="/#" className="has-arrow">
                  <FileText size={18} className="align-middle me-2" />
                  <span>{t("Assessments")}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/instructor/assignments">{t("Assignments")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/assignments/grade">
                      {t("Grade Assignments")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/instructor/exams">{t("Exams")}</Link>
                  </li>
                  <li>
                    <Link to="/instructor/grades">{t("Gradebook")}</Link>
                  </li>
                </ul>
              </li> */}
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
                <Link to="/instructor/enrolled/students/live-session">
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
              {/* <li>
                <Link to="/instructor/reviews">
                  <Star size={18} className="me-2" />
                  {t("Reviews")}
                </Link>
              </li> */}
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
                  <li>
                    <Link to="/courses/review">{t("Course Reviews")}</Link>
                  </li>
                  <li>
                    <Link to="/courses/approval">{t("Approval Queue")}</Link>
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
                    <Link to="/instructors/verification">
                      {t("Verification")}
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/instructors/performance">
                      {t("Performance")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/contacts-list">
                  <Settings size={18} className="me-2" />
                  {t("Contact List")}
                </Link>
              </li>
              <li>
                <Link to="/webinar-management">
                  <Settings size={18} className="me-2" />
                  {t("Webinar Management")}
                </Link>
              </li>
              <li>
                <Link to="/mentor-room">
                  <Settings size={18} className="me-2" />
                  {t("Mentor RoomManagement")}
                </Link>
              </li>
              <li>
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
              </li>
            </>
          )}

          {/* COMMON FOOTER MENUS */}
          <li className="menu-title">{t("Personal")}</li>
          <li>
            <Link to="/profile">
              <User size={18} className="me-2" />
              {t("Profile")}
            </Link>
          </li>
          <li>
            <Link to="/all-notification">
              <Bell size={18} className="me-2" />
              {t("Notifications")}
              <span className="badge bg-danger rounded-pill float-end">5</span>
            </Link>
          </li>
          <li>
            <Link to="/help">
              <HelpCircle size={18} className="me-2" />
              {t("Help Center")}
            </Link>
          </li>
          <li>
            <Link to="/settings">
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
