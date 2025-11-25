import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddStudent = () => {
  const navigate = useNavigate();
  document.title = "Add Student | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      enrollmentDate: "",
      enrolledCourses: 0,
      completedModules: 0,
      status: "Active",
      address: "",
      city: "",
      country: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().optional(),
      enrollmentDate: Yup.date().required("Required"),
      enrolledCourses: Yup.number().min(0).required("Required"),
      completedModules: Yup.number().min(0).required("Required"),
      status: Yup.string().oneOf(["Active", "Inactive"]).required("Required"),
      address: Yup.string().optional(),
      city: Yup.string().optional(),
      country: Yup.string().optional(),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Student Submitted:", values);
      alert("Student added successfully!");
      resetForm();
    },
  });

  return (
    <div className="container my-5">
      <Breadcrumbs title="Students" breadcrumbItem="Add Student" />

      <div className="card shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Student</h3>
            <small className="text-muted">
              Fill the form below to add a new student with details.
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
                placeholder="Enter student name"
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
                placeholder="Enter student email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control"
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                value={formik.values.enrollmentDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-control ${
                  formik.touched.enrollmentDate && formik.errors.enrollmentDate
                    ? "is-invalid"
                    : ""
                }`}
              />
              {formik.touched.enrollmentDate && formik.errors.enrollmentDate && (
                <div className="invalid-feedback">
                  {formik.errors.enrollmentDate}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Enrolled Courses</label>
              <input
                type="number"
                name="enrolledCourses"
                value={formik.values.enrolledCourses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-control ${
                  formik.touched.enrolledCourses && formik.errors.enrolledCourses
                    ? "is-invalid"
                    : ""
                }`}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Completed Modules</label>
              <input
                type="number"
                name="completedModules"
                value={formik.values.completedModules}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-control ${
                  formik.touched.completedModules && formik.errors.completedModules
                    ? "is-invalid"
                    : ""
                }`}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-4">
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
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
