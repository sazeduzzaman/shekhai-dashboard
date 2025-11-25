import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";

const AddCourses = () => {
  const navigate = useNavigate();
  document.title = "Add Course | LMS Dashboard";

  const formik = useFormik({
    initialValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      instructor: "",
      price: "",
      category: null,
      level: "Beginner",
      totalModules: "",
      totalDuration: "",
      enrollmentDeadline: "",
      published: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().min(2, "Too short").required("Required"),
      shortDescription: Yup.string().required("Required"),
      longDescription: Yup.string().required("Required"),
      instructor: Yup.string().min(2, "Too short").required("Required"),
      price: Yup.number().typeError("Must be a number").required("Required"),
      category: Yup.object().required("Required"),
      level: Yup.string().oneOf(["Beginner", "Intermediate", "Advanced"]),
      totalModules: Yup.number()
        .typeError("Must be a number")
        .required("Required"),
      totalDuration: Yup.number()
        .typeError("Must be a number")
        .required("Required"),
      enrollmentDeadline: Yup.date()
        .typeError("Invalid date")
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Course Submitted:", values);
      alert("Course added successfully!");
      resetForm();
    },
  });

  return (
    <div className="container my-5">
      <Breadcrumbs title="Courses" breadcrumbItem="Add Course" />

      <div className="card shadow-sm rounded-4 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Course</h3>
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
            {/* Title & Instructor */}
            <div className="col-md-6">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.title && formik.errors.title
                    ? "is-invalid"
                    : ""
                }`}
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter course title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="invalid-feedback">{formik.errors.title}</div>
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
                <div className="invalid-feedback">
                  {formik.errors.instructor}
                </div>
              )}
            </div>

            {/* Price & Category */}
            <div className="col-md-6">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                className={`form-control ${
                  formik.touched.price && formik.errors.price
                    ? "is-invalid"
                    : ""
                }`}
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter course price"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="invalid-feedback">{formik.errors.price}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <Select
                name="category"
                value={formik.values.category}
                onChange={(value) => formik.setFieldValue("category", value)}
                onBlur={formik.handleBlur}
                options={[
                  { value: "UI-UX Design", label: "UI-UX Design" },
                  { value: "Web Development", label: "Web Development" },
                  { value: "Programming", label: "Programming" },
                  {
                    value: "Backend Development",
                    label: "Backend Development",
                  },
                  { value: "Marketing", label: "Marketing" },
                ]}
              />
              {formik.touched.category && formik.errors.category && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.875em" }}
                >
                  {formik.errors.category}
                </div>
              )}
            </div>

            {/* Level & Total Modules */}
            <div className="col-md-6">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                name="level"
                value={formik.values.level}
                onChange={formik.handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Total Modules</label>
              <input
                type="number"
                className={`form-control ${
                  formik.touched.totalModules && formik.errors.totalModules
                    ? "is-invalid"
                    : ""
                }`}
                name="totalModules"
                value={formik.values.totalModules}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter total modules"
              />
              {formik.touched.totalModules && formik.errors.totalModules && (
                <div className="invalid-feedback">
                  {formik.errors.totalModules}
                </div>
              )}
            </div>

            {/* Total Duration & Enrollment Deadline */}
            <div className="col-md-4">
              <label className="form-label">Total Duration (mins)</label>
              <input
                type="number"
                className={`form-control ${
                  formik.touched.totalDuration && formik.errors.totalDuration
                    ? "is-invalid"
                    : ""
                }`}
                name="totalDuration"
                value={formik.values.totalDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter total duration"
              />
              {formik.touched.totalDuration && formik.errors.totalDuration && (
                <div className="invalid-feedback">
                  {formik.errors.totalDuration}
                </div>
              )}
            </div>
            {/* Status */}
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <Select
                name="published"
                value={formik.values.published}
                onChange={(value) => formik.setFieldValue("published", value)}
                onBlur={formik.handleBlur}
                options={[
                  { value: true, label: "Published" },
                  { value: false, label: "Unpublished" },
                ]}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Enrollment Deadline</label>
              <input
                type="date"
                className={`form-control ${
                  formik.touched.enrollmentDeadline &&
                  formik.errors.enrollmentDeadline
                    ? "is-invalid"
                    : ""
                }`}
                name="enrollmentDeadline"
                value={formik.values.enrollmentDeadline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.enrollmentDeadline &&
                formik.errors.enrollmentDeadline && (
                  <div className="invalid-feedback">
                    {formik.errors.enrollmentDeadline}
                  </div>
                )}
            </div>

            {/* Short Description */}
            <div className="col-12">
              <label className="form-label">Short Description</label>
              <textarea
                className={`form-control ${
                  formik.touched.shortDescription &&
                  formik.errors.shortDescription
                    ? "is-invalid"
                    : ""
                }`}
                name="shortDescription"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter short description"
                rows={2}
              />
              {formik.touched.shortDescription &&
                formik.errors.shortDescription && (
                  <div className="invalid-feedback">
                    {formik.errors.shortDescription}
                  </div>
                )}
            </div>

            {/* Long Description */}
            <div className="col-12">
              <label className="form-label">Long Description</label>
              <textarea
                className={`form-control ${
                  formik.touched.longDescription &&
                  formik.errors.longDescription
                    ? "is-invalid"
                    : ""
                }`}
                name="longDescription"
                value={formik.values.longDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter long description"
                rows={4}
              />
              {formik.touched.longDescription &&
                formik.errors.longDescription && (
                  <div className="invalid-feedback">
                    {formik.errors.longDescription}
                  </div>
                )}
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

export default AddCourses;
