import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import toast, { Toaster } from "react-hot-toast";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // loading state
  document.title = "Add Category | LMS Dashboard";

  const generateSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, "-");

  const saved = localStorage.getItem("authUser");
  const parsed = saved ? JSON.parse(saved) : null;
  const token = parsed?.token;
  const role = parsed?.user?.role;

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required("Category name is required"),
      slug: Yup.string().required("Slug is required"),
      description: Yup.string().optional(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!token) {
        toast.error("You must be logged in to add a category.");
        navigate("/login");
        return;
      }

      if (role !== "admin" && role !== "instructor") {
        toast.error("You do not have permission to add categories.");
        return;
      }

      setLoading(true); // start loading
      try {
        const res = await axios.post(
          "https://shekhai-server-production.up.railway.app/api/v1/categories",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Category added successfully!");
        resetForm(); // reset the form immediately
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong while adding category."
        );
      } finally {
        setLoading(false); // stop loading
      }
    },
  });

  return (
    <div className="container my-5">
      <Toaster position="top-right" reverseOrder={false} />
      <Breadcrumbs title="Categories" breadcrumbItem="Add Category" />

      <div className="card shadow-sm rounded-4 p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h3 className="text-primary mb-1">Add New Category</h3>
            <small className="text-muted">
              Fill the form below to add a new category.
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
            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "is-invalid" : ""
                }`}
                name="name"
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue("name", e.target.value);
                  formik.setFieldValue("slug", generateSlug(e.target.value));
                }}
                onBlur={formik.handleBlur}
                placeholder="Enter category name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            {/* Slug */}
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className={`form-control ${
                  formik.touched.slug && formik.errors.slug ? "is-invalid" : ""
                }`}
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="auto-generated from name"
              />
              {formik.touched.slug && formik.errors.slug && (
                <div className="invalid-feedback">{formik.errors.slug}</div>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Write a short description (optional)"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button
              className="btn btn-primary px-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding...
                </>
              ) : (
                "Add Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
