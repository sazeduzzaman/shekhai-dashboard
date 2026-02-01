import PropTypes from "prop-types";
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";
import withRouter from "../Common/withRouter";

// Redux Actions
import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
} from "/src/store/actions";

// Constants
const MOBILE_USER_AGENTS = /iPhone|iPad|iPod|Android/i;

// Layout Constants
const LAYOUT_TYPES = {
  DEFAULT: "default",
  CONDENSED: "condensed",
};

const PRELOADER_DURATION = 2500;

/**
 * Layout Component
 * Main application layout wrapper with header, sidebar, footer and right sidebar
 */
const Layout = (props) => {
  const dispatch = useDispatch();

  // Select layout properties from Redux store
  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      isPreloader: layout.isPreloader,
      layoutModeType: layout.layoutModeType,
      leftSideBarThemeImage: layout.leftSideBarThemeImage,
      leftSideBarType: layout.leftSideBarType,
      layoutWidth: layout.layoutWidth,
      topbarTheme: layout.topbarTheme,
      showRightSidebar: layout.showRightSidebar,
      leftSideBarTheme: layout.leftSideBarTheme,
    })
  );

  // Layout properties from Redux
  const {
    isPreloader,
    leftSideBarThemeImage,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    showRightSidebar,
    leftSideBarTheme,
    layoutModeType,
  } = useSelector(selectLayoutProperties);

  // Check if device is mobile
  const isMobile = MOBILE_USER_AGENTS.test(navigator.userAgent);

  /**
   * Toggle sidebar menu between default and condensed modes
   */
  const handleToggleMenu = useCallback(() => {
    const newType = leftSideBarType === LAYOUT_TYPES.DEFAULT
      ? LAYOUT_TYPES.CONDENSED
      : LAYOUT_TYPES.DEFAULT;

    dispatch(changeSidebarType(newType, isMobile));
  }, [leftSideBarType, isMobile, dispatch]);

  /**
   * Hide right sidebar when clicking outside of it
   */
  const hideRightSidebar = useCallback((event) => {
    const rightbar = document.getElementById("right-bar");

    if (rightbar && rightbar.contains(event.target)) {
      return;
    }

    dispatch(showRightSidebarAction(false));
  }, [dispatch]);

  /**
   * Initialize preloader with animation
   */
  const initializePreloader = useCallback(() => {
    const preloader = document.getElementById("preloader");
    const status = document.getElementById("status");

    if (isPreloader && preloader && status) {
      preloader.style.display = "block";
      status.style.display = "block";

      setTimeout(() => {
        if (preloader && status) {
          preloader.style.display = "none";
          status.style.display = "none";
        }
      }, PRELOADER_DURATION);
    } else if (preloader && status) {
      preloader.style.display = "none";
      status.style.display = "none";
    }
  }, [isPreloader]);

  /**
   * Apply layout configurations from Redux
   */
  const applyLayoutConfigurations = useCallback(() => {
    // Set initial layout
    dispatch(changeLayout("vertical"));

    // Apply sidebar theme
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }

    // Apply layout mode
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }

    // Apply sidebar theme image
    if (leftSideBarThemeImage) {
      dispatch(changeSidebarThemeImage(leftSideBarThemeImage));
    }

    // Apply layout width
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }

    // Apply sidebar type
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }

    // Apply topbar theme
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [
    dispatch,
    leftSideBarTheme,
    layoutModeType,
    leftSideBarThemeImage,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
  ]);

  // Effects

  /**
   * Initialize component
   */
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Apply layout configurations
    applyLayoutConfigurations();
  }, [applyLayoutConfigurations]);

  /**
   * Handle preloader and right sidebar click events
   */
  useEffect(() => {
    // Initialize preloader
    initializePreloader();

    // Add click event listener for right sidebar
    document.body.addEventListener("click", hideRightSidebar, true);

    // Cleanup event listener
    return () => {
      document.body.removeEventListener("click", hideRightSidebar, true);
    };
  }, [isPreloader, initializePreloader, hideRightSidebar]);

  return (
    <React.Fragment>
      {/* Preloader */}
      <div id="preloader" role="status" aria-label="Loading">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div id="layout-wrapper">
        <Header
          toggleMenuCallback={handleToggleMenu}
          aria-label="Main navigation"
        />

        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
          aria-label="Sidebar navigation"
        />

        <main className="main-content" role="main">
          {props.children}
        </main>

        <Footer />
      </div>

      {/* Right Sidebar - Conditionally Rendered */}
      {showRightSidebar && <RightSidebar />}
    </React.Fragment>
  );
};

// Prop Types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  isPreloader: PropTypes.bool,
  layoutWidth: PropTypes.string,
  leftSideBarTheme: PropTypes.string,
  leftSideBarThemeImage: PropTypes.string,
  leftSideBarType: PropTypes.string,
  location: PropTypes.object,
  showRightSidebar: PropTypes.bool,
  topbarTheme: PropTypes.string,
};

// Default Props
Layout.defaultProps = {
  isPreloader: false,
  showRightSidebar: false,
};

export default withRouter(Layout);