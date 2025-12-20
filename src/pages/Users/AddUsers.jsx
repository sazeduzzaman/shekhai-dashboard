import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // You can use any icon library

const AddUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  document.title = "Add Users | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "instructor", // lowercase for backend
    },

    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),

      email: Yup.string().email("Invalid email").required("Required"),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/\d/, "Must include at least one number")
        .matches(/[@$!%*?&]/, "Must include at least one special character")
        .required("Required"),

      role: Yup.string()
        .oneOf(["student", "instructor", "admin"])
        .required("Required"),
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
          toast.success("User created successfully! 🎉");
          resetForm();

          setTimeout(() => {
            navigate("/users"); // redirect after success
          }, 3000);
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error! Try again later.");
      }

      setLoading(false);
    },
  });

  return (
    <div className="container my-5">
      <ToastContainer />

      <Breadcrumbs title="Instructors" breadcrumbItem="Add Instructor" />

      <div className="card shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New User</h3>
            <small className="text-muted">
              Fill the form to create an instructor.
            </small>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            ← Back To List
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            {/* NAME */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className={`form-control ${
                  formik.touched.name && formik.errors.name && "is-invalid"
                }`}
                {...formik.getFieldProps("name")}
                placeholder="Enter full name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            {/* EMAIL */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${
                  formik.touched.email && formik.errors.email && "is-invalid"
                }`}
                {...formik.getFieldProps("email")}
                placeholder="Enter email address"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="col-md-6 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("password")}
                placeholder="Strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 pt-4"
                style={{ border: "none", background: "transparent" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            {/* ROLE */}
            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                {...formik.getFieldProps("role")}
              >
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating...
                </>
              ) : (
                "Add Instructor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
