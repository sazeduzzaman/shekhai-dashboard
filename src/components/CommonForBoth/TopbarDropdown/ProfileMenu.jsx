import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import withRouter from "../../Common/withRouter";
import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState("Guest");

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check token expiry
      if (Date.now() < parsed.expiresAt) {
        // Show name or email
        setUsername(parsed.user.name || parsed.user.email);
      } else {
        localStorage.removeItem("authUser");
        setUsername("Guest");
      }
    }
  }, [props.success]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="d-inline-block"
    >
      <DropdownToggle
        className="btn header-item"
        id="page-header-user-dropdown"
        tag="button"
      >
        <img
          className="rounded-circle header-profile-user"
          src={user1}
          alt="Header Avatar"
        />
        <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
        <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem tag="a" href="/profile">
          <i className="bx bx-user font-size-16 align-middle me-1" />
          {props.t("Profile")}
        </DropdownItem>

        <DropdownItem tag="a" href="#">
          <span className="badge bg-success float-end">11</span>
          <i className="bx bx-wrench font-size-16 align-middle me-1" />
          {props.t("Settings")}
        </DropdownItem>
        <div className="dropdown-divider" />

        {/* Logout Button */}
        <button
          className="dropdown-item text-danger"
          type="button"
          onClick={handleLogout}
        >
          <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
          <span>{props.t("Logout")}</span>
        </button>
      </DropdownMenu>
    </Dropdown>
  );
};

ProfileMenu.propTypes = {
  t: PropTypes.func.isRequired, // i18next translation function
  success: PropTypes.any, // Redux prop
};

ProfileMenu.defaultProps = {
  success: null,
};

const mapStateToProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {})(withTranslation()(ProfileMenu))
);
