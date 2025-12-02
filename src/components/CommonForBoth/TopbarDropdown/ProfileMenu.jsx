import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import userAvatar from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = ({ t, success }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState(""); // <-- Role state added

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("authUser");

    if (saved) {
      const parsed = JSON.parse(saved);

      // Check expiry
      if (!parsed.expiresAt || Date.now() < parsed.expiresAt) {
        setUsername(parsed.user?.name || parsed.user?.email || "Guest");
        setRole(parsed.user?.role || ""); // <-- Read role here
      } else {
        // Expired token
        localStorage.removeItem("authUser");
        setUsername("Guest");
        setRole("");
      }
    }
  }, [success]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <Dropdown
      isOpen={menuOpen}
      toggle={() => setMenuOpen(!menuOpen)}
      className="d-inline-block"
    >
      <DropdownToggle className="btn header-item" tag="button">
        <img
          className="rounded-circle header-profile-user"
          src={userAvatar}
          alt="User Avatar"
        />
        <span className="d-none d-xl-inline-block ms-2 me-1">
          {username}{" "}
          {role && <span className="text-muted">({role})</span>} {/* Show role */}
        </span>
        <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem tag={Link} to="/profile">
          <i className="bx bx-user font-size-16 align-middle me-1" />
          {t("Profile")}
        </DropdownItem>

        <DropdownItem tag={Link} to="/settings">
          <span className="badge bg-success float-end">11</span>
          <i className="bx bx-wrench font-size-16 align-middle me-1" />
          {t("Settings")}
        </DropdownItem>

        <div className="dropdown-divider" />

        <DropdownItem
          tag="button"
          className="text-danger"
          onClick={handleLogout}
        >
          <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
          {t("Logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const mapStateToProps = (state) => ({
  success: state.Profile.success,
  error: state.Profile.error,
});

export default connect(mapStateToProps)(withTranslation()(ProfileMenu));
