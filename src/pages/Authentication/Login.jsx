import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoaderIcon } from "react-hot-toast";
import {
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Shield,
  XCircle,
} from "react-feather";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  document.title = "Login | Shekhai LMS";

  // Check if user is already logged in and token is valid
  useEffect(() => {
    const checkAuthStatus = () => {
      const saved = localStorage.getItem("authUser");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (!parsed.token) {
            localStorage.removeItem("authUser");
            return;
          }

          // Check if token has expired
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            localStorage.removeItem("authUser");
            setSessionExpired(true);
            toast.info(
              <div className="d-flex align-items-center">
                <Clock className="me-2" />
                <span>Your session has expired. Please login again.</span>
              </div>,
              {
                autoClose: 5000,
                closeOnClick: false,
                draggable: false,
                onClose: () => setSessionExpired(false),
              }
            );
          } else {
            // Token is still valid, redirect to dashboard
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
          localStorage.removeItem("authUser");
        }
      }
    };

    checkAuthStatus();

    // Check every minute for token expiration
    const interval = setInterval(checkAuthStatus, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://shekhai-server.onrender.com/api/v1/auth/login",
          values,
          {
            timeout: 10000, // 10 second timeout
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { token, user, message } = response.data;
        console.log(message, "message");
        if (!token || !user) {
          throw new Error("Invalid response from server");
        }

        // Calculate expiration time (1 hour from now)
        const expiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        // Store auth data
        localStorage.setItem(
          "authUser",
          JSON.stringify({
            token,
            user,
            expiresAt,
            rememberMe: values.rememberMe,
          })
        );

        // Show success toast
        toast.success(
          <div className="d-flex align-items-center">
            <CheckCircle className="me-2" size={20} />
            <div>
              <strong>Login Successful!</strong>
              <div className="small">Welcome back, {user.name}!</div>
            </div>
          </div>,
          {
            autoClose: 3000,
            onClose: () => navigate("/dashboard"),
          }
        );
      } catch (error) {
        console.error("Login error:", error);

        let errorMessage = "Login failed. Please try again.";

        if (error.response) {
          // Server responded with error
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Request made but no response
          if (error.code === "ECONNABORTED") {
            errorMessage =
              "Request timeout. Please check your internet connection.";
          } else {
            errorMessage = "Network error. Please check your connection.";
          }
        } else if (error.message) {
          // Error in request setup
          errorMessage = error.message;
        }

        toast.error(
          <div className="d-flex align-items-center">
            <XCircle className="me-2" size={20} />
            <div>
              <strong>Login Failed</strong>
              <div className="small">{errorMessage}</div>
            </div>
          </div>,
          {
            autoClose: 5000,
            closeOnClick: false,
          }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            {/* Logo/Header */}
            <div className="text-center mb-2">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div className="bg-white rounded-circle p-3 shadow-lg me-3">
                  <Shield size={32} className="text-primary" />
                </div>
                <div className="text-start">
                  <h1 className="h2 text-white fw-bold mb-1">Shekhai LMS</h1>
                  <p className="text-white-50 mb-0">
                    Learning Management System
                  </p>
                </div>
              </div>

              {sessionExpired && (
                <div className="alert alert-warning border-0 shadow-sm animate__animated animate__fadeIn">
                  <div className="d-flex align-items-center">
                    <Clock className="me-2" />
                    <div>
                      <strong>Session Expired</strong>
                      <div className="small">
                        Your session has ended. Please login again.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <div className="avatar-xl bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                    <LogIn size={32} className="text-primary" />
                  </div>
                  <h2 className="fw-bold text-dark">Welcome Back</h2>
                  <p className="text-muted">
                    Sign in to continue to your account
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark d-flex align-items-center">
                      <Mail size={16} className="me-2" />
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control border-start-0 ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        disabled={loading}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback d-flex align-items-center">
                        {/* <AlertCircle size={14} className="me-1" /> */}
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark d-flex align-items-center">
                      <Lock size={16} className="me-2" />
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control border-start-0 ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback d-flex align-items-center">
                        {/* <AlertCircle size={14} className="me-1" /> */}
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        onChange={formik.handleChange}
                        checked={formik.values.rememberMe}
                        disabled={loading}
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none text-primary fw-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-bold py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <LoaderIcon className="me-2 animate-spin" size={20} />
                          Logging in...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <LogIn className="me-2" size={20} />
                          Login to Dashboard
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="position-relative my-4">
                    <div className="border-top"></div>
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      OR
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{" "}
                      <Link
                        to="#"
                        className="text-decoration-none fw-bold text-primary"
                      >
                        Contact Admin to Register
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-5">
              <p className="text-white-50 mb-2">
                © {new Date().getFullYear()} Shekhai LMS. All rights reserved.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="text-white-50 text-decoration-none">
                  Terms
                </a>
                <a href="#" className="text-white-50 text-decoration-none">
                  Privacy
                </a>
                <a href="#" className="text-white-50 text-decoration-none">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Login;
