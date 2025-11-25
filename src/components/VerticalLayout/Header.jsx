import PropTypes from "prop-types";
import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logoMain from "/images/logo.webp";
import logoLightSvg from "/images/logo.webp";

// i18n
import { withTranslation } from "react-i18next";

const Header = ({ t }) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };

  const toggleSidebar = () => {
    const body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  };

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box d-lg-none d-md-block">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logoMain} alt="Logo" height="22" />
              </span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src={logoLightSvg} alt="Logo" height="22" />
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="btn btn-sm px-3 font-size-16 header-item"
            id="vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars" />
          </button>

          <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder={`${t("Search")}...`}
              />
              <span className="bx bx-search-alt" />
            </div>
          </form>
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              type="button"
              className="btn header-item noti-icon"
              id="page-header-search-dropdown"
            >
              <i className="mdi mdi-magnify" />
            </button>

            <div
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${
                searchVisible ? "show" : ""
              }`}
              aria-labelledby="page-header-search-dropdown"
            >
              <form className="p-3">
                <div className="form-group m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                      aria-label="Search"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="btn header-item noti-icon"
              data-toggle="fullscreen"
            >
              <i className="bx bx-fullscreen" />
            </button>
          </div>

          <NotificationDropdown />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  t: PropTypes.any.isRequired,
};

export default connect()(withTranslation()(Header));
