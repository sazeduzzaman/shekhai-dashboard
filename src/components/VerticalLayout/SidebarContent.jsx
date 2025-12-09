import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";

// Make sure to import these in your App or index.js
// import 'simplebar-react/dist/simplebar.min.css';
// import 'metismenujs/dist/metismenujs.css';
// import 'boxicons/css/boxicons.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarContent = ({ t }) => {
  const ref = useRef();
  const location = useLocation();

  // Get user role from localStorage
  const auth = JSON.parse(localStorage.getItem("authUser"));
  const userRole = auth?.user?.role || "instructor";

  const scrollElement = (item) => {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  const activateParentDropdown = useCallback((item) => {
    if (!item) return;

    item.classList.add("active");
    let parent = item.parentElement;

    while (parent && parent.id !== "side-menu") {
      const childMenu = parent.childNodes[1];
      if (childMenu) childMenu.classList.add("mm-show");
      parent.classList.add("mm-active");

      if (parent.tagName === "LI") {
        const link = parent.childNodes[0];
        if (link) link.classList.add("mm-active");
      }
      parent = parent.parentElement;
    }

    scrollElement(item);
  }, []);

  const removeActivation = (items) => {
    Array.from(items).forEach((item) => {
      const parent = item.parentElement;
      item.classList.remove("active");

      if (parent) {
        const childMenu = parent.childNodes?.length > 1 ? parent.childNodes[1] : null;
        if (childMenu && childMenu.id !== "side-menu") {
          childMenu.classList.remove("mm-show");
        }
        parent.classList.remove("mm-active");

        let ancestor = parent.parentElement;
        while (ancestor && ancestor.id !== "side-menu") {
          ancestor.classList.remove("mm-show", "mm-active");
          if (ancestor.childNodes[0]) ancestor.childNodes[0].classList.remove("mm-active");
          ancestor = ancestor.parentElement;
        }
      }
    });
  };

  const activeMenu = useCallback(() => {
    const pathName = location.pathname;
    const ul = document.getElementById("side-menu");
    if (!ul) return;

    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    const matchingMenuItem = Array.from(items).find(
      (item) => item.pathname === pathName
    );

    if (matchingMenuItem) activateParentDropdown(matchingMenuItem);
  }, [location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current?.recalculate();
  }, []);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();
    return () => metisMenu.dispose();
  }, [activeMenu]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  return (
    <SimpleBar style={{ maxHeight: "100vh" }} ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {/* Dashboard */}
          <li>
            <Link to="/dashboard">
              <i className="bx bx-home"></i>
              <span>{t("Dashboard")}</span>
            </Link>
          </li>

          {/* Course Categories */}
          <li>
            <Link to="/#" className="has-arrow">
              <i className="bx bx-building"></i>
              <span>{t("Course Categories")}</span>
            </Link>
            <ul className="sub-menu" aria-expanded="false">
              <li>
                <Link to="/all-categories">{t("All Categories")}</Link>
              </li>
              <li>
                <Link to="/categories/add">{t("Add Category")}</Link>
              </li>
            </ul>
          </li>

          {/* Users - only admin */}
          {userRole === "admin" && (
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user"></i>
                <span>{t("Users")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/users">{t("All Users")}</Link>
                </li>
                <li>
                  <Link to="/users/add">{t("Add Users")}</Link>
                </li>
              </ul>
            </li>
          )}

          {/* Courses */}
          <li>
            <Link to="/#" className="has-arrow">
              <i className="bx bx-book"></i>
              <span>{t("Courses")}</span>
            </Link>
            <ul className="sub-menu" aria-expanded="false">
              <li>
                <Link to="/all-courses">{t("All Courses")}</Link>
              </li>
              <li>
                <Link to="/courses/add">{t("Add Course")}</Link>
              </li>
            </ul>
          </li>

          {/* Assignments & Exams */}
          <li>
            <Link to="/#" className="has-arrow">
              <i className="bx bx-task"></i>
              <span>{t("Assignments & Exams")}</span>
            </Link>
            <ul className="sub-menu" aria-expanded="false">
              <li>
                <Link to="/assignments">{t("All Assignments")}</Link>
              </li>
              <li>
                <Link to="/assignments/add">{t("Add Assignment")}</Link>
              </li>
              <li>
                <Link to="/exams">{t("All Exams")}</Link>
              </li>
              <li>
                <Link to="/exams/add">{t("Add Exam")}</Link>
              </li>
            </ul>
          </li>

          {/* Reports */}
          <li>
            <Link to="/reports">
              <i className="bx bx-bar-chart-alt-2"></i>
              <span>{t("Reports")}</span>
            </Link>
          </li>

          {/* Settings - only admin */}
          {userRole === "admin" && (
            <li>
              <Link to="/settings">
                <i className="bx bx-cog"></i>
                <span>{t("Settings")}</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </SimpleBar>
  );
};

SidebarContent.propTypes = {
  t: PropTypes.func,
};

export default withTranslation()(SidebarContent);
