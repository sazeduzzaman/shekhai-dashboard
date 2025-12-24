import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Eye, EyeSlash, ArrowLeft, PersonPlus } from "react-bootstrap-icons";

const InstructorAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  document.title = "Add Instructor | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "instructor", // Set as default for this page
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Include at least one uppercase letter")
        .matches(/[a-z]/, "Include at least one lowercase letter")
        .matches(/\d/, "Include at least one number")
        .matches(/[@$!%*?&]/, "Include at least one special character")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://shekhai-server-production.up.railway.app/api/v1/auth/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success("Instructor account created successfully! 🎉");
          resetForm();
          setTimeout(() => {
            navigate("/instructors"); // Redirect back to instructor list
          }, 2000);
        } else {
          toast.error(data.message || "Registration failed");
        }
      } catch (error) {
        toast.error("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="page-content">
      <ToastContainer position="top-right" />
      <div className="container-fluid">
        <Breadcrumbs title="Instructors" breadcrumbItem="Add New Instructor" />

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="avatar-xs me-3">
                    <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                      <PersonPlus size={18} />
                    </span>
                  </div>
                  <h5 className="mb-0">Instructor Registration</h5>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="me-1" /> Back
                </button>
              </div>

              <div className="card-body p-4">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        className={`form-control ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="instructor@example.com"
                        className={`form-control ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          className={`form-control ${
                            formik.touched.password && formik.errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("password")}
                        />
                        <button
                          className="btn btn-outline-light border text-muted"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlash size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        {formik.touched.password && formik.errors.password && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hidden/Locked Role Field (Visual confirmation only) */}
                    <div className="col-md-12 mb-4">
                      <label className="form-label fw-semibold">
                        Assigned Role
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value="Instructor"
                        disabled
                      />
                      <small className="text-muted">
                        New accounts are automatically assigned the instructor
                        role on this page.
                      </small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 border-top pt-4">
                    <button
                      type="button"
                      className="btn btn-light px-4"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating Account...
                        </>
                      ) : (
                        "Create Instructor"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAdd;
