import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  XCircle,
  Lock,
  Mail,
  User,
  Star,
} from "react-feather";
import axiosInstance, { isSessionValid } from "../../utils/axiosInstance";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Add this import

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [activeInput, setActiveInput] = useState("");

  document.title = "Login | Shekhai LMS";

  /** Check for session expired flag from URL */
  useEffect(() => {
    // Check if redirected due to session expiration
    if (searchParams.get('sessionExpired') === 'true') {
      setSessionExpired(true);
      toast.info(
        <div className="d-flex align-items-center">
          <Clock className="me-2" />
          <span>Your session has expired. Please login again.</span>
        </div>,
        { autoClose: 4000 }
      );

      // Clear the URL parameter
      navigate('/login', { replace: true });
    }

    // If already logged in, redirect to dashboard
    if (isSessionValid()) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, searchParams]);

  /** Formik - Keep the same but update success handler */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // ✅ Use axios without instance for login (no auth required)
        const response = await axios.post(
          "https://shekhai-server.onrender.com/api/v1/auth/login",
          values
        );

        const { token, user } = response.data;

        // Calculate expiration
        const expiresAt = values.rememberMe
          ? Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days
          : Date.now() + 24 * 60 * 60 * 1000;     // 24 hours

        // Save to localStorage
        localStorage.setItem(
          "authUser",
          JSON.stringify({ token, user, expiresAt })
        );

        // ✅ CRITICAL: Set default header for axiosInstance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast.success(
          <div className="d-flex align-items-center">
            <CheckCircle className="me-2" />
            <div>
              <strong>Login Successful</strong>
              <div className="small">Welcome back, {user.name}</div>
            </div>
          </div>,
          {
            autoClose: 500,
            onClose: () => {
              const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
              sessionStorage.removeItem('redirectAfterLogin');
              navigate(redirectPath, { replace: true });
            },
          }
        );

      } catch (error) {
        toast.error(
          <div className="d-flex align-items-center">
            <XCircle className="me-2" />
            <span>
              {error.response?.data?.message || "Login failed"}
            </span>
          </div>
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="login-wrapper">
      <ToastContainer theme="colored" position="top-center" />

      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="container-fluid h-100">
        <div className="row h-100 align-items-center justify-content-center">

          {/* Right Side - Login Form */}
          <div className="col-lg-12 h-100">
            <div className="hero-content text-center px-5">
              <div className="mb-2">
                <div className="logo-container mb-4">
                  <div className="logo-icon">
                    <Shield size={48} className="text-white" />
                  </div>
                  <Star className="sparkle-1" size={20} />
                  <Star className="sparkle-2" size={16} />
                  <Star className="sparkle-3" size={18} />
                </div>

                <h1 className="hero-title display-4 fw-bold mb-3">
                  Welcome to <span className="gradient-text">Shekhai LMS</span>
                </h1>

                <p className="hero-subtitle fs-5 text-white">
                  Transform your learning experience with our comprehensive
                  Learning Management System
                </p>
              </div>
            </div>
            <div className="login-card-container d-flex justify-content-center mx-auto">
              <div className="login-card">
                <div className="card-header text-center mb-4 border-0">
                  <div className="avatar-circle bg-gradient-primary mb-3">
                    <User size={28} className="text-white" />
                  </div>
                  <h2 className="fw-bold mb-2">Sign In</h2>
                  <p className="text-white mb-0">
                    Enter your credentials to access your account
                  </p>
                </div>

                {sessionExpired && (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <Clock size={16} className="me-2" />
                    Session expired. Please login again.
                    <button type="button" className="btn-close" onClick={() => setSessionExpired(false)} />
                  </div>
                )}

                <form onSubmit={formik.handleSubmit} className="px-4">
                  {/* Email Input */}
                  <div className="form-group mb-4">
                    <label className="form-label fw-medium mb-2 d-flex align-items-center">
                      <Mail size={16} className="me-2" />
                      Email Address
                    </label>
                    <div className={`input-group ${activeInput === 'email' ? 'active' : ''}`}>
                      <span className="input-group-text">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        {...formik.getFieldProps("email")}
                        disabled={loading}
                        onFocus={() => setActiveInput('email')}
                        onBlur={() => setActiveInput('')}
                        placeholder="Enter your email"
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <div className="error-message mt-2">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="form-group mb-4">
                    <label className="form-label fw-medium mb-2 d-flex align-items-center">
                      <Lock size={16} className="me-2" />
                      Password
                    </label>
                    <div className={`input-group ${activeInput === 'password' ? 'active' : ''}`}>
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        {...formik.getFieldProps("password")}
                        disabled={loading}
                        onFocus={() => setActiveInput('password')}
                        onBlur={() => setActiveInput('')}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="error-message mt-2">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        {...formik.getFieldProps("rememberMe")}
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none forgot-password">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100 fw-bold d-flex align-items-center justify-content-center py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="me-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
          display:flex;
          align-items:center;
        }

        .animated-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 15s infinite linear;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
        }

        .hero-content {
          z-index: 1;
          position: relative;
        }

        .logo-container {
          position: relative;
          display: inline-block;
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .sparkle-1, .sparkle-2, .sparkle-3 {
          position: absolute;
          color: #ffd700;
          animation: sparkle 2s infinite;
        }

        .sparkle-1 { top: -10px; right: -10px; }
        .sparkle-2 { bottom: -5px; left: -15px; animation-delay: 0.5s; }
        .sparkle-3 { top: 50%; right: -20px; animation-delay: 1s; }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .hero-title {
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .gradient-text {
          background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          max-width: 600px;
          margin: 0 auto;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }

        .stat-number {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin: 0;
        }

        .features-list {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-item {
          color: white;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        .feature-item:last-child {
          margin-bottom: 0;
        }

        .login-card-container {
          width: 100%;
          max-width: 450px;
          padding: 20px;
          z-index: 1;
        }

        .login-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .card-header {
          padding: 40px 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .avatar-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 4px solid rgba(255, 255, 255, 0.2);
        }

        .form-group .input-group {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .form-group .input-group.active {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group .input-group-text {
          background: transparent;
          border: none;
          color: #667eea;
        }

        .form-group .form-control {
          border: none;
          padding: 12px;
          font-size: 15px;
        }

        .form-group .form-control:focus {
          box-shadow: none;
        }

        .password-toggle {
          border: none;
          background: transparent;
          color: #667eea;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .error-message {
          color: #ff4757;
          font-size: 13px;
          font-weight: 500;
        }

        .forgot-password {
          color: #667eea;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .btn-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-gradient-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-gradient-primary:disabled {
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 992px) {
          .hero-content {
            padding: 40px 20px;
          }
          
          .login-card-container {
            padding: 15px;
          }
        }

        /* Create particles */
        ${[...Array(20)].map((_, i) => `
          .particle:nth-child(${i + 1}) {
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${Math.random() * 10 + 10}s;
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default Login;