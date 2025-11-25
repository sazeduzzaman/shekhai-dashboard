import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddCategory = () => {
  const navigate = useNavigate();
  document.title = "Add Category | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      courseName: "",
      instructor: "",
      category: "",
      students: "",
      createdAt: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      courseName: Yup.string().min(2).required("Required"),
      instructor: Yup.string().min(2).required("Required"),
      category: Yup.string().required("Required"),
      students: Yup.number().typeError("Must be a number").required("Required"),
      createdAt: Yup.date().typeError("Invalid date").required("Required"),
      status: Yup.string().oneOf(["Active", "Inactive"]),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Course Submitted:", values);
      alert("Course added successfully!");
      resetForm();
    },
  });

  return (
    <div className="container my-5">
      <Breadcrumbs title="Categories" breadcrumbItem="Add Category" />

      <div className="card shadow-sm rounded-4 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Course Category</h3>
            <small className="text-muted">
              Fill the form below to add a new course.
            </small>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            &larr; Back To List
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Course Name</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.courseName && formik.errors.courseName
                    ? "is-invalid"
                    : ""
                }`}
                name="courseName"
                value={formik.values.courseName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter course name"
              />
              {formik.touched.courseName && formik.errors.courseName && (
                <div className="invalid-feedback">{formik.errors.courseName}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Instructor</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.instructor && formik.errors.instructor
                    ? "is-invalid"
                    : ""
                }`}
                name="instructor"
                value={formik.values.instructor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter instructor name"
              />
              {formik.touched.instructor && formik.errors.instructor && (
                <div className="invalid-feedback">{formik.errors.instructor}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.category && formik.errors.category
                    ? "is-invalid"
                    : ""
                }`}
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter category"
              />
              {formik.touched.category && formik.errors.category && (
                <div className="invalid-feedback">{formik.errors.category}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Enrolled Students</label>
              <input
                type="number"
                className={`form-control ${
                  formik.touched.students && formik.errors.students
                    ? "is-invalid"
                    : ""
                }`}
                name="students"
                value={formik.values.students}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter number of students"
              />
              {formik.touched.students && formik.errors.students && (
                <div className="invalid-feedback">{formik.errors.students}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Created At</label>
              <input
                type="date"
                className={`form-control ${
                  formik.touched.createdAt && formik.errors.createdAt
                    ? "is-invalid"
                    : ""
                }`}
                name="createdAt"
                value={formik.values.createdAt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.createdAt && formik.errors.createdAt && (
                <div className="invalid-feedback">{formik.errors.createdAt}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-primary px-4" type="submit">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
