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
import axios from "axios";
import avatar from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = ({ t, success }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const saved = localStorage.getItem("authUser");

        if (!saved) {
          return;
        }

        const parsed = JSON.parse(saved);
        const token = parsed?.token;

        // Check token expiry
        if (!parsed.expiresAt || Date.now() < parsed.expiresAt) {
          // Set initial data from localStorage
          const localUser = parsed.user || {};
          setUsername(localUser.name || localUser.email || "Guest");
          setRole(localUser.role || "");
          setAvatarUrl(localUser.avatarUrl || localUser.avatar || "");

          // Fetch updated user data from API if token exists
          if (token) {
            setLoading(true);
            try {
              const res = await axios.get(
                "https://shekhai-server.up.railway.app/api/v1/users/me",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (res.data.success && res.data.user) {
                const userData = res.data.user;

                // Update states with API data
                setUsername(userData.name || userData.email || "Guest");
                setRole(userData.role || "");

                // Try different possible avatar fields
                const possibleAvatarFields = [
                  "avatarUrl",
                  "avatar",
                  "profileImage",
                  "image",
                  "profilePicture",
                  "picture",
                ];

                for (const field of possibleAvatarFields) {
                  if (userData[field]) {
                    setAvatarUrl(userData[field]);
                    break;
                  }
                }
              }
            } catch (apiErr) {
              console.error("API fetch error:", apiErr);
              // Keep using localStorage data if API fails
            } finally {
              setLoading(false);
            }
          }
        } else {
          // Expired token
          localStorage.removeItem("authUser");
          setUsername("Guest");
          setRole("");
          setAvatarUrl("");
        }
      } catch (parseErr) {
        console.error("Error parsing auth data:", parseErr);
        localStorage.removeItem("authUser");
        setUsername("Guest");
        setRole("");
        setAvatarUrl("");
      }
    };

    fetchUserProfile();
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
        <div className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={avatarUrl || avatar}
            alt="User Avatar"
            onError={(e) => {
              e.currentTarget.src = avatar;
            }}
            style={{
              width: "38px",
              height: "38px",
              objectFit: "cover",
              border: "2px solid #dee2e6",
            }}
          />
          <div className="d-none d-xl-inline-block ms-2 text-start">
            <div className="fw-medium">{username}</div>
            {role && (
              <div className="small text-muted">
                {role}
                {loading && (
                  <span className="ms-1 spinner-border spinner-border-sm"></span>
                )}
              </div>
            )}
          </div>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </div>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem tag={Link} to="/profile">
          <i className="bx bx-user font-size-16 align-middle me-2" />
          {t("Profile")}
        </DropdownItem>

        <DropdownItem tag={Link} to="/settings">
          <i className="bx bx-wrench font-size-16 align-middle me-2" />
          {t("Settings")}
          <span className="badge bg-success float-end ms-2">11</span>
        </DropdownItem>

        <div className="dropdown-divider" />

        <DropdownItem
          tag="button"
          className="text-danger"
          onClick={handleLogout}
        >
          <i className="bx bx-power-off font-size-16 align-middle me-2 text-danger" />
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
