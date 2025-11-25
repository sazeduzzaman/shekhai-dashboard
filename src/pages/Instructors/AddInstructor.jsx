import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddInstructor = () => {
  const navigate = useNavigate();
  document.title = "Add Instructor | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "Instructor",
      status: "Active",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      role: Yup.string().oneOf(["Instructor", "Admin"]).required("Required"),
      status: Yup.string().oneOf(["Active", "Inactive"]).required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Instructor Submitted:", values);
      alert("Instructor added successfully!");
      resetForm();
    },
  });

  return (
    <div className="container my-5">
      <Breadcrumbs title="Instructors" breadcrumbItem="Add Instructor" />

      <div className="card shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Instructor</h3>
            <small className="text-muted">
              Fill the form below to add a new instructor.
            </small>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            &larr; Back To List
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                placeholder="Enter instructor name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-control ${
                  formik.touched.email && formik.errors.email ? "is-invalid" : ""
                }`}
                placeholder="Enter instructor email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                className="form-select"
              >
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary px-4">
              Add Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
