import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // For modals
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const saved = localStorage.getItem("authUser");
  const parsed = saved ? JSON.parse(saved) : null;
  const token = parsed?.token;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/categories"
      );
      setCategories(res.data.categories || res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category with toast confirmation
  const handleDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this category?</p>
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(
                    `https://shekhai-server.onrender.com/api/v1/categories/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setCategories(categories.filter((cat) => cat._id !== id));
                  toast.success("Category deleted successfully!");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete category.");
                }
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-right" }
    );
  };

  // Open view modal
  const handleView = (cat) => {
    setCurrentCategory(cat);
    setViewModal(true);
  };

  // Open edit modal
  const handleEdit = (cat) => {
    setCurrentCategory(cat);
    setEditModal(true);
  };

  // Update category
  const handleUpdate = async () => {
    if (!currentCategory.name || !currentCategory.slug) {
      toast.error("Name and Slug are required.");
      return;
    }

    try {
      const res = await axios.put(
        `https://shekhai-server.onrender.com/api/v1/categories/${currentCategory._id}`,
        currentCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(
        categories.map((c) =>
          c._id === currentCategory._id ? res.data.category : c
        )
      );
      toast.success("Category updated successfully!");
      setEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category.");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container-fluid">
        <Breadcrumbs title="Categories" breadcrumbItem="All Categories" />

        <div className="card mb-3 shadow-none">
          <div className="card-header pt-4 d-flex justify-content-between align-items-center bg-white">
            <div style={{ width: "280px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Add Category Button */}{" "}
            <Link to="/categories/add" className="btn btn-success">
              {" "}
              <i className="mdi mdi-plus me-1"></i> Add Category{" "}
            </Link>
          </div>

          <div className="card-body pt-0">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th style={{ width: "160px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((cat, index) => (
                      <tr key={cat._id}>
                        <td>{index + 1}</td>
                        <td>{cat.name}</td>
                        <td>{cat.slug}</td>
                        <td>{cat.description || "-"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleView(cat)}
                            >
                              <i className="mdi mdi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(cat)}
                            >
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(cat._id)}
                            >
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCategories.length === 0 && (
                  <p className="text-center mt-3">No results found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)}>
        <ModalHeader toggle={() => setViewModal(!viewModal)}>
          Category Details
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>Name:</strong> {currentCategory.name}
          </p>
          <p>
            <strong>Slug:</strong> {currentCategory.slug}
          </p>
          <p>
            <strong>Description:</strong> {currentCategory.description || "-"}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          Edit Category
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Name</Label>
              <Input
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Slug</Label>
              <Input
                value={currentCategory.slug}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    slug: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                value={currentCategory.description}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    description: e.target.value,
                  })
                }
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Save
          </Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Categories;
